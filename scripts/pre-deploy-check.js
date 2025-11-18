#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Verifies that the project is ready for production deployment
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let hasErrors = false;
let hasWarnings = false;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
  hasErrors = true;
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
  hasWarnings = true;
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

function section(title) {
  log(`\n${colors.bright}=== ${title} ===${colors.reset}`);
}

// Check required files
section('Checking required files');

const requiredFiles = [
  'package.json',
  'Dockerfile',
  '.dockerignore',
  'captain-definition',
  'DEPLOYMENT.md',
  '.env.example',
  'drizzle.config.ts',
  'vite.config.ts',
  'tsconfig.json',
];

requiredFiles.forEach(file => {
  const filePath = join(rootDir, file);
  if (existsSync(filePath)) {
    success(`${file} exists`);
  } else {
    error(`${file} is missing`);
  }
});

// Check package.json scripts
section('Checking package.json scripts');

try {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, 'package.json'), 'utf8')
  );

  const requiredScripts = ['dev', 'build', 'start', 'db:push'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      success(`Script "${script}" is defined`);
    } else {
      error(`Script "${script}" is missing`);
    }
  });

  // Check critical dependencies
  const criticalDeps = [
    'express',
    'drizzle-orm',
    'pg',
    'react',
    'vite',
    'esbuild',
  ];

  criticalDeps.forEach(dep => {
    if (
      (packageJson.dependencies && packageJson.dependencies[dep]) ||
      (packageJson.devDependencies && packageJson.devDependencies[dep])
    ) {
      success(`Dependency "${dep}" is installed`);
    } else {
      error(`Critical dependency "${dep}" is missing`);
    }
  });
} catch (err) {
  error(`Failed to parse package.json: ${err.message}`);
}

// Check Dockerfile
section('Checking Dockerfile');

try {
  const dockerfile = readFileSync(join(rootDir, 'Dockerfile'), 'utf8');

  if (dockerfile.includes('FROM node:20')) {
    success('Dockerfile uses Node.js 20');
  } else {
    warning('Dockerfile should use Node.js 20 for consistency');
  }

  if (dockerfile.includes('multi-stage') || dockerfile.includes('AS builder')) {
    success('Dockerfile uses multi-stage build');
  } else {
    warning('Consider using multi-stage Docker build for smaller image');
  }

  if (dockerfile.includes('EXPOSE 5000')) {
    success('Dockerfile exposes port 5000');
  } else {
    error('Dockerfile must expose port 5000');
  }

  if (dockerfile.includes('npm ci --only=production')) {
    success('Dockerfile installs only production dependencies');
  } else {
    warning('Consider using "npm ci --only=production" in final stage');
  }
} catch (err) {
  error(`Failed to read Dockerfile: ${err.message}`);
}

// Check .dockerignore
section('Checking .dockerignore');

try {
  const dockerignore = readFileSync(join(rootDir, '.dockerignore'), 'utf8');

  const shouldIgnore = ['node_modules', 'dist', '.git', '.env'];
  
  shouldIgnore.forEach(pattern => {
    if (dockerignore.includes(pattern)) {
      success(`Ignoring ${pattern}`);
    } else {
      warning(`Should ignore ${pattern} in .dockerignore`);
    }
  });
} catch (err) {
  error(`Failed to read .dockerignore: ${err.message}`);
}

// Check environment variables documentation
section('Checking environment variables');

try {
  const envExample = readFileSync(join(rootDir, '.env.example'), 'utf8');

  const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'NODE_ENV',
  ];

  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      success(`${envVar} is documented`);
    } else {
      error(`${envVar} is missing from .env.example`);
    }
  });

  const optionalEnvVars = [
    'STRAVA_CLIENT_ID',
    'STRAVA_CLIENT_SECRET',
    'STRAVA_REDIRECT_URI',
    'YOOKASSA_SHOP_ID',
    'YOOKASSA_SECRET_KEY',
    'VITE_YANDEX_MAPS_API_KEY',
  ];

  optionalEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      success(`${envVar} is documented (optional)`);
    } else {
      warning(`${envVar} could be documented in .env.example`);
    }
  });
} catch (err) {
  error(`Failed to read .env.example: ${err.message}`);
}

// Check directory structure
section('Checking project structure');

const requiredDirs = [
  'client',
  'server',
  'shared',
  'server/routes',
  'server/uploads',
];

requiredDirs.forEach(dir => {
  const dirPath = join(rootDir, dir);
  if (existsSync(dirPath)) {
    success(`Directory ${dir}/ exists`);
  } else {
    error(`Directory ${dir}/ is missing`);
  }
});

// Check TypeScript config
section('Checking TypeScript configuration');

try {
  const tsconfig = JSON.parse(
    readFileSync(join(rootDir, 'tsconfig.json'), 'utf8')
  );

  if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
    success('TypeScript strict mode is enabled');
  } else {
    warning('Consider enabling TypeScript strict mode');
  }

  if (tsconfig.compilerOptions && tsconfig.compilerOptions.module === 'ESNext') {
    success('TypeScript uses ESNext modules');
  }
} catch (err) {
  error(`Failed to parse tsconfig.json: ${err.message}`);
}

// Check captain-definition
section('Checking CapRover configuration');

try {
  const captainDef = JSON.parse(
    readFileSync(join(rootDir, 'captain-definition'), 'utf8')
  );

  if (captainDef.schemaVersion === 2) {
    success('Using CapRover schema version 2');
  }

  if (captainDef.dockerfilePath === './Dockerfile') {
    success('Dockerfile path is correctly configured');
  } else {
    error('dockerfilePath should be "./Dockerfile"');
  }
} catch (err) {
  error(`Failed to parse captain-definition: ${err.message}`);
}

// Summary
section('Summary');

if (hasErrors) {
  log('\n❌ Pre-deployment check FAILED', colors.red);
  log('Please fix the errors above before deploying to production.\n', colors.red);
  process.exit(1);
} else if (hasWarnings) {
  log('\n⚠️  Pre-deployment check completed with WARNINGS', colors.yellow);
  log('The project can be deployed, but consider addressing the warnings.\n', colors.yellow);
  process.exit(0);
} else {
  log('\n✅ Pre-deployment check PASSED', colors.green);
  log('The project is ready for production deployment!\n', colors.green);
  info('Next steps:');
  info('1. Review DEPLOYMENT.md for deployment instructions');
  info('2. Set up environment variables on your server');
  info('3. Deploy to CapRover or your preferred platform');
  info('4. Run database migrations: npm run db:push');
  info('5. Create your first admin user\n');
  process.exit(0);
}
