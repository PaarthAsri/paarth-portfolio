# PAARTH://SEC — Interactive Cybersecurity Portfolio

An interactive cybersecurity portfolio for **Paarth Asri**, built as a single-page command-center experience with a CLI terminal, dynamic role rotation, security status simulation, and project showcases.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Space Grotesk, JetBrains Mono, IBM Plex Sans
- **Email:** Resend (server-side only)

## Features

- Interactive CLI terminal with 18+ commands
- Animated `sudo whoami` identity sequence
- Dynamic role rotation
- Security status typing simulation
- Subtle periodic glitch effect
- NORMAL / BREACH mode simulation
- Theme system (Cyber / Terminal / Amber)
- Custom cursor with context-aware colors
- Project showcases with detail modals
- Secure contact form with email delivery
- CV download
- Fully responsive

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your@email.com
```

See `.env.example` for the expected format.

## Deployment

Deployed on Vercel. Push to `main` triggers automatic deployment.

## License

MIT
