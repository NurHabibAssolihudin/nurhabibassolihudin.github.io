# Selected projects review — 2026-11-05

Scope: public repositories owned by NurHabibAssolihudin. The owner confirmed that their projects are all on GitHub. Review checked source and README, not only repo size or recency. No remote code was executed and no production claims were inferred from the presence of a Dockerfile.

Added:
- Tony: a scoped self-hosting/integration case. The engine is explicitly credited to Letta Code. Evidence: root README, docker/Dockerfile, docker/entrypoint.sh, scripts/tony/check-pins.mjs, docs/12-vendor-sync.md, docs/13-security-audit.md, in https://github.com/NurHabibAssolihudin/Tony . The README marks phase 1 in progress; the case retains that boundary and does not present automation or custom UI plans as delivered features.

Not selected as mature additions:
- GenUI: README explicitly states mock AI, in-memory per-session state, and demo scope. https://github.com/NurHabibAssolihudin/GenUI
- RabbitMQ Chat: README describes a learning application; inspected main.py and receiver.py show a prototype publisher/consumer/WebSocket flow. No verified production reliability. https://github.com/NurHabibAssolihudin/RabbitMQ-Chat-App
- Backtrade Terminal: inspected backtest engine accepts dates but does not pass date bounds to its CSV feed; requirements do not establish a reproducible backtrader/questionary install. The public README is only a heading/banner. https://github.com/NurHabibAssolihudin/Backtrade_Terminal

These exclusions are portfolio curation decisions, not claims that the projects have no value. Tony is selected for its concrete integration work rather than described as a mature end-user product. The Tony entry has EN/ID content, original CSS/Motion artwork (no fabricated screenshots), standalone pages, modal reader entries and sitemap URLs.

The owner explicitly excluded the portfolio itself from Selected Projects. Its proposed content, card artwork, routes and sitemap entries were removed; the catalogue now contains ORCA, Ocaty, Oxelot and Tony.

