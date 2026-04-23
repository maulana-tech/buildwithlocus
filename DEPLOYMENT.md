# BuildWithLocus Deployment Guide

## Auto-Deploy Setup

### Prerequisites
- GitHub repository connected to BuildWithLocus
- BuildWithLocus credits ($0.25 minimum per service)

### Step 1: Install GitHub App

1. Go to: https://github.com/apps/build-with-locus/installations/new
2. Select your repository (`maulana-tech/buildwithlocus`)
3. Authorize the app

### Step 2: After Installation

Every `git push` to `main` branch will auto-deploy:

```bash
git add -A
git commit -m "your changes"
git push
```

BuildWithLocus will:
1. Detect the push
2. Read `.locusbuild` configuration
3. Build and deploy the service
4. Return live URL

---

## Manual Deploy (via API)

### Get Token

```bash
TOKEN=$(curl -s -X POST 'https://api.buildwithlocus.com/v1/auth/exchange' \
  -H 'Content-Type: application/json' \
  -d '{"apiKey":"YOUR_API_KEY"}' | jq -r '.token')
```

### Trigger Deploy

```bash
curl -X POST "https://api.buildwithlocus.com/v1/git/push-deploy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "repo": "maulana-tech/buildwithlocus",
    "branch": "main"
  }'
```

---

## Project References

### Active Projects

| Project Name | Project ID | Service URL |
|---|---|---|
| buildwithlocus | proj_mo8f7ev9dt8uioau | svc-mo8f7ext1aijm8nv.buildwithlocus.com |
| buildwithlocus-v2 | proj_moba0ob46ry54zwb | svc-moba0odjul0rjfgy.buildwithlocus.com |

---

## Troubleshooting

### Insufficient Credits Error

```
{"error":"Insufficient credits","creditBalance":0,"requiredAmount":0.25}
```

**Solution:**
1. Go to https://buildwithlocus.com/billing
2. Add credits (minimum $0.25)
3. Wait for sync (may take a few minutes)
4. Try deploy again

### Check Credits

```bash
TOKEN=$(curl -s -X POST 'https://api.buildwithlocus.com/v1/auth/exchange' \
  -H 'Content-Type: application/json' \
  -d '{"apiKey":"YOUR_API_KEY"}' | jq -r '.token')

# List projects
curl -s "https://api.buildwithlocus.com/v1/projects" \
  -H "Authorization: Bearer $TOKEN"
```

### Check Project Details

```bash
curl -s "https://api.buildwithlocus.com/v1/projects/PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### List All Services

Currently no direct API to list services. Check BuildWithLocus dashboard.

---

## .locusbuild Configuration

This file controls how BuildWithLocus deploys your app:

```json
{
  "region": "us-east-1",
  "services": {
    "studio": {
      "path": ".",
      "port": 3000,
      "startCommand": "pnpm start",
      "runtime": {
        "cpu": 512,
        "memory": 1024
      },
      "env": {
        "LOCUS_API_KEY": "${{LOCUS_API_KEY}}",
        "LOCUS_WEBHOOK_SECRET": "${{LOCUS_WEBHOOK_SECRET}}",
        "NEXT_PUBLIC_APP_URL": "${{NEXT_PUBLIC_APP_URL}}"
      }
    }
  }
}
```

### Configuration Options

| Field | Description |
|---|---|
| `region` | AWS region (e.g., us-east-1) |
| `path` | Path to service in repo (.) |
| `port` | Container port (3000) |
| `startCommand` | How to start the app |
| `runtime.cpu` | CPU allocation (512 = 0.5 vCPU) |
| `runtime.memory` | Memory in MB (1024 = 1GB) |
| `env` | Environment variables |

---

## API Reference

### Authentication

```bash
# Exchange API key for token
curl -s -X POST 'https://api.buildwithlocus.com/v1/auth/exchange' \
  -H 'Content-Type: application/json' \
  -d '{"apiKey":"YOUR_API_KEY"}'
```

Response:
```json
{"token": "eyJhbG..."}
```

### Projects

```bash
# List projects
curl -s "https://api.buildwithlocus.com/v1/projects" \
  -H "Authorization: Bearer $TOKEN"

# Get project details
curl -s "https://api.buildwithlocus.com/v1/projects/PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Deploy

```bash
# Create new project from repo
curl -s -X POST "https://api.buildwithlocus.com/v1/projects/from-repo" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"your-project","repo":"your-org/repo","branch":"main"}'

# Trigger push deploy
curl -s -X POST "https://api.buildwithlocus.com/v1/git/push-deploy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"PROJECT_ID","repo":"org/repo","branch":"main"}'
```

---

## Notes

- BuildWithLocus uses credits for service runtime
- Each service costs ~$0.25/month (varies by resources)
- Auto-deploy only works after GitHub app is installed
- Manual deploy via API works anytime (with credits)