---
name: browser-use
description: Browser automation using Browser Use CLI. Use when you need headless browsing, parallel browser sessions, UI testing, screenshots, web scraping, or browser automation. Supports real Chrome with existing logins via --profile. Keywords - browser-use, headless, browser, test, screenshot, scrape, parallel, QA.
allowed-tools: Bash
---

# Browser Use

## Purpose

Automate browsers using `browser-use` — a token-efficient CLI for browser automation. Runs headless by default, supports parallel sessions via named sessions (`-s`), and uses a daemon architecture for ~50ms command latency.

## Key Details

- **Headless by default** — pass `--headed` (global flag, before subcommand) to see the browser
- **Parallel sessions** — use `-s <name>` or `--session <name>` to run multiple independent browser instances
- **Daemon-based persistence** — browser state (cookies, localStorage) persists automatically across commands via a background daemon per session
- **Real Chrome support** — use `--profile` to launch your real Chrome with existing logins and cookies
- **Token-efficient** — CLI-based, no accessibility trees or tool schemas in context
- **Element indexes** — `state` returns numeric indexes for clickable elements; all interaction commands use these indexes

## Sessions

**Always use a named session.** Derive a short, descriptive kebab-case name from the user's prompt. Each session gets its own daemon process with persistent browser state.

```bash
# Derive session name from prompt context:
# "test the checkout flow on mystore.com" → -s mystore-checkout
# "scrape pricing from competitor.com"    → -s competitor-pricing
# "UI test the login page"               → -s login-ui-test

browser-use -s mystore-checkout open https://mystore.com
browser-use -s mystore-checkout state
browser-use -s mystore-checkout click 12
```

Managing sessions:
```bash
browser-use sessions                              # list all active sessions
browser-use close --all                            # close all sessions
browser-use -s <name> close                        # close specific session
browser-use -s <name> cookies clear                # clear session cookies
```

## Quick Reference

```
Core:       open <url>, click <index>, input <index> <text>, type <text>, state, screenshot [path], close
Navigate:   back, scroll [up|down], scroll down --amount 1000
Keyboard:   keys "<key>", keys "Control+a"
Mouse:      hover <index>, dblclick <index>, rightclick <index>
Tabs:       switch <n>, close-tab [n]
Save:       screenshot [path], screenshot --full path.png
Info:       get title, get html, get text <index>, get value <index>, get attributes <index>, get bbox <index>
Cookies:    cookies get, cookies set <name> <val>, cookies clear, cookies export <file>, cookies import <file>
Wait:       wait selector "<css>", wait text "<text>", wait selector "<css>" --timeout 5000
JS:         eval "<code>"
Sessions:   -s <name> <cmd>, sessions, close, close --all
Config:     --headed, --profile [name], --browser real
```

## Workflow

1. Derive a session name from the user's prompt and open the URL:
```bash
browser-use -s <session-name> open <url>
# or headed (visible browser):
browser-use -s <session-name> --headed open <url>
# or real Chrome with existing logins:
browser-use -s <session-name> --profile open <url>
```

2. Get clickable element indexes via state:
```bash
browser-use -s <session-name> state
```

3. Interact using indexes from state:
```bash
browser-use -s <session-name> click <index>
browser-use -s <session-name> input <index> "text"
browser-use -s <session-name> type "text"
browser-use -s <session-name> keys "Enter"
```

4. Capture results:
```bash
browser-use -s <session-name> screenshot
browser-use -s <session-name> screenshot output.png
browser-use -s <session-name> screenshot --full fullpage.png
```

5. **Always close the session when done:**
```bash
browser-use -s <session-name> close
```

## Element Indexes

Unlike playwright-cli which used element refs (e.g. `e12`), browser-use uses numeric indexes returned by `state`. Always call `state` before interacting to get fresh indexes — they may change after navigation or DOM updates.

```bash
browser-use -s demo state
# Output includes: [12] "Submit" button, [13] "Cancel" link, etc.
browser-use -s demo click 12
```

## Unsupported Features

The following playwright-cli features have no equivalent in browser-use:
- **Network interception** (`route`, `unroute`, `network`) — use browser DevTools or a proxy instead
- **Tracing** (`tracing-start`, `tracing-stop`) — use screenshots and `eval` for debugging
- **Video recording** (`video-start`, `video-stop`) — use system screen recording
- **Console log capture** (`console`) — inject custom JS via `eval` to capture console output

## Full Help

Run `browser-use --help` or `browser-use <command> --help` for detailed command usage.

See [docs/browser-use-cli.md](docs/browser-use-cli.md) for full documentation.
