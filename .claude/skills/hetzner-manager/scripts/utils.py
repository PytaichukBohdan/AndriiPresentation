# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx", "python-dotenv", "rich"]
# ///
"""Shared utilities for Hetzner Cloud API interactions."""

import os
import sys
import time
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from rich.console import Console

console = Console()

HETZNER_API_BASE = "https://api.hetzner.cloud/v1"


def load_api_token() -> str:
    """Load Hetzner API token from environment."""
    # Try loading from current directory first, then walk up
    current = Path.cwd()
    while current != current.parent:
        env_file = current / ".env"
        if env_file.exists():
            load_dotenv(env_file)
            break
        current = current.parent

    # Also try the project root
    load_dotenv()

    token = os.getenv("HETZNER_API_TOKEN")
    if not token:
        console.print("[red]Error: HETZNER_API_TOKEN not found in environment[/red]")
        console.print("\n[yellow]Solution: Add to your .env file:[/yellow]")
        console.print('  HETZNER_API_TOKEN=your_token_here')
        console.print("\n[dim]Get your token at: https://console.hetzner.cloud/[/dim]")
        sys.exit(1)
    return token


def get_client() -> httpx.Client:
    """Get an HTTP client configured for Hetzner API."""
    token = load_api_token()
    return httpx.Client(
        base_url=HETZNER_API_BASE,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=30.0,
    )


def api_request(
    method: str,
    endpoint: str,
    data: dict | None = None,
    params: dict | None = None,
    retries: int = 3,
) -> dict[str, Any]:
    """Make an API request with retry logic."""
    with get_client() as client:
        for attempt in range(retries):
            try:
                response = client.request(
                    method=method,
                    url=endpoint,
                    json=data,
                    params=params,
                )

                if response.status_code == 429:
                    # Rate limited - wait and retry
                    wait_time = 2 ** attempt
                    console.print(f"[yellow]Rate limited. Waiting {wait_time}s...[/yellow]")
                    time.sleep(wait_time)
                    continue

                if response.status_code == 401:
                    console.print("[red]Error: Authentication failed (401)[/red]")
                    console.print("\n[yellow]Solution: Check your HETZNER_API_TOKEN[/yellow]")
                    console.print("  - Token may have expired")
                    console.print("  - Token may have been revoked")
                    console.print("  - Generate new token at: https://console.hetzner.cloud/")
                    sys.exit(1)

                if response.status_code == 403:
                    console.print("[red]Error: Forbidden (403)[/red]")
                    console.print("\n[yellow]Your API token lacks required permissions[/yellow]")
                    console.print("  Create a new token with Read & Write permissions")
                    sys.exit(1)

                if response.status_code >= 400:
                    error_data = response.json() if response.text else {}
                    error_msg = error_data.get("error", {}).get("message", response.text)
                    error_code = error_data.get("error", {}).get("code", "unknown")
                    console.print(f"[red]Error: {error_msg} ({error_code})[/red]")
                    sys.exit(1)

                return response.json() if response.text else {}

            except httpx.TimeoutException:
                if attempt < retries - 1:
                    wait_time = 2 ** attempt
                    console.print(f"[yellow]Request timeout. Retrying in {wait_time}s...[/yellow]")
                    time.sleep(wait_time)
                else:
                    console.print("[red]Error: Request timed out after retries[/red]")
                    sys.exit(1)
            except httpx.RequestError as e:
                console.print(f"[red]Error: Network error - {e}[/red]")
                sys.exit(1)

    return {}


def format_server_info(server: dict) -> dict:
    """Format server info for display."""
    public_net = server.get("public_net", {})
    ipv4 = public_net.get("ipv4", {}).get("ip", "N/A")
    ipv6 = public_net.get("ipv6", {}).get("ip", "N/A")

    return {
        "id": server["id"],
        "name": server["name"],
        "status": server["status"],
        "public_ipv4": ipv4,
        "public_ipv6": ipv6,
        "server_type": server["server_type"]["name"],
        "datacenter": server["datacenter"]["name"],
        "image": server.get("image", {}).get("name", "N/A") if server.get("image") else "N/A",
        "created": server["created"],
    }
