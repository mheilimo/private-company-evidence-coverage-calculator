# Private Company Evidence Coverage Calculator

A free, client-side worksheet for investors, evaluators and founders reviewing
private-company materials. Mark evidence as supported, partial or missing
across 12 due diligence dimensions and get a simple coverage percentage plus a
short review-priority list.

Live tool:
<https://mheilimo.github.io/private-company-evidence-coverage-calculator/>

## Scope

The worksheet measures only whether supporting material is present. It does
not estimate evidence quality, company success, investment return or the
DDScore Due Diligence Score. It is not investment advice.

The 12 dimension names and review prompts are based on DDScore's public
investor framework:

1. Business Idea
2. Offering
3. Team
4. Market
5. Competitors
6. Technology & IP
7. Scalability
8. Legal & Regulatory
9. Exit
10. Presentation
11. Financial Critique
12. Fundability

## Privacy

The static page has no analytics, account, upload or server-side storage. All
state stays in the current browser tab. The JSON export is generated locally.

## DDScore

[DDScore](https://www.ddscore.ai/for-investor/?utm_source=github-pages&utm_medium=referral&utm_campaign=ddscore-30d-jul-2026&utm_content=evidence-coverage-calculator-a)
turns pitch decks and private-company materials into a structured first-pass
report across 12 due diligence dimensions. It surfaces strengths, risks,
missing evidence and the questions that deserve deeper review. DDScore supports
human judgement and does not replace full due diligence.

## Local verification

```bash
CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" \
NODE_PATH="/c/Users/mikko/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules" \
node test-calculator.cjs
```

## Licence

MIT
