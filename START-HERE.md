# Fuel Log — Start Here 🧭

**Updated:** 2026-06-10 (deploy session: DB + worker live; publish/test remain) · **One screen: where we are, what's next, which doc for what.**
Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

- **Phase:** B — Compliance & data rights (privacy, consent, export/delete). *Phases 0 & A are deployed.*
- **State (2026-06-10):** Phase B engineering built, committed, and **branch pushed to `origin`**.
  **Deploy is part-done on live infra:** ✅ Supabase consent-column migration run & verified;
  ✅ worker deployed (`/delete-account` + retention sweep live, `SUPABASE_SERVICE_ROLE` set).
  **Not yet done:** publishing `legal/` pages (= merge `phase-b-compliance` → `main`, which also takes
  the new app live) and the manual end-to-end test. Cron trigger deferred (optional). All `legal/`
  docs drafted; Anthropic transfer mechanism **resolved**.
- **Single next blocking step:** merge → `main` to publish (goes fully live), then manual-test
  consent → export → delete.

## Next up (in order)

1. **Publish + test Phase B** — `LEGAL_ROADMAP.md §13` steps 5–6: merge `phase-b-compliance` → `main`
   (GitHub Pages auto-deploys legal pages + the new app), then manual-test the consent→export→delete
   flow on the live site. *(Optional, deferred: cron trigger, §13 step 4.)*
2. **Narrow legal review** — *one* item left: the Art. 9 consent wording (`LEGAL_ROADMAP §7` tier 7g),
   before Play submission; downgradeable to a self-assessment + free ICO steer. *The Anthropic transfer
   mechanism is **resolved** (2026-06-10 — DPA already in force; `§8`).*
3. **ICO fee + correspondence address** — `LEGAL_ROADMAP.md §13` / risk **R7** (get a PO box / virtual
   address *before* registering so your home address stays off the public register).

> **Housekeeping:** branch `phase-b-compliance` is **pushed** to `origin` (2026-06-10) and tracking it;
> the remote URL is credential-free (auth via Windows Credential Manager) and the exposed PAT was
> **deleted on GitHub**. **DB migration + worker deploy are DONE** (consent columns live; worker serves
> `/delete-account` + sweep). Next: publish `legal/` pages (merge → `main`). **⏳ TODO later (optional):**
> add the Cloudflare cron trigger `0 3 * * 0` (`§13` step 4) — deferred, nothing depends on it yet.

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
