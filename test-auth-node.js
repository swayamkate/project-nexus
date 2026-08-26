const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://api.avishkark.in';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

const supabase = createClient(supabaseUrl, anonKey);

async function testSignIn() {
  console.log('Testing signInWithPassword for priya.sharma@mahaskill.in ...');
  const res = await supabase.auth.signInWithPassword({
    email: 'priya.sharma@mahaskill.in',
    password: 'priya123456'
  });

  if (res.error) {
    console.log('SignIn Error:', res.error.message);
  } else {
    console.log('SignIn SUCCESS!');
    console.log('User ID:', res.data.user.id);
    console.log('Email:', res.data.user.email);
    console.log('Session access token present:', !!res.data.session.access_token);
  }

  console.log('\nTesting signInWithPassword for admin@nexus.com ...');
  const resAdmin = await supabase.auth.signInWithPassword({
    email: 'admin@nexus.com',
    password: 'adminpassword2026'
  });

  if (resAdmin.error) {
    console.log('Admin SignIn Error:', resAdmin.error.message);
  } else {
    console.log('Admin SignIn SUCCESS!');
    console.log('Admin User ID:', resAdmin.data.user.id);
  }
}

testSignIn().catch(console.error);
