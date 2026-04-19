#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx", "python-dotenv", "rich", "typer"]
# ///
"""Hetzner Cloud SSH key management."""

import json
import sys
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Add scripts directory to path for local imports
sys.path.insert(0, str(Path(__file__).parent))

from utils import api_request

app = typer.Typer(help="Manage Hetzner Cloud SSH keys")
console = Console()


def get_ssh_key_by_name(name: str) -> Optional[dict]:
    """Get SSH key by name."""
    response = api_request("GET", "/ssh_keys", params={"name": name})
    keys = response.get("ssh_keys", [])
    return keys[0] if keys else None


@app.command()
def add(
    name: str = typer.Option(..., "--name", "-n", help="SSH key name"),
    public_key: Optional[str] = typer.Option(None, "--public-key", "-k", help="Public key string"),
    public_key_file: Optional[Path] = typer.Option(None, "--public-key-file", "-f", help="Path to public key file"),
    labels: Optional[str] = typer.Option(None, "--labels", "-l", help="Labels as JSON object"),
):
    """Add a new SSH key."""
    console.print(Panel.fit(f"Adding SSH key: {name}", style="bold blue"))
    console.print()

    # Get public key from string or file
    if public_key_file:
        if not public_key_file.exists():
            console.print(f"[red]Error: File not found: {public_key_file}[/red]")
            sys.exit(1)
        key_content = public_key_file.read_text().strip()
    elif public_key:
        key_content = public_key.strip()
    else:
        console.print("[red]Error: Provide either --public-key or --public-key-file[/red]")
        sys.exit(1)

    # Validate key format
    if not key_content.startswith(("ssh-rsa", "ssh-ed25519", "ecdsa-sha2", "ssh-dss")):
        console.print("[red]Error: Invalid SSH public key format[/red]")
        console.print("[dim]Key should start with: ssh-rsa, ssh-ed25519, ecdsa-sha2, or ssh-dss[/dim]")
        sys.exit(1)

    # Check if key already exists
    existing = get_ssh_key_by_name(name)
    if existing:
        console.print(f"[red]Error: SSH key '{name}' already exists (ID: {existing['id']})[/red]")
        sys.exit(1)

    # Build request data
    data = {
        "name": name,
        "public_key": key_content,
    }

    if labels:
        try:
            data["labels"] = json.loads(labels)
        except json.JSONDecodeError:
            console.print("[red]Error: Invalid JSON for labels[/red]")
            sys.exit(1)

    # Create SSH key
    response = api_request("POST", "/ssh_keys", data=data)
    ssh_key = response.get("ssh_key", {})

    console.print("[green]SSH key added successfully![/green]")
    console.print()

    output = {
        "id": ssh_key["id"],
        "name": ssh_key["name"],
        "fingerprint": ssh_key["fingerprint"],
        "created": ssh_key["created"],
    }

    console.print(Panel(json.dumps(output, indent=2), title="SSH Key Details", expand=True))


@app.command()
def list():
    """List all SSH keys."""
    console.print(Panel.fit("Hetzner Cloud SSH Keys", style="bold blue"))
    console.print()

    response = api_request("GET", "/ssh_keys")
    ssh_keys = response.get("ssh_keys", [])

    if not ssh_keys:
        console.print("[yellow]No SSH keys found[/yellow]")
        console.print("\n[dim]Add one with: uv run scripts/ssh_keys.py add ...[/dim]")
        return

    table = Table(expand=True)
    table.add_column("ID", style="dim")
    table.add_column("Name", style="cyan")
    table.add_column("Fingerprint", style="green")
    table.add_column("Created", style="yellow")

    for key in ssh_keys:
        table.add_row(
            str(key["id"]),
            key["name"],
            key["fingerprint"],
            key["created"][:10],  # Just the date part
        )

    console.print(table)


@app.command()
def get(
    id: Optional[int] = typer.Option(None, "--id", help="SSH key ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="SSH key name"),
):
    """Get SSH key details."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if name:
        ssh_key = get_ssh_key_by_name(name)
        if not ssh_key:
            console.print(f"[red]Error: SSH key '{name}' not found[/red]")
            sys.exit(1)
    else:
        response = api_request("GET", f"/ssh_keys/{id}")
        ssh_key = response.get("ssh_key", {})

    output = {
        "id": ssh_key["id"],
        "name": ssh_key["name"],
        "fingerprint": ssh_key["fingerprint"],
        "public_key": ssh_key["public_key"],
        "labels": ssh_key.get("labels", {}),
        "created": ssh_key["created"],
    }

    console.print(Panel(json.dumps(output, indent=2), title=f"SSH Key: {ssh_key['name']}", expand=True))


@app.command()
def delete(
    id: Optional[int] = typer.Option(None, "--id", help="SSH key ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="SSH key name"),
    force: bool = typer.Option(False, "--force", "-f", help="Skip confirmation"),
):
    """Delete an SSH key."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if name:
        ssh_key = get_ssh_key_by_name(name)
        if not ssh_key:
            console.print(f"[red]Error: SSH key '{name}' not found[/red]")
            sys.exit(1)
        id = ssh_key["id"]
        key_name = name
    else:
        response = api_request("GET", f"/ssh_keys/{id}")
        key_name = response.get("ssh_key", {}).get("name", str(id))

    if not force:
        confirm = typer.confirm(f"Delete SSH key '{key_name}' (ID: {id})?")
        if not confirm:
            console.print("[yellow]Cancelled[/yellow]")
            return

    api_request("DELETE", f"/ssh_keys/{id}")
    console.print(f"[green]SSH key '{key_name}' deleted successfully[/green]")


@app.command()
def update(
    id: Optional[int] = typer.Option(None, "--id", help="SSH key ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Current SSH key name"),
    new_name: Optional[str] = typer.Option(None, "--new-name", help="New name for the key"),
    labels: Optional[str] = typer.Option(None, "--labels", "-l", help="Labels as JSON object"),
):
    """Update an SSH key's name or labels."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if not new_name and not labels:
        console.print("[red]Error: Provide --new-name or --labels to update[/red]")
        sys.exit(1)

    if name:
        ssh_key = get_ssh_key_by_name(name)
        if not ssh_key:
            console.print(f"[red]Error: SSH key '{name}' not found[/red]")
            sys.exit(1)
        id = ssh_key["id"]

    data = {}
    if new_name:
        data["name"] = new_name
    if labels:
        try:
            data["labels"] = json.loads(labels)
        except json.JSONDecodeError:
            console.print("[red]Error: Invalid JSON for labels[/red]")
            sys.exit(1)

    response = api_request("PUT", f"/ssh_keys/{id}", data=data)
    ssh_key = response.get("ssh_key", {})

    console.print(f"[green]SSH key updated successfully[/green]")
    console.print(f"[dim]Name: {ssh_key['name']}[/dim]")


if __name__ == "__main__":
    app()
