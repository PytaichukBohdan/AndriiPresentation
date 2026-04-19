---
name: hetzner-manager
description: Deploys and manages Hetzner Cloud servers, SSH keys, networks, volumes, and firewalls. Use when deploying Hetzner instances, creating cloud servers, managing SSH keys, or configuring Hetzner infrastructure. Requires HETZNER_API_TOKEN in .env file.
---

# Hetzner Cloud Manager

Comprehensive Hetzner Cloud infrastructure management skill for deploying servers, managing SSH keys, networks, volumes, and firewalls via the Hetzner Cloud API.

## Initial Setup

Before using this skill for the first time:

### 1. Configure API Token

Add your Hetzner Cloud API token to your project's `.env` file:

```bash
HETZNER_API_TOKEN=your_api_token_here
```

**Getting your API token**:
1. Log in to [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Select your project (or create one)
3. Go to **Security** > **API Tokens**
4. Click **Generate API Token**
5. Choose **Read & Write** permissions
6. Copy and save the token (it's only shown once!)

### 2. Validate Credentials

Run validation to verify your API token:

```bash
cd .claude/skills/hetzner-manager
uv run scripts/validate_api_key.py
```

**Expected output**:
```
Hetzner API Token Validation
============================
API Token: ****************************ABC1
Token Status: valid
Remaining Requests: 3600/hour

Available Datacenters:
  - fsn1-dc14 (Falkenstein 1 DC14)
  - nbg1-dc3 (Nuremberg 1 DC3)
  - hel1-dc2 (Helsinki 1 DC2)
  - ash-dc1 (Ashburn, VA DC1)
  - hil-dc1 (Hillsboro, OR DC1)
```

## Quick Reference

### Server Types (Common)

| Type | vCPUs | RAM | Disk | Price/mo |
|------|-------|-----|------|----------|
| cx22 | 2 | 4GB | 40GB | ~€4 |
| cx32 | 4 | 8GB | 80GB | ~€8 |
| cx42 | 8 | 16GB | 160GB | ~€15 |
| cx52 | 16 | 32GB | 320GB | ~€29 |
| cpx11 | 2 | 2GB | 40GB | ~€4 |
| cpx21 | 3 | 4GB | 80GB | ~€8 |
| cpx31 | 4 | 8GB | 160GB | ~€15 |

### Datacenters

| Location | Code | Region |
|----------|------|--------|
| Falkenstein | fsn1 | Germany |
| Nuremberg | nbg1 | Germany |
| Helsinki | hel1 | Finland |
| Ashburn | ash | USA East |
| Hillsboro | hil | USA West |

### Images

| Image | Description |
|-------|-------------|
| ubuntu-24.04 | Ubuntu 24.04 LTS |
| ubuntu-22.04 | Ubuntu 22.04 LTS |
| debian-12 | Debian 12 |
| rocky-9 | Rocky Linux 9 |
| fedora-40 | Fedora 40 |

## Server Management

### Create a Server

```bash
uv run scripts/servers.py create \
  --name my-server \
  --type cx22 \
  --image ubuntu-24.04 \
  --location fsn1 \
  --ssh-key my-key
```

**Options**:
- `--name`: Server name (required)
- `--type`: Server type (default: cx22)
- `--image`: OS image (default: ubuntu-24.04)
- `--location`: Datacenter location (default: fsn1)
- `--ssh-key`: SSH key name to attach (recommended)
- `--user-data`: Cloud-init user data file path

**Returns**:
```json
{
  "id": 12345678,
  "name": "my-server",
  "public_ipv4": "65.108.xxx.xxx",
  "public_ipv6": "2a01:4f8:xxx::1",
  "status": "running",
  "server_type": "cx22",
  "datacenter": "fsn1-dc14"
}
```

### List All Servers

```bash
uv run scripts/servers.py list
```

### Get Server Details

```bash
uv run scripts/servers.py get --id 12345678
# or
uv run scripts/servers.py get --name my-server
```

### Delete a Server

```bash
uv run scripts/servers.py delete --id 12345678
# or
uv run scripts/servers.py delete --name my-server
```

### Server Power Actions

```bash
# Power off
uv run scripts/servers.py power-off --name my-server

# Power on
uv run scripts/servers.py power-on --name my-server

# Reboot
uv run scripts/servers.py reboot --name my-server

# Reset (hard reboot)
uv run scripts/servers.py reset --name my-server
```

### Rebuild Server (Reinstall OS)

```bash
uv run scripts/servers.py rebuild --name my-server --image ubuntu-24.04
```

## SSH Key Management

### Add SSH Key

```bash
uv run scripts/ssh_keys.py add \
  --name my-key \
  --public-key "ssh-ed25519 AAAA... user@host"
```

Or from a file:
```bash
uv run scripts/ssh_keys.py add \
  --name my-key \
  --public-key-file ~/.ssh/id_ed25519.pub
```

### List SSH Keys

```bash
uv run scripts/ssh_keys.py list
```

### Delete SSH Key

```bash
uv run scripts/ssh_keys.py delete --name my-key
```

## Common Workflows

### Deploy a New Server with SSH Access

1. **Add your SSH key** (if not already added):
   ```bash
   uv run scripts/ssh_keys.py add \
     --name my-laptop \
     --public-key-file ~/.ssh/id_ed25519.pub
   ```

2. **Create the server**:
   ```bash
   uv run scripts/servers.py create \
     --name web-server \
     --type cx22 \
     --image ubuntu-24.04 \
     --location fsn1 \
     --ssh-key my-laptop
   ```

3. **Connect via SSH**:
   ```bash
   ssh root@<public_ipv4>
   ```

### Deploy Server with Cloud-Init

Create a `cloud-init.yaml`:
```yaml
#cloud-config
packages:
  - docker.io
  - docker-compose
runcmd:
  - systemctl enable docker
  - systemctl start docker
```

Deploy with user data:
```bash
uv run scripts/servers.py create \
  --name docker-host \
  --type cx32 \
  --image ubuntu-24.04 \
  --ssh-key my-key \
  --user-data cloud-init.yaml
```

### Scale Up Server

Note: Hetzner requires server to be powered off for rescaling:

```bash
# Power off
uv run scripts/servers.py power-off --name my-server

# Resize (upgrade)
uv run scripts/servers.py resize --name my-server --type cx32

# Power on
uv run scripts/servers.py power-on --name my-server
```

## Error Handling

### Invalid API Token

```
Error: Authentication failed (401)

Solution: Check your HETZNER_API_TOKEN in .env file
  - Token may have expired
  - Token may have been revoked
  - Generate new token at: https://console.hetzner.cloud/
```

### Rate Limiting

```
Error: Rate limit exceeded (429)

Solution: Wait and retry
  - Limit: 3600 requests/hour
  - Scripts automatically retry with backoff
```

### Server Name Already Exists

```
Error: Server name 'my-server' already exists

Solution: Use a different name or delete existing server
  uv run scripts/servers.py list
  uv run scripts/servers.py delete --name my-server
```

### Insufficient Quota

```
Error: Insufficient server quota

Solution: Request quota increase in Hetzner console
  - Go to: Project Settings > Limits
  - Click "Request Limit Increase"
```

## Best Practices

**Security**:
- Always use SSH keys, never password authentication
- Never commit `.env` file to git
- Rotate API tokens periodically
- Use firewalls to restrict access

**Cost Optimization**:
- Delete unused servers (you're billed hourly)
- Use snapshots for backups instead of volumes when possible
- Choose appropriate server size (start small, scale up)
- Use ARM servers (cax*) for 30-40% cost savings

**Naming Conventions**:
- Use descriptive names: `web-prod-01`, `db-staging`
- Include environment: `api-prod`, `api-dev`
- Use consistent patterns across infrastructure

## Reddit Warmup Scheduler Deployment

The Reddit warmup scheduler is deployed on Hetzner server **5.161.62.252** at `/opt/reddit-warmup/deployment/`.

### Check Deployment Status

```bash
ssh root@5.161.62.252 'docker ps --filter name=reddit-warmup'
```

**Expected output**:
```
CONTAINER ID   IMAGE                  STATUS                    PORTS
fc87b5a5dec3   deployment-scheduler   Up 2 hours (healthy)      0.0.0.0:8080->8080/tcp
809c11af6712   postgres:15-alpine     Up 3 days (healthy)       0.0.0.0:5433->5432/tcp
```

### Start Containers

```bash
ssh root@5.161.62.252 'cd /opt/reddit-warmup/deployment && docker compose up -d'
```

### Stop Containers

```bash
ssh root@5.161.62.252 'cd /opt/reddit-warmup/deployment && docker compose down'
```

### View Logs

**Scheduler logs (last 50 lines)**:
```bash
ssh root@5.161.62.252 'docker logs reddit-warmup-scheduler --tail 50'
```

**Follow logs in real-time**:
```bash
ssh root@5.161.62.252 'docker logs reddit-warmup-scheduler -f'
```

**Database logs**:
```bash
ssh root@5.161.62.252 'docker logs reddit-warmup-db --tail 50'
```

### Rebuild and Redeploy

After making code changes, rebuild and redeploy:

**1. Sync updated code to server**:
```bash
rsync -avz --exclude='.git' --exclude='__pycache__' --exclude='.venv' \
  adws/ root@5.161.62.252:/opt/reddit-warmup/adws/

rsync -avz scripts/ root@5.161.62.252:/opt/reddit-warmup/scripts/
```

**2. Rebuild and restart**:
```bash
ssh root@5.161.62.252 'cd /opt/reddit-warmup/deployment && \
  docker compose down && \
  docker compose up -d --build'
```

**3. Verify deployment**:
```bash
ssh root@5.161.62.252 'docker ps && docker logs reddit-warmup-scheduler --tail 20'
```

### Check Health Endpoint

```bash
curl http://5.161.62.252:8080/health
```

**Expected response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-03T04:00:00Z",
  "uptime_seconds": 7200.5,
  "components": {
    "scheduler": {"status": "healthy", "running": true, "active_jobs": 1219},
    "database": {"status": "healthy", "latency_ms": 2.5},
    "browser_pool": {"status": "healthy", "available": 10}
  },
  "version": "1.0.0"
}
```

### Check Execution Status

**View recent successful executions**:
```bash
ssh root@5.161.62.252 "docker exec reddit-warmup-scheduler python -c \"
import asyncio, asyncpg, os

async def main():
    conn = await asyncpg.connect(os.environ['DATABASE_URL'])
    results = await conn.fetch('''
        SELECT ra.username, dcj.job_type, djr.completed_at
        FROM dynamic_job_results djr
        JOIN dynamic_cron_jobs dcj ON djr.job_id = dcj.id
        JOIN reddit_accounts ra ON dcj.account_id = ra.id
        WHERE djr.success = true
        ORDER BY djr.completed_at DESC
        LIMIT 10
    ''')
    for r in results:
        print(f'{r[2].strftime(\\\"%m-%d %H:%M\\\")} | {r[0]:20} | {r[1]}')
    await conn.close()

asyncio.run(main())
\""
```

**View job status summary**:
```bash
ssh root@5.161.62.252 "docker exec reddit-warmup-scheduler python -c \"
import asyncio, asyncpg, os

async def main():
    conn = await asyncpg.connect(os.environ['DATABASE_URL'])
    stats = await conn.fetch('''
        SELECT status, COUNT(*) FROM dynamic_cron_jobs GROUP BY status
    ''')
    print('Job Status:')
    for s in stats: print(f'  {s[0]:12} : {s[1]:5} jobs')
    await conn.close()

asyncio.run(main())
\""
```

### Server Information

**Production Server**: 5.161.62.252 (Hetzner Cloud)
**Deployment Path**: /opt/reddit-warmup/deployment/
**Health Endpoint**: http://5.161.62.252:8080/health
**Database**: Neon PostgreSQL (connection via DATABASE_URL env var)
**Docker Compose**: /opt/reddit-warmup/deployment/docker-compose.yml

**Environment Variables** (stored in deployment/.env on server):
- `DATABASE_URL`: Neon PostgreSQL connection string
- `ANTHROPIC_API_KEY`: Claude API key for LLM scheduler
- `GOLOGIN_API_TOKEN`: GoLogin API token for browser automation

### Troubleshooting

**Container won't start**:
```bash
# Check container logs for errors
ssh root@5.161.62.252 'docker logs reddit-warmup-scheduler --tail 100'

# Check if port is already in use
ssh root@5.161.62.252 'netstat -tlnp | grep 8080'
```

**Database connection issues**:
```bash
# Test database connectivity
ssh root@5.161.62.252 'docker exec reddit-warmup-scheduler python -c "
import asyncio, asyncpg, os
async def test():
    try:
        conn = await asyncpg.connect(os.environ[\"DATABASE_URL\"])
        print(\"✓ Database connected\")
        await conn.close()
    except Exception as e:
        print(f\"✗ Database error: {e}\")
asyncio.run(test())
"'
```

**Out of disk space**:
```bash
# Check disk usage
ssh root@5.161.62.252 'df -h'

# Clean up Docker resources
ssh root@5.161.62.252 'docker system prune -af --volumes'
```

**Decision loop not running**:
```bash
# Check scheduler logs for errors
ssh root@5.161.62.252 'docker logs reddit-warmup-scheduler | grep -i error'

# Restart the scheduler
ssh root@5.161.62.252 'cd /opt/reddit-warmup/deployment && docker compose restart scheduler'
```

## Script Reference

All scripts are in `.claude/skills/hetzner-manager/scripts/`:

- **validate_api_key.py**: Validate API credentials
- **servers.py**: Create, list, delete, and manage servers
- **ssh_keys.py**: Manage SSH keys

## Additional Resources

- [Hetzner Cloud API Documentation](https://docs.hetzner.cloud/)
- [Hetzner Cloud Console](https://console.hetzner.cloud/)
- [Hetzner Cloud Pricing](https://www.hetzner.com/cloud/)
- [Server Types Reference](https://docs.hetzner.cloud/#server-types)
