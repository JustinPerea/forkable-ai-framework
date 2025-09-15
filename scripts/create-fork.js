#!/usr/bin/env node

/**
 * Create Fork Script
 * 
 * This script automates the process of creating a new fork of the AI application
 * by duplicating the codebase and updating the configuration file.
 * 
 * Usage: node scripts/create-fork.js <name> <domain> <prompt>
 * Example: node scripts/create-fork.js "Sketchify" "sketchify.com" "Convert this image into a pencil sketch"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG_TEMPLATE = path.join(__dirname, '../examples/coloringbook-config.js');
const OUTPUT_DIR = path.join(__dirname, '../forks');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node scripts/create-fork.js <name> <domain> <prompt>');
  console.error('Example: node scripts/create-fork.js "Sketchify" "sketchify.com" "Convert this image into a pencil sketch"');
  process.exit(1);
}

const [name, domain, prompt] = args;

// Validate inputs
if (!name || !domain || !prompt) {
  console.error('Error: All arguments are required');
  process.exit(1);
}

// Validate domain format
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
if (!domainRegex.test(domain)) {
  console.error('Error: Invalid domain format');
  process.exit(1);
}

// Create fork directory name (lowercase, no spaces)
const forkName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
const forkDir = path.join(OUTPUT_DIR, forkName);

console.log(`Creating fork: ${name}`);
console.log(`Domain: ${domain}`);
console.log(`Prompt: ${prompt}`);
console.log(`Directory: ${forkDir}`);

try {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Check if fork already exists
  if (fs.existsSync(forkDir)) {
    console.error(`Error: Fork directory already exists: ${forkDir}`);
    process.exit(1);
  }

  // Copy the entire project to the fork directory
  console.log('Copying project files...');
  execSync(`cp -r ${path.join(__dirname, '..')} ${forkDir}`, { stdio: 'inherit' });

  // Remove unnecessary files from fork
  const filesToRemove = [
    'node_modules',
    '.git',
    'forks',
    'examples',
    'scripts',
    'specs',
    'planning',
    'memory',
    '.env',
    '.env.local'
  ];

  filesToRemove.forEach(file => {
    const filePath = path.join(forkDir, file);
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        execSync(`rm -rf "${filePath}"`, { stdio: 'inherit' });
      } else {
        fs.unlinkSync(filePath);
      }
    }
  });

  // Read the configuration template
  console.log('Reading configuration template...');
  let configContent = fs.readFileSync(CONFIG_TEMPLATE, 'utf8');

  // Update configuration with new values
  console.log('Updating configuration...');
  
  // Replace branding
  configContent = configContent.replace(/ColoringBook AI/g, name);
  configContent = configContent.replace(/coloringbook\.ai/g, domain);
  configContent = configContent.replace(/coloringbook-ai/g, forkName);
  
  // Replace the prompt
  const promptRegex = /prompt: ".*?"/;
  configContent = configContent.replace(promptRegex, `prompt: "${prompt}"`);
  
  // Update meta tags
  configContent = configContent.replace(/Transform Photos to Coloring Book Sketches/g, `${name} - AI Image Transformation`);
  configContent = configContent.replace(/Convert any photo into a beautiful coloring book sketch/g, `Transform your photos with AI using ${name}`);
  
  // Update Vercel project name
  configContent = configContent.replace(/vercelProject: "coloringbook-ai"/g, `vercelProject: "${forkName}"`);
  
  // Update analytics tracking ID
  configContent = configContent.replace(/trackingId: "coloringbook-ai"/g, `trackingId: "${forkName}"`);

  // Write the new configuration file
  const configPath = path.join(forkDir, 'config.js');
  fs.writeFileSync(configPath, configContent);

  // Update package.json
  console.log('Updating package.json...');
  const packageJsonPath = path.join(forkDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = forkName;
  packageJson.description = `${name} - AI Image Transformation`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create README for the fork
  console.log('Creating README...');
  const readmeContent = `# ${name}

${name} is an AI-powered image transformation tool that ${prompt.toLowerCase()}.

## Features

- Upload or take photos
- AI-powered image transformation
- High-quality output
- Easy to use interface
- Mobile-friendly

## Getting Started

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Run the development server: \`npm run dev\`
5. Deploy to Vercel: \`vercel --prod\`

## Configuration

The application is configured via the \`config.js\` file. Key settings include:

- **Branding**: Name, logo, tagline, and descriptions
- **AI Settings**: Prompt and model parameters
- **Business Settings**: Pricing and payment configuration
- **Deployment**: Domain and hosting settings

## Deployment

This application is designed to be deployed on Vercel. The configuration includes all necessary settings for automatic deployment.

## Support

For support, please contact the development team.

## License

MIT License
`;

  fs.writeFileSync(path.join(forkDir, 'README.md'), readmeContent);

  // Create deployment script
  console.log('Creating deployment script...');
  const deployScript = `#!/bin/bash

# Deployment script for ${name}
# This script deploys the application to Vercel

echo "Deploying ${name} to Vercel..."

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod

echo "Deployment complete!"
echo "Your application should be available at: https://${domain}"
`;

  fs.writeFileSync(path.join(forkDir, 'deploy.sh'), deployScript);
  fs.chmodSync(path.join(forkDir, 'deploy.sh'), '755');

  // Create environment template
  console.log('Creating environment template...');
  const envTemplate = `# Environment Variables for ${name}
# Copy this file to .env and fill in your values

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001

# Database
DATABASE_URL=your_database_url_here

# Cache
KV_URL=your_kv_url_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Encryption Key
ENCRYPTION_KEY=your_encryption_key_here

# Klerk API Key (for authentication)
KLERK_API_KEY=your_klerk_api_key_here

# Polar API Key (for payments)
POLAR_API_KEY=your_polar_api_key_here

# Vercel Configuration
VERCEL_PROJECT_ID=your_vercel_project_id_here
VERCEL_ORG_ID=your_vercel_org_id_here
`;

  fs.writeFileSync(path.join(forkDir, '.env.template'), envTemplate);

  console.log('\\n✅ Fork created successfully!');
  console.log(`\\n📁 Fork directory: ${forkDir}`);
  console.log(`\\n🚀 Next steps:`);
  console.log(`1. cd ${forkDir}`);
  console.log(`2. cp .env.template .env`);
  console.log(`3. Fill in your environment variables in .env`);
  console.log(`4. npm install`);
  console.log(`5. npm run dev (for development)`);
  console.log(`6. ./deploy.sh (for production deployment)`);
  console.log(`\\n🌐 Your application will be available at: https://${domain}`);

} catch (error) {
  console.error('Error creating fork:', error.message);
  process.exit(1);
}
