# Fuel Log — Start Here 🧭

**Updated:** 2026-06-10 · **One screen: where we are, what's next, which doc for what.**
Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

- **Phase:** B — Compliance & data rights (privacy, consent, export/delete). *Phases 0 & A are deployed.*
- **State:** Phase B engineering is **built in code** (18+ gate, Art. 9 consent, Account & Privacy
  screen with export + delete, worker delete route + 24-month retention sweep, meal PII hint) and
  **committed to branch `phase-b-compliance`** — but **NOT yet deployed or manually tested**.
  All `legal/` policy documents are drafted.
- **Single next blocking step:** deploy + manually test the Phase B engineering.

## Next up (in order)

1. **Deploy & test Phase B engineering** — checklist in `LEGAL_ROADMAP.md §13`
   (run schema migration → set worker `SUPABASE_SERVICE_ROLE` + deploy → add Cloudflare Cron Trigger
   → publish `legal/` pages → manual test the consent→export→delete flow).
2. **Solicitor review** of the two `[HUMAN-REVIEW]` items — Art. 9 consent wording (`LEGAL_ROADMAP §7`)
   and the Anthropic international-transfer mechanism (`LEGAL_ROADMAP §8`).
3. **ICO fee + correspondence address** — `LEGAL_ROADMAP.md §13` / risk **R7** (get a PO box / virtual
   address *before* registering so your home address stays off the public register).

> **Housekeeping:** work sits on branch `phase-b-compliance` (not pushed). Before pushing, **rotate the
> GitHub PAT** that's currently in plaintext in the `git remote` URL.

## Which doc, when

| Open this… | …when you want |
|---|---|
| **START-HERE.md** (this) | where am I / what's next |
| **SECURITY_ROADMAP.md** | the master phase plan (0 → F) + threat model |
| **LEGAL_ROADMAP.md** | privacy/compliance detail (Phase B), deploy checklist, risk register |
| **DOCS.md** | how the product works — features, design system, changelog, backlog |
| **ARCHITECTURE_REVIEW.md** | known issues & severities |
| **SETUP.md** | how to build / run / deploy locally |
| **personas/** | reusable chat "hats" — `Admin` (docs), `privacy-counsel` (legal) |

---

## How this file stays current (the contract)

This file is the **single source of truth for "where we are."** To stop it drifting:

- **Only the `Right now` + `Next up` blocks are volatile** — they're the session leave-off note.
  Everything durable lives in the owning roadmap; this file just links to it.
- **Claude will proactively prompt** you to refresh this file (and flag any other doc that needs
  updating) whenever the project's status changes or a working session wraps up. You can also just ask
  for "a docs update" any time.
- **When you finish a chunk of work,** update (or ask Claude to update): this file's two blocks, the
  relevant checkbox in the owning roadmap, and `DOCS.md` changelog if product behaviour changed.
