const path = require('path');
const fs = require('fs');

// Function to load .env.local
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFileContent = fs.readFileSync(envPath, 'utf8');
    envFileContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        // Remove surrounding quotes if any
        process.env[key.trim()] = value.replace(/^['"]|['"]$/g, '');
      }
    });
  } else {
    console.warn('.env.local file not found. Please ensure it exists and contains the required environment variables.');
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey || !testEmail || !testPassword) {
  console.error('Error: The following environment variables must be set in your .env.local file:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!testEmail) console.error('  - TEST_EMAIL');
  if (!testPassword) console.error('  - TEST_PASSWORD');
  process.exit(1);
}

async function getTestToken() {
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.access_token) {
        console.log('Access Token:');
        console.log(data.access_token);
        // console.log('\nNote: This token is short-lived. Run the script again to get a new one if needed.');
      } else {
        console.error('\nError: Could not retrieve access token. Response:', data);
      }
    } else {
      console.error('\nError fetching token:', data);
    }
  } catch (error) {
    console.error('\nAn unexpected error occurred:', error);
  }
}

getTestToken(); 