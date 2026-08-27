const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Client library files do not contain hardcoded service role keys or database master passwords', () => {
  const clientFiles = [
    path.join(__dirname, '../src/lib/supabaseBrowser.ts'),
    path.join(__dirname, '../src/lib/supabase.ts'),
    path.join(__dirname, '../admin-app/src/lib/supabaseBrowser.ts'),
    path.join(__dirname, '../admin-app/src/lib/supabase.ts')
  ];

  for (const filePath of clientFiles) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Ensure no raw service role keys or db passwords
      assert.doesNotMatch(content, /service_role_secret/i, `File ${filePath} contains forbidden secret token`);
      assert.doesNotMatch(content, /postgres:\/\/[^:]+:[^@]+@/i, `File ${filePath} contains raw database connection URI`);
    }
  }
});
