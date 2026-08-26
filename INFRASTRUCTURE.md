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
