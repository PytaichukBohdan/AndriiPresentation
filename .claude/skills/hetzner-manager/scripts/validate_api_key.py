#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx", "python-dotenv", "rich"]
# ///
"""Validate Hetzner Cloud API token and display account info."""

import sys
from pathlib import Path

# Add scripts directory to path for local imports
sys.path.insert(0, str(Path(__file__).parent))

from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from utils import api_request, load_api_token

console = Console()


def validate_token() -> None:
    """Validate API token and display account information."""
    console.print(Panel.fit("Hetzner API Token Validation", style="bold blue"))
    console.print()

    # Load and mask token for display
    token = load_api_token()
    masked_token = f"{'*' * 28}{token[-4:]}"
    console.print(f"[dim]API Token: {masked_token}[/dim]")
    console.print()

    # Test token by fetching datacenters
    console.print("[dim]Testing API access...[/dim]")

    try:
        # Get datacenters to verify token works
        dc_response = api_request("GET", "/datacenters")
        datacenters = dc_response.get("datacenters", [])

        console.print("[green]Token Status: valid[/green]")
        console.print()

        # Display available datacenters
        if datacenters:
            table = Table(title="Available Datacenters", expand=True)
            table.add_column("Code", style="cyan")
            table.add_column("Name", style="green")
            table.add_column("Location", style="yellow")
            table.add_column("City", style="magenta")

            for dc in datacenters:
                location = dc.get("location", {})
                table.add_row(
                    dc["name"],
                    dc.get("description", ""),
                    location.get("name", ""),
                    location.get("city", ""),
                )

            console.print(table)

        # Get server types for reference
        console.print()
        st_response = api_request("GET", "/server_types")
        server_types = st_response.get("server_types", [])

        if server_types:
            table = Table(title="Available Server Types (showing first 10)", expand=True)
            table.add_column("Type", style="cyan")
            table.add_column("vCPUs", justify="right", style="green")
            table.add_column("RAM", justify="right", style="yellow")
            table.add_column("Disk", justify="right", style="magenta")
            table.add_column("Architecture", style="blue")

            for st in server_types[:10]:
                table.add_row(
                    st["name"],
                    str(st["cores"]),
                    f"{st['memory']} GB",
                    f"{st['disk']} GB",
                    st.get("architecture", "x86"),
                )

            console.print(table)

        # Get current servers count
        console.print()
        servers_response = api_request("GET", "/servers")
        servers = servers_response.get("servers", [])
        console.print(f"[dim]Current servers in account: {len(servers)}[/dim]")

        # Get SSH keys count
        ssh_response = api_request("GET", "/ssh_keys")
        ssh_keys = ssh_response.get("ssh_keys", [])
        console.print(f"[dim]SSH keys configured: {len(ssh_keys)}[/dim]")

        console.print()
        console.print("[green]API token is valid and working![/green]")

    except SystemExit:
        raise
    except Exception as e:
        console.print(f"[red]Validation failed: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    validate_token()
