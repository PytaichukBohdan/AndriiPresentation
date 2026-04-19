#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx", "python-dotenv", "rich", "typer"]
# ///
"""Hetzner Cloud server management."""

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

from utils import api_request, format_server_info

app = typer.Typer(help="Manage Hetzner Cloud servers")
console = Console()


def get_server_by_name(name: str) -> Optional[dict]:
    """Get server by name."""
    response = api_request("GET", "/servers", params={"name": name})
    servers = response.get("servers", [])
    return servers[0] if servers else None


def get_ssh_key_by_name(name: str) -> Optional[dict]:
    """Get SSH key by name."""
    response = api_request("GET", "/ssh_keys", params={"name": name})
    keys = response.get("ssh_keys", [])
    return keys[0] if keys else None


@app.command()
def create(
    name: str = typer.Option(..., "--name", "-n", help="Server name"),
    server_type: str = typer.Option("cx22", "--type", "-t", help="Server type (e.g., cx22, cx32, cpx11)"),
    image: str = typer.Option("ubuntu-24.04", "--image", "-i", help="OS image (e.g., ubuntu-24.04, debian-12)"),
    location: str = typer.Option("fsn1", "--location", "-l", help="Datacenter location (e.g., fsn1, nbg1, hel1)"),
    ssh_key: Optional[str] = typer.Option(None, "--ssh-key", "-k", help="SSH key name to attach"),
    user_data_file: Optional[Path] = typer.Option(None, "--user-data", "-u", help="Cloud-init user data file"),
):
    """Create a new Hetzner Cloud server."""
    console.print(Panel.fit(f"Creating server: {name}", style="bold blue"))
    console.print()

    # Check if server already exists
    existing = get_server_by_name(name)
    if existing:
        console.print(f"[red]Error: Server '{name}' already exists (ID: {existing['id']})[/red]")
        console.print("\n[yellow]Solution: Use a different name or delete existing server:[/yellow]")
        console.print(f"  uv run scripts/servers.py delete --name {name}")
        sys.exit(1)

    # Build request data
    data = {
        "name": name,
        "server_type": server_type,
        "image": image,
        "location": location,
        "start_after_create": True,
    }

    # Add SSH key if specified
    if ssh_key:
        key = get_ssh_key_by_name(ssh_key)
        if not key:
            console.print(f"[red]Error: SSH key '{ssh_key}' not found[/red]")
            console.print("\n[yellow]Available SSH keys:[/yellow]")
            response = api_request("GET", "/ssh_keys")
            for k in response.get("ssh_keys", []):
                console.print(f"  - {k['name']}")
            console.print("\n[dim]Add a new key with: uv run scripts/ssh_keys.py add ...[/dim]")
            sys.exit(1)
        data["ssh_keys"] = [key["id"]]

    # Add user data if specified
    if user_data_file:
        if not user_data_file.exists():
            console.print(f"[red]Error: User data file not found: {user_data_file}[/red]")
            sys.exit(1)
        data["user_data"] = user_data_file.read_text()

    console.print(f"[dim]Server type: {server_type}[/dim]")
    console.print(f"[dim]Image: {image}[/dim]")
    console.print(f"[dim]Location: {location}[/dim]")
    if ssh_key:
        console.print(f"[dim]SSH key: {ssh_key}[/dim]")
    console.print()

    # Create server
    response = api_request("POST", "/servers", data=data)

    server = response.get("server", {})
    root_password = response.get("root_password")

    info = format_server_info(server)

    console.print("[green]Server created successfully![/green]")
    console.print()

    # Output as JSON for easy parsing
    output = {
        "id": info["id"],
        "name": info["name"],
        "public_ipv4": info["public_ipv4"],
        "public_ipv6": info["public_ipv6"],
        "status": info["status"],
        "server_type": info["server_type"],
        "datacenter": info["datacenter"],
    }

    if root_password:
        output["root_password"] = root_password
        console.print("[yellow]Warning: Root password generated (no SSH key was used)[/yellow]")
        console.print(f"[yellow]Password: {root_password}[/yellow]")
        console.print()

    console.print(Panel(json.dumps(output, indent=2), title="Server Details", expand=True))

    console.print()
    console.print(f"[dim]Connect via: ssh root@{info['public_ipv4']}[/dim]")


@app.command()
def list():
    """List all servers."""
    console.print(Panel.fit("Hetzner Cloud Servers", style="bold blue"))
    console.print()

    response = api_request("GET", "/servers")
    servers = response.get("servers", [])

    if not servers:
        console.print("[yellow]No servers found[/yellow]")
        return

    table = Table(expand=True)
    table.add_column("ID", style="dim")
    table.add_column("Name", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("IPv4", style="yellow")
    table.add_column("Type", style="magenta")
    table.add_column("Location", style="blue")

    for server in servers:
        info = format_server_info(server)
        status_style = "green" if info["status"] == "running" else "yellow"
        table.add_row(
            str(info["id"]),
            info["name"],
            f"[{status_style}]{info['status']}[/{status_style}]",
            info["public_ipv4"],
            info["server_type"],
            info["datacenter"],
        )

    console.print(table)


@app.command()
def get(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
):
    """Get server details."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if name:
        server = get_server_by_name(name)
        if not server:
            console.print(f"[red]Error: Server '{name}' not found[/red]")
            sys.exit(1)
    else:
        response = api_request("GET", f"/servers/{id}")
        server = response.get("server", {})

    info = format_server_info(server)
    console.print(Panel(json.dumps(info, indent=2, default=str), title=f"Server: {info['name']}", expand=True))


@app.command()
def delete(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
    force: bool = typer.Option(False, "--force", "-f", help="Skip confirmation"),
):
    """Delete a server."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if name:
        server = get_server_by_name(name)
        if not server:
            console.print(f"[red]Error: Server '{name}' not found[/red]")
            sys.exit(1)
        id = server["id"]
        server_name = name
    else:
        response = api_request("GET", f"/servers/{id}")
        server_name = response.get("server", {}).get("name", str(id))

    if not force:
        confirm = typer.confirm(f"Delete server '{server_name}' (ID: {id})?")
        if not confirm:
            console.print("[yellow]Cancelled[/yellow]")
            return

    api_request("DELETE", f"/servers/{id}")
    console.print(f"[green]Server '{server_name}' deleted successfully[/green]")


@app.command("power-off")
def power_off(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
):
    """Power off a server (graceful shutdown)."""
    server_id = _resolve_server_id(id, name)
    api_request("POST", f"/servers/{server_id}/actions/shutdown")
    console.print(f"[green]Server shutdown initiated[/green]")


@app.command("power-on")
def power_on(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
):
    """Power on a server."""
    server_id = _resolve_server_id(id, name)
    api_request("POST", f"/servers/{server_id}/actions/poweron")
    console.print(f"[green]Server powered on[/green]")


@app.command()
def reboot(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
):
    """Reboot a server (graceful restart)."""
    server_id = _resolve_server_id(id, name)
    api_request("POST", f"/servers/{server_id}/actions/reboot")
    console.print(f"[green]Server reboot initiated[/green]")


@app.command()
def reset(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
):
    """Reset a server (hard reboot)."""
    server_id = _resolve_server_id(id, name)
    api_request("POST", f"/servers/{server_id}/actions/reset")
    console.print(f"[yellow]Server reset initiated (hard reboot)[/yellow]")


@app.command()
def rebuild(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
    image: str = typer.Option(..., "--image", "-i", help="New OS image"),
):
    """Rebuild a server with a new image (reinstall OS)."""
    server_id = _resolve_server_id(id, name)

    confirm = typer.confirm(f"Rebuild server with image '{image}'? This will DESTROY all data!")
    if not confirm:
        console.print("[yellow]Cancelled[/yellow]")
        return

    api_request("POST", f"/servers/{server_id}/actions/rebuild", data={"image": image})
    console.print(f"[green]Server rebuild initiated with image: {image}[/green]")


@app.command()
def resize(
    id: Optional[int] = typer.Option(None, "--id", help="Server ID"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Server name"),
    server_type: str = typer.Option(..., "--type", "-t", help="New server type"),
    upgrade_disk: bool = typer.Option(False, "--upgrade-disk", help="Also upgrade disk size"),
):
    """Resize a server to a different type (requires server to be off)."""
    server_id = _resolve_server_id(id, name)

    api_request(
        "POST",
        f"/servers/{server_id}/actions/change_type",
        data={
            "server_type": server_type,
            "upgrade_disk": upgrade_disk,
        },
    )
    console.print(f"[green]Server resize initiated to type: {server_type}[/green]")
    if upgrade_disk:
        console.print("[yellow]Note: Disk upgrade is irreversible - cannot downgrade later[/yellow]")


def _resolve_server_id(id: Optional[int], name: Optional[str]) -> int:
    """Resolve server ID from id or name."""
    if not id and not name:
        console.print("[red]Error: Provide either --id or --name[/red]")
        sys.exit(1)

    if name:
        server = get_server_by_name(name)
        if not server:
            console.print(f"[red]Error: Server '{name}' not found[/red]")
            sys.exit(1)
        return server["id"]

    return id


if __name__ == "__main__":
    app()
