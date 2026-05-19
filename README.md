# VCC50000 OpenAI Agent Integration

This version adds a second assistant button that opens an embedded website chat connected to your OpenAI prompt ID.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Put your OpenAI API key in `.env`:

```env
OPENAI_API_KEY=sk-proj_your_real_key_here
OPENAI_PROMPT_ID=pmpt_6a0bb18ce2dc8197ad1c36a0c7812f020dea6ea8c9eba53b
OPENAI_PROMPT_VERSION=1
```

4. Run the project:

```bash
npm start
```

5. Open:

```text
http://localhost:3000
```

## Important

Do not put your OpenAI API key in `index.html` or `app.js`. The key stays in `.env` and the browser calls `/api/vcc-agent` on your backend.
