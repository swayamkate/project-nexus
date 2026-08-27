# 🔒 ZERO TRUST SECURITY ARCHITECTURE & POLICY

## Project: MahaSkill Track (Nexus)
**Security Baseline:** OWASP Top 10 • Government Data Security Guidelines (MeitY) • Zero Trust Network Architecture

---

## 1. Secrets Management & Environment Isolation
- **Rule 1 (Strict Client Boundary):** Only variables prefixed with `NEXT_PUBLIC_` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`) may be embedded into browser code bundles.
- **Rule 2 (Server-Only Secrets):** `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`, and database connection strings must **never** be imported into client components or client libraries.
- **Rule 3 (Zero Hardcoded Keys):** All authentication secrets must be resolved dynamically through `process.env`. Build-time fallbacks must only point to inert stubs that fail gracefully if unconfigured.
- **Rule 4 (Git Hygiene):** `.env`, `.env.local`, and `cookies.txt` are permanently declared in `.gitignore`.

---

## 2. Row Level Security (RLS) Policy Blueprint
All PostgreSQL tables default to `ENABLE ROW LEVEL SECURITY` with `DEFAULT DENY`.

### Table-Specific Policy Matrix:
| Table Name | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
| :--- | :--- | :--- | :--- | :--- |
| `trainees` | Own record (`auth.uid() = user_id`) OR `is_admin()` | Authenticated signup (`auth.uid() = user_id`) | Own record OR `is_admin()` | `is_superadmin()` |
| `trainee_employment`| Own record OR `is_admin()` | Own record | Own record OR `is_admin()` | `is_superadmin()` |
| `verifications` | Own record OR `is_admin()` | Own record (`status = 'pending'`) | `is_admin()` | `is_superadmin()` |
| `trainee_followups` | Own record OR `is_admin()` | `is_admin()` | Own record OR `is_admin()` | `is_superadmin()` |
| `audit_logs` | `is_admin()` ONLY | Server trigger OR `is_admin()` | **DENIED** (Immutable) | **DENIED** (Immutable) |
| `government_schemes`| Public Read | `is_admin()` | `is_admin()` | `is_superadmin()` |
| `training_programs` | Public Read | `is_admin()` | `is_admin()` | `is_superadmin()` |

---

## 3. Data Privacy & Zero-Knowledge Cryptography
1. **Masked Aadhaar Rule:** Aadhaar numbers must never be stored as 12-digit plaintext. The database only stores `XXXX-XXXX-XXXX` masked formats.
2. **SHA-256 Privacy Hash:** Each trainee profile receives an immutable, cryptographically generated token:
   $$\text{privacy\_hash} = \text{SHA256}(\text{uuid} \parallel \text{salt})$$
   All public research datasets, state aggregates, and machine learning telemetry are indexed strictly via `privacy_hash`, ensuring zero candidate PII is exposed.
3. **Audit Immutability:** The `audit_logs` table has no `UPDATE` or `DELETE` permissions granted to any application role, preventing tampering with administrative history.

---

## 4. HTTP Security Headers & Network Defense
Both Next.js applications and the Caddy Reverse Proxy enforce strict security headers:
- `Content-Security-Policy`: Restricts script and style execution to trusted self and Supabase API origins.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload` (HSTS).
- `X-Content-Type-Options`: `nosniff`.
- `X-Frame-Options`: `DENY` (prevents clickjacking attacks).
- `Referrer-Policy`: `strict-origin-when-cross-origin`.
- `Permissions-Policy`: Disables unauthorized access to camera, microphone, and geolocation.

---

## 5. Input Validation & Defense-in-Depth
- All mutation payloads are pre-validated using strict **Zod schemas** (`src/lib/schemas.ts`).
- Cross-Site Request Forgery (CSRF) protections enforce `SameSite=Lax` or `SameSite=Strict` on session cookies.
- Server-side rate limiting prevents brute-force attempts on `/api/auth/*` and mutation routes.
