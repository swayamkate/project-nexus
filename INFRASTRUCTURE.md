# LIVE PRODUCTION INFRASTRUCTURE & SOURCE OF TRUTH

> **CRITICAL CONTEXT FILE - DO NOT DELETE OR OVERWRITE WITH PLACEHOLDERS**

## 🌐 Official Domain Mapping
| Service | Domain | Host / Provider | Target / Internal Port |
| :--- | :--- | :--- | :--- |
| **Main Website** | `https://sih2026.avishkark.in` | Cloudflare Pages | Static Export |
| **Admin Panel** | `https://administrator.avishkark.in` | Oracle VPS (`129.146.164.75`) | Caddy `reverse_proxy localhost:3001` |
| **Supabase API / Kong** | `https://api.avishkark.in` | Oracle VPS (`129.146.164.75`) | Caddy `reverse_proxy localhost:8000` |
| **Supabase Studio** | `https://studio.avishkark.in` | Oracle VPS (`129.146.164.75`) | Caddy `reverse_proxy localhost:3000` |

---

## 🖥️ Server Details (Oracle Cloud Free Tier)
- **Public IP:** `129.146.164.75`
- **SSH User:** `avishkar@kedar`
- **Supabase Docker Path:** `~/supabase/docker`
- **Admin App PM2 Path:** `~/SIH2026/admin-app`

---

## 📧 Email & Auth Details (Resend SMTP)
- **SMTP Host:** `smtp.resend.com`
- **SMTP Port:** `465`
- **SMTP User:** `resend`
- **SMTP Pass:** `re_2aTnjoXB_5JtzEzhcqtUa22iZzBcpQNsE`
- **SMTP Admin Sender:** `admin@avishkark.in`
- **SMTP Sender Name:** `"Nexus Admin"`

---

## 🔐 Credentials & Secrets Reference
- **Superadmin Username / Email:** `admin@nexus.com`
- **Superadmin Password:** `adminpassword2026`
- **Supabase URL for Web & Admin:** `https://api.avishkark.in`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E`
- **SUPABASE_SERVICE_ROLE_KEY:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.6dcfM62ZyvbxTPcLxYpCTVA9Tw0C_ueCORR7PqwDr9s`
- **Supabase Studio User / Pass:** `admin` / `AdminStudioPass2026!`
- **Postgres DB Password:** `PostgresSecurePass2026!`
