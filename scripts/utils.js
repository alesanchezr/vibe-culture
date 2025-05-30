const path = require('path');
const fs = require('fs');

// Function to load .env.local
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFileContent = fs.readFileSync(envPath, 'utf8');
    envFileContent.split('\n').forEach(line => {
      // Ensure that we are not trying to split an empty line
      if (line.trim() === '') return;

      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      
      // Ensure key is not undefined or empty after trimming
      const trimmedKey = key ? key.trim() : '';

      if (trimmedKey && value) {
        // Remove surrounding quotes if any
        process.env[trimmedKey] = value.replace(/^['"]|['"]$/g, '');
      }
    });
  } else {
    console.warn('.env.local file not found. Please ensure it exists and contains the required environment variables.');
  }
}

module.exports = { loadEnvLocal }; 