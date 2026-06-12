# Fuel Log — Start Here 🧭

**Updated:** 2026-06-12 (session 6: shipped **v6.4 light mode** then **v6.5 celebration redesign** — one rarity-scaled engine (quiet 🔥 thumb-zone pip · Bronze/Silver toast+glow · Gold+ fanfare), old streak/milestone overlays deleted, **frozen dashboard/Account headers**, `?dev` test harness; device-tested, **85/85**, sw v48; merged to `main`. Next: more badge categories.) · **One screen: where we are, what's next, which doc for what.**
Read this first. It never duplicates roadmap detail — it points to it.

---

## Right now

- **Phase:** B — Compliance & data rights — is **LIVE and verified** (`main` @ Phase B, 2026-06-10;
  rollback point `8622d24`). Consent gate fires, consent recorded, existing data intact. Engineering
  deploy is effectively complete. *Phases 0 & A deployed before it.*
- **Product (session 4, 2026-06-12):** session-3 features **#2–#8 are SHIPPED + VERIFIED on device**
  (see feature-track note below). New **app icon** shipped (`icon-192/512.png` regenerated from
  `logo-master.png`, sw `v36 → v37`). Tests **70/70 green**.
- **Shipped v6.3 (session 5, 2026-06-12, device-verified + merged to `main`):** **independent
  per-field display units** on Profile (weight {kg, st+lb, lb}, height {cm, ft+in, in} — chosen
  separately per beta feedback that UK users mix; storage stays metric) + an **allergen/preference
  auto-select safety fix** (`TagField` Enter resolves to the canonical preset, restoring the allergen
  synonym scan). Unit fields use a self-contained `MeasureField` (seed-once local buffers,
  remount-on-unit-switch) with **contextual-zero** handling — blank when a measurement is unset, but a
  real 0 (12 st 0 lb / 5 ft 0 in) is shown. Tests **85/85**, sw `v37 → v41`, BDD scenarios verified,
  DOCS **v6.3**. The previously-held **v37 app-icon** commit went to `main` in the same merge.
- **No blocking step.** Next build is the celebration redesign.

## Next up (in order)

0. **✅ DONE — light mode (v6.4) + celebration redesign (v6.5), shipped to `main`, session 6.**
   Light: system-aware + 3-way 🌙/☀️/🖥️ toggle, CSS-variable palette (DOCS §35). Celebration: one
   rarity-scaled engine — quiet 🔥 **thumb-zone pip** on daily log, Bronze/Silver **toast + 🏆 glow**,
   Gold+ **fanfare** (count-up, ~2.5s, silent); old streak/milestone overlays deleted; **frozen
   dashboard/Account headers**; **`?dev`** test harness (DOCS §36). New **design-lead persona** ("design
   hat"/"UX hat"). **One on-device follow-up still open:** confirm the *live* OS dark/light flip applies
   mid-session in the installed PWA (the one light-mode scenario not verifiable by trace).
1. **▶ Build: more badge categories** — the sole remaining product backlog feature (`DOCS §23`):
   Protein King, Cut Champion, Bulk Mode, Balanced. Reuses the v6.5 tier + celebration engine, so it's
   mostly metric calcs + data. **Natural next build.**
2. **Optional, deferred:** Cloudflare cron trigger (`LEGAL_ROADMAP §13` step 4 — nothing depends on it).
3. **Optional, safe:** test **"Download my data"** (`§13` step 6). ⚠️ **Never test "Delete my account"
   on your real account** — use a throwaway Google account.
4. **Before Play submission:** narrow Art. 9 consent-wording review (`§7` tier 7g — downgradeable to a
   self-assessment + free ICO steer; Anthropic transfer mechanism already **resolved**, `§8`) **+**
   ICO fee & correspondence address (risk **R7**: get a PO box / virtual address *before* registering
   so your home address stays off the public register).

> **Feature track (parallel to legal, last touched 2026-06-12 session 4):** triaged product backlog
> lives in `DOCS.md §23`.
>
> **Session-3 features #2–#8 are SHIPPED + VERIFIED.** Built session 3 (sw `v33 → v36`), deployed live
> to `origin/main`, tests **70/70 green**. On-device verification (Pixel 7) **complete 2026-06-12**:
> - ✅ **#2 Quick Add AI estimate** — milk-while-vegan now fills correctly (v36 fix confirmed; the old
>   false-"✓ Filled"-with-blanks bug is gone).
> - ✅ **#3 repeat-add** — `✓ Added` tick + re-blink confirmed.
> - ✅ **#5/#6 coach** — state-aware (avoided re-suggesting logged foods) + safe pacing confirmed.
> - ✅ **#7 macro floors** — low custom target shows "FLOORS KEPT" warning (saving not blocked).
> - ✅ **#8 dietary/allergies** — diet filter keeps suggestions on-diet; declared-allergen log flags ⚠️.
> - ⏸️ **#4 haptics — DEFERRED to native/Play packaging.** `navigator.vibrate` is a silent no-op on
>   mobile Chrome / Pixel 7 (confirmed via isolation test — platform, not our code). `haptic()` left in
>   as a feature-detected no-op. **Do not re-debug web haptics.** (Debug page recoverable at git `9f4b54f`.)
>
> **Bookkeeping done this session:** `@wip` tags flipped in `features/fuel-log.feature` (only the
> celebration redesign + deferred haptics keep `@wip`); superseded proportional-scaling scenario
> deleted; `DOCS.md` changelog written (new **v6.2** entry). **Not yet committed.**
>
> **Next (feature track):** **celebration redesign → one engine** (`features/fuel-log.feature`, `@wip`) —
> decided + specced, NOT built. The sole remaining backlog feature.
>
> **Stray file:** `features/_inbox.feature` (untracked BDD staging placeholder) — keep or bin.
>
> **Housekeeping:** branch `phase-b-compliance` is **pushed** to `origin` and tracking it; the exposed
> PAT was **deleted on GitHub**. **DB migration + worker deploy are DONE** (consent columns live; worker
> serves `/delete-account` + sweep). **⏳ TODO later (optional):** Cloudflare cron trigger `0 3 * * 0`
> (`§13` step 4) — deferred, nothing depends on it yet.

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
