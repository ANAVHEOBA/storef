# Filecoin Storage Backend

This project provides a backend service for storing data on the Filecoin network using Lighthouse.storage.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your API key:
```bash
cp .env.example .env
```

3. Get your Lighthouse API key:
- Sign up at https://lighthouse.storage
- Free tier includes 5GB storage and 50GB bandwidth per month
- No credit card required

## Usage

The service provides methods for storing and managing data:

1. `storeWithLighthouse(filePath)` - Store files using Lighthouse.storage
2. `getDealStatus(cid)` - Check the status of your storage deals

## Features

- Store data using Lighthouse.storage
- Check deal status
- Environment configuration
- Error handling

## Requirements

- Node.js 14+
- API keys for Lighthouse and Web3.Storage 