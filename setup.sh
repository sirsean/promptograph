
# Create backend and frontend directories
mkdir backend frontend

# Set up backend
cd backend
cat > package.json << 'EOL'
{
  "name": "promptograph-backend",
  "version": "1.0.0",
  "description": "Promptograph backend API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
EOL
npm install express cors dotenv
npm install -D jest supertest @babel/core @babel/preset-env

# Create basic Express server
cat > index.js << 'EOL'
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
EOL

# Create backend .env
cat > .env << 'EOL'
PORT=3000
EOL

# Create backend test setup
mkdir -p __tests__
cat > __tests__/app.test.js << 'EOL'
const request = require('supertest');
const express = require('express');
const app = express();

describe('API Tests', () => {
  it('GET /api/health returns status ok', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe('ok');
  });
});
EOL

# Create backend babel config
cat > babel.config.js << 'EOL'
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
EOL

# Move to frontend and create Vite React app
cd ../frontend
cat > package.json << 'EOL'
{
  "name": "promptograph-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "preview": "vite preview"
  }
}
EOL
npm install react react-dom react-router-dom @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
npm install -D tailwindcss postcss autoprefixer
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom

# Initialize Tailwind CSS
npx tailwindcss init -p

# Configure Tailwind
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Add Tailwind directives to CSS
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Create test setup file
cat > src/setupTests.js << 'EOL'
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

afterEach(() => {
  cleanup();
});
EOL

# Create sample test
mkdir -p src/__tests__
cat > src/__tests__/App.test.jsx << 'EOL'
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Promptograph/i)).toBeInTheDocument();
  });
});
EOL

# Update frontend vite.config.js to proxy API requests and configure Vitest
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
EOL

# Update root package.json with scripts
cd ..
cat > package.json << 'EOL'
{
  "name": "promptograph",
  "version": "1.0.0",
  "description": "AI-powered image generation from prompts",
  "scripts": {
    "backend": "cd backend && node index.js",
    "frontend": "cd frontend && npm run dev",
    "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && jest",
    "test:frontend": "cd frontend && vitest run"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
EOL

# Install root dependencies
npm install

# Create a .gitignore
cat > .gitignore << 'EOL'
node_modules
.env
dist
build
*.log
.DS_Store
EOL

# Create README.md
cat > README.md << 'EOL'
# Promptograph

Transform your ideas into images using AI-powered prompt engineering.

## Setup

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3000
EOL