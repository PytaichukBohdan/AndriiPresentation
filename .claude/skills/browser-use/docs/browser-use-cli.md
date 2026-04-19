# Browser Use CLI — Complete Reference

Source: https://docs.browser-use.com/open-source/browser-use-cli

## Installation

```bash
# One-line install (macOS/Linux)
curl -fsSL https://browser-use.com/cli/install.sh | bash

# Manual install
uv pip install browser-use
browser-use install    # Install Chromium + dependencies
browser-use doctor     # Validate installation
browser-use setup      # Optional guided setup
```

## Browser Modes

```bash
browser-use open <url>                              # Headless Chromium (default)
browser-use --headed open <url>                     # Visible browser window
browser-use --profile open <url>                    # Real Chrome, "Default" profile
browser-use --profile "Profile 1" open <url>        # Real Chrome, specific profile
browser-use --connect open <url>                    # Auto-discover running Chrome via CDP
browser-use --cdp-url http://localhost:9222 open <url>  # Connect via CDP URL
```

## Session Architecture

Daemon-based architecture: first command starts a background daemon per session. Subsequent commands communicate via Unix socket (~50ms latency). Browser state persists across commands.

```bash
browser-use -s <name> <command>                     # Target named session
browser-use --session <name> <command>               # Same, long form
BROWSER_USE_SESSION=<name> browser-use <command>     # Env var fallback
browser-use sessions                                 # List active sessions
browser-use -s <name> close                          # Close specific session
browser-use close --all                              # Close all sessions
```

## Navigation

| Command | Description |
|---------|-------------|
| `open <url>` | Navigate to URL |
| `back` | Go back in history |
| `scroll down` | Scroll down |
| `scroll up` | Scroll up |
| `scroll down --amount 1000` | Scroll by pixels |

## Inspection

| Command | Description |
|---------|-------------|
| `state` | Get URL, title, and clickable elements with indexes |
| `screenshot [path]` | Take screenshot (base64 if no path) |
| `screenshot --full path.png` | Full page screenshot |

## Interaction

| Command | Description |
|---------|-------------|
| `click <index>` | Click element by index |
| `click <x> <y>` | Click at pixel coordinates |
| `type "text"` | Type into focused element |
| `input <index> "text"` | Click element, then type |
| `keys "Enter"` | Send keyboard key |
| `keys "Control+a"` | Send key combination |
| `select <index> "value"` | Select dropdown option |
| `hover <index>` | Hover over element |
| `dblclick <index>` | Double-click element |
| `rightclick <index>` | Right-click element |

## Tab Management

| Command | Description |
|---------|-------------|
| `switch <n>` | Switch to tab by index |
| `close-tab` | Close current tab |
| `close-tab <n>` | Close specific tab |

## Cookies

```bash
cookies get                                          # Get all cookies
cookies get --url <url>                              # Get cookies for URL
cookies set <name> <value>                           # Set a cookie
cookies set name val --domain .example.com --secure  # With options
cookies set name val --same-site Strict              # SameSite policy
cookies set name val --expires 1735689600            # With expiration
cookies clear                                        # Clear all cookies
cookies clear --url <url>                            # Clear for URL
cookies export <file>                                # Export to JSON
cookies import <file>                                # Import from JSON
```

## Wait Conditions

| Command | Description |
|---------|-------------|
| `wait selector "<css>"` | Wait for element visible |
| `wait selector ".loading" --state hidden` | Wait for element to disappear |
| `wait text "Success"` | Wait for text to appear |
| `wait selector "h1" --timeout 5000` | Custom timeout (ms) |

## Information Retrieval

| Command | Description |
|---------|-------------|
| `get title` | Page title |
| `get html` | Full page HTML |
| `get html --selector "h1"` | HTML of specific element |
| `get text <index>` | Text content of element |
| `get value <index>` | Value of input/textarea |
| `get attributes <index>` | All attributes of element |
| `get bbox <index>` | Bounding box (x, y, width, height) |

## JavaScript Execution

```bash
eval "document.title"                                # Execute JavaScript
eval "window.scrollTo(0, document.body.scrollHeight)"
```

## Python Integration

```bash
browser-use python "x = 42"                         # Set variable
browser-use python "print(x)"                        # Access variable
browser-use python "print(browser.url)"              # Access browser
browser-use python --vars                            # Show defined variables
browser-use python --reset                           # Clear namespace
browser-use python --file script.py                  # Run Python file
```

## Cloud API

```bash
cloud connect                                        # Provision cloud browser
cloud connect --timeout 120                          # With timeout
cloud connect --proxy-country US                     # With proxy
cloud login <api-key>                                # Save API key
cloud logout                                         # Remove API key
cloud v2 GET <path>                                  # API v2 request
cloud v2 POST <path> '<json>'                        # API v2 POST
cloud v3 POST <path> '<json>'                        # API v3 POST
cloud v2 poll <task-id>                              # Poll task
```

## Tunneling

```bash
tunnel <port>                                        # Start tunnel, get public URL
tunnel list                                          # List active tunnels
tunnel stop <port>                                   # Stop tunnel for port
tunnel stop --all                                    # Stop all tunnels
```

## Profile Management

```bash
profile                                              # Interactive sync wizard
profile list                                         # List detected browsers
profile sync --all                                   # Sync all to cloud
profile sync --browser "Google Chrome" --profile "Default"  # Sync specific
profile inspect --browser "Google Chrome" --profile "Default"  # Inspect cookies
```

## Global Options

| Option | Description |
|--------|-------------|
| `--headed` | Show browser window |
| `--profile [NAME]` | Use real Chrome (default: "Default" profile) |
| `--connect` | Auto-discover running Chrome via CDP |
| `--cdp-url <url>` | Connect via CDP URL |
| `-s NAME` / `--session NAME` | Target named session |
| `--json` | Output as JSON |
| `--mcp` | Run as MCP server |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BROWSER_USE_SESSION` | Default session name |
| `BROWSER_USE_HOME` | Override `~/.browser-use/` directory |
| `BROWSER_USE_API_KEY` | API key (alternative to `cloud login`) |

## File Layout

```
~/.browser-use/
├── config.json          # API key, settings
├── bin/
│   └── profile-use      # Managed Go binary
├── tunnels/
│   ├── {port}.json      # Tunnel metadata
│   └── {port}.log       # Tunnel logs
├── default.sock         # Daemon socket
├── default.pid          # Daemon PID
└── cli.log              # Daemon log
```

## Migration from Playwright-CLI

| playwright-cli | browser-use |
|---|---|
| `-s=<name>` | `-s <name>` |
| `open <url> --persistent` | `open <url>` |
| `--headed` after subcommand | `--headed` before subcommand |
| `snapshot` | `state` |
| `click <ref>` (element ref) | `click <index>` (numeric index) |
| `fill <ref> "text"` | `input <index> "text"` |
| `press <key>` | `keys "<key>"` |
| `screenshot --filename=f` | `screenshot f` |
| `go-back` | `back` |
| `close-all` | `close --all` |
| `list` | `sessions` |
| `run-code <js>` | `eval "<js>"` |
| `tab-select <n>` | `switch <n>` |
| `tab-close` | `close-tab` |
| `console` | `eval "..."` (custom JS) |
