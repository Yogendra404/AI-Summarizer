# AI Text Summariser

Next.js (App Router) + Anthropic API. Paste text, get a streamed summary.

## Run locally
```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new.
3. Add environment variable `ANTHROPIC_API_KEY` in Project Settings.
4. Deploy. Your public URL is ready.