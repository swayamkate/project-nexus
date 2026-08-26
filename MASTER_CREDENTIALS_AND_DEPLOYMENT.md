# 🔐 MASTER DEPLOYMENT & CREDENTIALS VAULT (SOURCE OF TRUTH)

> **CONFIDENTIAL PROJECT ARCHITECTURE & CREDENTIALS**  
> *Saved for permanent reference across deployments.*

---

## 🌐 1. Live Domain & Network Architecture
| Service | Live Public URL | Host Provider | Internal Target |
| :--- | :--- | :--- | :--- |
| **Main Public Portal** | [https://sih2026.avishkark.in](https://sih2026.avishkark.in) | Cloudflare Pages | Static Export / Edge |
| **Admin Portal** | [https://administrator.avishkark.in](https://administrator.avishkark.in) | Oracle VPS (`129.146.164.75`) | `localhost:3001` (PM2 Node.js) |
| **Supabase REST / Auth API** | [https://api.avishkark.in](https://api.avishkark.in) | Oracle VPS (`129.146.164.75`) | `localhost:8000` (Kong Gateway) |
| **Supabase Studio Dashboard** | [https://studio.avishkark.in](https://studio.avishkark.in) | Oracle VPS (`129.146.164.75`) | `localhost:3000` (Docker Studio) |

---

## 🔑 2. Master Secrets & Authentication Keys

### Supabase Keys (Signed HS256 JWTs)
- **Supabase URL:** `https://api.avishkark.in`
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`:**
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E
  ```
- **`SUPABASE_SERVICE_ROLE_KEY`:**
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.6dcfM62ZyvbxTPcLxYpCTVA9Tw0C_ueCORR7PqwDr9s
  ```
- **`JWT_SECRET`:** `super-secret-jwt-token-with-at-least-32-characters-long-sih2026-nexus`

### Database Passwords
| Service | Credentials | Context |
| :--- | :--- | :--- |
| **PostgreSQL User & Password** | `postgres` / `Avishkar_443322` | Direct PostgreSQL / Supavisor connection |

### Supabase Studio Web GUI Login ([https://studio.avishkark.in](https://studio.avishkark.in))
You can log in using **any** of the following working credential combinations:

| Username | Password | Notes |
| :--- | :--- | :--- |
| `Avishkar` | `Avishkar@443322` | Master Primary Admin (Case-sensitive uppercase A) |
| `avishkar` | `Avishkar_443322` | Lowercase username fallback |
| `admin` | `Avishkar@443322` | Quick admin shortcut |
| `superadmin` | `adminpassword2026` | Superadmin credentials alias |
| `nexus` | `adminpassword2026` | System operator alias |

### Superadmin Console Credentials
- **URL:** [https://administrator.avishkark.in/login](https://administrator.avishkark.in/login)
- **Superadmin Username / Email:** `admin@nexus.com`
- **Superadmin Password:** `adminpassword2026`

---

## 📧 3. Email Authentication (Resend SMTP Configuration)
- **SMTP Host:** `smtp.resend.com`
- **SMTP Port:** `465`
- **SMTP User:** `resend`
- **SMTP Password / API Key:** `re_2aTnjoXB_5JtzEzhcqtUa22iZzBcpQNsE`
- **Admin Sender Email:** `admin@avishkark.in`
- **Sender Display Name:** `Nexus Admin`

---

## 📁 4. Exact File Contents for Oracle Server

### A. Supabase Docker Environment (`~/supabase/docker/.env`)
```env
############
# Secrets & JWT Keys
############

POSTGRES_PASSWORD=Avishkar@443322
JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long-sih2026-nexus
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.6dcfM62ZyvbxTPcLxYpCTVA9Tw0C_ueCORR7PqwDr9s
DASHBOARD_USERNAME=Avishkar
DASHBOARD_PASSWORD=Avishkar@443322
SECRET_KEY_BASE=c561a06598c9f0c2a8f89e41416e78864b281f62ab5e1f0e8f7a6375bc1e8886
VAULT_ENC_KEY=51b3f6834b9d0b84ef3b3a726715f012

############
# Database
############

POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432

############
# API Proxy (Kong)
############

KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443

############
# PostgREST API
############

PGRST_DB_SCHEMAS=public,storage,graphql_public
PGRST_DB_EXTRA_SEARCH_PATH=public,extensions
PGRST_MAX_ROWS=1000

############
# Auth & Mailer (GoTrue)
############

SITE_URL=https://sih2026.avishkark.in
ADDITIONAL_REDIRECT_URLS=https://sih2026.avishkark.in/**,https://administrator.avishkark.in/**,http://localhost:3000/**,http://129.146.164.75:3001/**
JWT_EXPIRY=3600
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_ANONYMOUS_USERS=false

# Resend SMTP Configuration
SMTP_ADMIN_EMAIL=admin@avishkark.in
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_2aTnjoXB_5JtzEzhcqtUa22iZzBcpQNsE
SMTP_SENDER_NAME="Nexus Admin"

MAILER_URLPATHS_CONFIRMATION=/auth/callback
MAILER_URLPATHS_INVITE=/auth/callback
MAILER_URLPATHS_RECOVERY=/auth/callback
MAILER_URLPATHS_EMAIL_CHANGE=/auth/callback

API_EXTERNAL_URL=https://api.avishkark.in
SUPABASE_PUBLIC_URL=https://api.avishkark.in

############
# Studio Dashboard
############

STUDIO_PORT=3000
STUDIO_DEFAULT_ORGANIZATION=SIH2026 Nexus
STUDIO_DEFAULT_PROJECT=MahaSkill Track

############
# Storage
############

STORAGE_BACKEND=file
FILE_STORAGE_BACKEND_PATH=/var/lib/storage
GLOBAL_S3_BUCKET=storage
TENANT_ID=stub
REGION=local

############
# Analytics
############

ANALYTICS_BACKEND=postgres
LOGFLARE_API_KEY=
VECTOR_PORT=9000
IMGPROXY_ENABLE_IMAGE_PROCESSING=true
```

---

### B. Caddy Reverse Proxy & SSL Configuration (`/etc/caddy/Caddyfile`)
```caddy
# Supabase API & Auth (No 308 redirect loop)
http://api.avishkark.in, https://api.avishkark.in {
    reverse_proxy localhost:8000
}

# Supabase Studio Dashboard
http://studio.avishkark.in, https://studio.avishkark.in {
    reverse_proxy localhost:3000
}

# Admin Panel
http://administrator.avishkark.in, https://administrator.avishkark.in {
    reverse_proxy localhost:3001
}
```

---

### C. Admin Panel Local Environment (`~/SIH2026/admin-app/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://api.avishkark.in
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.6dcfM62ZyvbxTPcLxYpCTVA9Tw0C_ueCORR7PqwDr9s
ADMIN_USERNAME=admin@nexus.com
ADMIN_PASSWORD=adminpassword2026
PORT=3001
```

---

### D. Cloudflare Pages (Main Website `sih2026.avishkark.in`) Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` = `https://api.avishkark.in`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E`
