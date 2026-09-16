# Azure API Viewer

A small React + Vite frontend that calls a Python/FastAPI endpoint hosted in Azure and displays its response.

## Configure

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the deployed API URL. The default is `http://localhost:8000` when the variable is missing.
3. Make sure the FastAPI service allows this frontend origin with CORS.

## Run

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.