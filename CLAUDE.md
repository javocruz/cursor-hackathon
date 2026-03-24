# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A hackathon starter repo for IE University's Cursor Hackathon (March 2026). The challenge: **Make one person's hard day easier.** Teams build a focused solution during the event and deploy it live on Vercel.

This is not an application codebase — it's a launchpad. The `starter/` folder contains a zero-dependency HTML/CSS site ready for Vercel deployment. Teams are expected to replace, extend, or completely rebuild it with whatever stack fits their solution.

## Starter Project

- `starter/index.html` — minimal HTML5 template
- `starter/style.css` — clean CSS with flexbox centering, system fonts
- `starter/vercel.json` — sets output directory to `.` for Vercel

No build tools, no package.json, no JavaScript framework. If a team adds npm dependencies, they'll create their own package.json.

## Deployment

```bash
npx vercel
```

Or connect the GitHub repo to Vercel and set root directory to `starter/`. The project **must** be deployed and live — judges evaluate via the URL.

## Key Constraints

- Projects must be built during the event
- Submission deadline: 16:00 (hard cutoff)
- Teams of 1–4 people
- Final submission requires a working deployed Vercel link
- Submission via Google Form: https://forms.gle/dS1H98eJoZwsXj7e7

## Evaluation Criteria (from CHALLENGE.md)

1. **Understanding of the person and problem** — grounded in a real person/situation
2. **Relevance and usefulness** — solves a real friction point concretely
3. **Technical execution** — functional, live, reliable, polished enough to use
4. **Creativity and interpretation** — original angle, intentional framing
5. **Use of Cursor and technical leverage** — used tools to build something more ambitious
6. **Presentation and storytelling** — clear narrative, real person/problem, explained decisions

## Working on This Repo

When helping a team build their project, keep in mind:
- Scope should be ruthlessly small — one thing that works completely beats five half-done features
- The solution should be grounded in a specific person's real problem, not a generic product idea
- Deploy early, not in the last hour
- The presentation matters as much as the code — who, what problem, what you built, why it helps
