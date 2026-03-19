# AgentOS

An enterprise AI agent platform prototype built with Next.js. Includes an agent builder, testing simulator, analytics dashboard, integrations manager, and settings — designed around Agent Operating Procedures (AOPs).

## Structure

```
agentos/          — Next.js app (agent builder, testing, analytics, integrations, settings)
dataset-generator/ — Python scripts to generate synthetic e-commerce customer service conversations
```

## Getting Started

### AgentOS (Next.js)

```bash
cd agentos
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Dataset Generator (Python)

```bash
cd dataset-generator
pip install anthropic jsonschema
python generate.py
```

Requires an `ANTHROPIC_API_KEY` environment variable.
