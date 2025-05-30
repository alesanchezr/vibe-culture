const { loadEnvLocal } = require('./utils');
loadEnvLocal(); // Use the shared function

const { createClient } = require('@supabase/supabase-js');

async function createTestUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;

  if (!supabaseUrl || !supabaseServiceRoleKey || !testEmail || !testPassword) {
    console.error('Error: Missing one or more required environment variables in .env.local:');
    if(!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL (for supabaseUrl)');
    if(!supabaseServiceRoleKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    if(!testEmail) console.error('  - TEST_EMAIL');
    if(!testPassword) console.error('  - TEST_PASSWORD');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });

  try {
    console.log(`Attempting to create or ensure test user ${testEmail} exists...`);
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Automatically confirm email for test user
    });

    if (createUserError) {
      // Check if the error is because the user already exists
      if (createUserError.message && (createUserError.message.toLowerCase().includes('user already registered') || createUserError.message.toLowerCase().includes('user with this email address has already been registered'))) {
        console.log(`Test user ${testEmail} already exists.`);
      } else {
        // Another error occurred during creation
        console.error('Error creating test user:', createUserError.message);
        process.exit(1);
      }
    } else {
      console.log(`Test user ${testEmail} created successfully with ID: ${newUser.user.id}`);
    }
  } catch (error) {
    // Catch any other unexpected errors during the process
    console.error('An unexpected error occurred during the user creation/check process:', error.message);
    process.exit(1);
  }
}

createTestUser(); 