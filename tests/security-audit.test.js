const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Codebase Audit: No hardcoded credentials array in admin auth route', () => {
  const authRoutePath = path.join(__dirname, '../admin-app/src/app/api/auth/superadmin/route.ts');
  const content = fs.readFileSync(authRoutePath, 'utf-8');

  assert.doesNotMatch(content, /validCredentials\s*=/i, 'Found hardcoded credentials array in admin auth route');
  assert.doesNotMatch(content, /adminpassword2026/i, 'Found hardcoded password in admin auth route');
  assert.doesNotMatch(content, /Avishkar@admin6198/i, 'Found hardcoded password in admin auth route');
  assert.match(content, /supabase\.auth\.signInWithPassword/i, 'Admin auth must use Supabase Auth');
});

test('Codebase Audit: No hardcoded service role key in create-admin route', () => {
  const createAdminPath = path.join(__dirname, '../admin-app/src/app/api/create-admin/route.ts');
  const content = fs.readFileSync(createAdminPath, 'utf-8');

  assert.doesNotMatch(content, /eyJhbGciOiAiSFMyNTYi/i, 'Found hardcoded JWT service role key fallback in create-admin');
  assert.match(content, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/i, 'create-admin must require SUPABASE_SERVICE_ROLE_KEY from environment');
});

test('Codebase Audit: No mock certificate fallback in CertificateValidationClient', () => {
  const clientPath = path.join(__dirname, '../src/app/verify/[certId]/CertificateValidationClient.tsx');
  const content = fs.readFileSync(clientPath, 'utf-8');

  assert.doesNotMatch(content, /Authentic mock fallback/i, 'Found mock certificate fallback in verification client');
  assert.doesNotMatch(content, /setRecord\({\s*certificate_id:\s*certId\.toUpperCase\(\)/i, 'Found fabricated certificate record generator');
  assert.match(content, /No active state credential matching reference/i, 'Must return not found on unverified certificate IDs');
});

test('Codebase Audit: Superadmin cookie spoofing is eliminated', () => {
  const meRoutePath = path.join(__dirname, '../admin-app/src/app/api/auth/me/route.ts');
  const content = fs.readFileSync(meRoutePath, 'utf-8');

  assert.doesNotMatch(content, /cookieStore\.get\('nexus_superadmin'\)\?\.value === 'true'/i, 'Found insecure plaintext cookie check in auth/me');
  assert.doesNotMatch(content, /cookieStore\.get\('superadmin_token'\)\?\.value === 'true'/i, 'Found insecure superadmin_token cookie check in auth/me');
  assert.match(content, /verifyAdminSession/i, 'auth/me must use secure session verification');
});

test('Codebase Audit: TypeScript ignoreBuildErrors is disabled', () => {
  const nextConfigPath = path.join(__dirname, '../admin-app/next.config.ts');
  const content = fs.readFileSync(nextConfigPath, 'utf-8');

  assert.doesNotMatch(content, /ignoreBuildErrors:\s*true/i, 'ignoreBuildErrors must not be enabled in admin next.config.ts');
});
