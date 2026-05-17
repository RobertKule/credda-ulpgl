import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    exclude: [
      '**/node_modules/**', 
      '**/.next/**', 
      '**/e2e/**', 
      '**/__tests__/**' // removing legacy jest files
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.*',
        'test/**',
        'e2e/**',
      ],
    },
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
