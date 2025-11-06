#!/usr/bin/env node

/**
 * Verification script to check if Freely is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Freely setup...\n');

let errors = [];
let warnings = [];

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  warnings.push('⚠️  .env.local not found. Copy .env.example to .env.local and configure it.');
} else {
  console.log('✅ .env.local exists');
  
  // Check for required env vars
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      errors.push(`❌ Missing required env var: ${varName}`);
    } else {
      console.log(`✅ ${varName} is set`);
    }
  });
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  errors.push('❌ node_modules not found. Run: npm install');
} else {
  console.log('✅ Dependencies installed');
}

// Check if .next exists (build check)
const nextPath = path.join(process.cwd(), '.next');
if (fs.existsSync(nextPath)) {
  console.log('✅ Build directory exists');
}

// Check for required files
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'supabase/migrations/001_initial_schema.sql'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    errors.push(`❌ Missing required file: ${file}`);
  } else {
    console.log(`✅ ${file} exists`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length > 0) {
  console.log('\n❌ ERRORS FOUND:');
  errors.forEach(err => console.log(err));
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(warn => console.log(warn));
}

console.log('\n✅ Setup verification complete!');
console.log('\nNext steps:');
console.log('1. Make sure Supabase migration is run');
console.log('2. Start dev server: npm run dev');
console.log('3. Open http://localhost:3000');
console.log('\n');

