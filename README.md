# RaceDex.gg Setup Builder

AI-powered iRacing setup assistant by [RaceDex.gg](https://racedex.gg). Covers three open-setup NASCAR oval series:

- **NASCAR Cup Series Next Gen** (Class A)
- **NASCAR Xfinity Series** (Class B)
- **NASCAR Craftsman Truck Series** (Class C)

## Two Modes

### Guided Diagnosis (Free — no API key)
A rule-based expert system that walks you through structured questions:
1. Is the car **tight** or **loose**?
2. **Where** in the corner? (entry, center off-throttle, center on-throttle, early exit, late exit)
3. **When** does it happen? (short run, long run, all the time)
4. **How bad** is it? (mild, moderate, severe)

It then gives you a table of specific parameter changes with explanations — no API calls, no cost, works offline.

### AI Chat (requires API key or Ollama)
Natural language conversation with the RaceDex setup advisor. Describe anything:
- *"Car is really tight on entry at Charlotte but gets loose off turn 4"*
- *"Build me a complete setup for trucks at Martinsville"*
- *"Good on short runs but pushes bad on long runs"*

The AI understands all three cars, every oval track, and the physics behind every parameter.

## Getting Started

```bash
cd racedex-setup-builder

# Install dependencies
npm install

# (Optional) Configure AI chat — skip this for Guided Diagnosis mode
cp .env.example .env.local
# Edit .env.local — pick one:
#   Option A: ANTHROPIC_API_KEY=sk-ant-...
#   Option B: OLLAMA_URL=http://localhost:11434 + OLLAMA_MODEL=llama3.1

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Provider Options

| Provider | Cost | Setup |
|----------|------|-------|
| **None (Guided Diagnosis)** | Free | Nothing to configure |
| **Ollama** | Free | [Install Ollama](https://ollama.ai), run `ollama pull llama3.1` |
| **Anthropic Claude** | ~$0.01/query | Get API key at [console.anthropic.com](https://console.anthropic.com) |

## Setup Workflow

1. **Pick car & track** — sidebar shows the default setup immediately
2. **Enter your current setup** — upload a `.json` or edit values manually to match your in-game setup
3. **Diagnose** — tell the advisor what's wrong (tight, loose, slow, etc.)
4. **Get updated setup** — changes are applied automatically, before/after comparison shown
5. **Download** — grab the `.json` or `.txt` setup sheet
6. **Accept & iterate** — accept changes as your new baseline and keep refining

## What's Inside

### Knowledge Base
Comprehensive oval racing setup engineering covering:
- Every handling condition (tight/loose) at every corner phase
- Car-specific advice (Next Gen IRS vs. solid-axle Xfinity/Truck)
- Track-type strategies (short tracks vs. intermediates vs. superspeedways)
- Spring split, cross weight, track bar, shock, tire pressure, camber, aero, and gearing theory

### 22 Oval Tracks
Every oval on the iRacing schedule with banking, length, and track-type data.

### Setup Sheet Export
Download your setup as a `.txt` printable sheet or `.json` structured file for reference in the garage.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS** (dark racing theme)
- **Anthropic Claude API** or **Ollama** (optional, for AI chat)

## Note on .sto Files

iRacing's native setup files use a proprietary binary format that can't be generated externally. This tool produces setup sheets you reference while entering values in the iRacing garage. The real value is in the diagnosis and recommendations.
