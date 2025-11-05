#!/bin/bash
set -e

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Installing dependencies..."
npm ci

echo "Building documentation..."
npm run docs:build

echo "Build output:"
ls -la docs/.vitepress/dist/

echo "Build completed successfully!"