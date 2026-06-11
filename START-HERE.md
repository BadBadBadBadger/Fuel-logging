# Fuel Log — Start Here 🧭

**Updated:** 2026-06-11 (session 3: backlog features #2–#8 all built, 70/70 tests, sw v34) · **One screen: where we are, what's next, which doc for what.**
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
- **State:** Phase B is **LIVE and working** (`main` @ Phase B, 2026-06-10; rollback point `8622d24`).
  ✅ Verified on the live site: consent gate fires, consent recorded, **all existing data intact** after
  consent. Engineering deploy is effectively complete.
- **No blocking step.** Remaining items are optional/low-priority (see Next up).

## Next up (in order)

1. **Optional finish-the-test** — `LEGAL_ROADMAP.md §13` step 6: test **"Download my data"** (safe).
   ⚠️ **Don't test "Delete my account" on your real account** — use a throwaway Google account.
2. **Optional, deferred:** Cloudflare cron trigger (`§13` step 4 — nothing depends on it yet).
3. **Before Play submission:** narrow Art. 9 consent-wording review (`§7` tier 7g) + ICO fee/address (R7).
2. **Narrow legal review** — *one* item left: the Art. 9 consent wording (`LEGAL_ROADMAP §7` tier 7g),
   before Play submission; downgradeable to a self-assessment + free ICO steer. *The Anthropic transfer
   mechanism is **resolved** (2026-06-10 — DPA already in force; `§8`).*
3. **ICO fee + correspondence address** — `LEGAL_ROADMAP.md §13` / risk **R7** (get a PO box / virtual
   address *before* registering so your home address stays off the public register).

> **Feature track (parallel to legal, last touched 2026-06-11 session 3):** triaged product backlog
> lives in `DOCS.md §23`. Still decided + specced but NOT built: **celebration redesign → one engine**
> (`features/fuel-log.feature`, `@wip`).
>
> **2026-06-11 (session 3): ALL 6 backlog features #2–#8 BUILT.** `app.jsx` rebuilt → `app.js`, `sw`
> bumped **v33 → v34**, tests **70/70 green** (added 26: macro floor engine, coach pacing, dietary
> scan + prompt block). Summary:
> - **#4 haptic** on every C/U/D (weigh-in, target override, profile save, MealForm save, QuickAdd
>   delete/reset, voucher; shared funnels de-duped to avoid double-buzz).
> - **#3 repeat-add** — AI Log rows show `✓ Added ×N` + re-blink each tap (remount-keyed `blink_add`);
>   dashboard ⚡ chip re-blinks; count ephemeral.
> - **#2 AI estimate on Quick Add** — `MealForm` mirrors `EntryEditor` (premium-gated, AI-first, OFF
>   refinement); threaded through QuickAdd + History manual.
> - **#7 macro floor engine** — new `computeMacros` pure fn (flat protein 2.2/2.0 g/kg LBM across all
>   modes, fat 0.6 g/kg hard floor, carbs absorb, "FLOORS KEPT" warn). Replaced per-mode protein in
>   `calcTargets` AND the proportional scaling in the custom-target path.
> - **#5/#6 coach** — state-aware (eaten foods by name, prior tips to avoid repeats, variety/fibre)
>   + computed `paceVerdict` (window starts at first meal; only protein/water paced, never calories;
>   no "behind" <25% window; gentle non-shaming nudges). Coach-hat reviewed.
> - **#8 dietary/allergies** — `TagField` combobox in Profile (diet/allergens/dislikes); module-level
>   `DIETARY` cache feeds `dietaryPromptBlock` into all 4 AI prompts; zero-token `scanAllergens`
>   backstop flags coach tips + AI Log items. Allergen matching biased to over-detect (safety).
>
> **⚠️ NOT yet eyeballed on a real device / live worker.** Unit-tested only. Haptics need a real phone;
> the AI features (#2 estimate, #5/#6 coach, #8 filter) need the live Cloudflare worker. `@wip` tags in
> the feature file are left ON until manual verification. **NOT committed yet** (working tree only).
> **Deploy note:** these go live when Phase B merges → `main`.
>
> **Next (feature track):** commit the build → manual on-device/live verification pass → flip `@wip`
> tags → update `DOCS.md` changelog → then the celebration-redesign feature.
>
> **Stray file:** `features/_inbox.feature` (untracked BDD staging placeholder) — keep or bin.
>
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
| **personas/** | reusable chat "hats" — `Admin` (docs), `privacy-counsel` (legal), `QA` (BDD/Gherkin) |

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
