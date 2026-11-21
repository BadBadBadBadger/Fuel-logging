# v2 swarm — paused work in progress

Partial, untested work from the 5 parallel region agents, saved as patches against
c22783b (the v2 scaffold) when the swarm was paused. Each touches only its own REGION
in app.jsx plus its own spec/e2e files. Apply with `git apply design/v2/wip/<file>.patch`.

| Patch | Region | State when paused |
|---|---|---|
| A-gauge | Gauge · TARGET/EATEN · macros | code under way, tests not run |
| B-meals | LOG FOOD/QUICK ADD · meal rows + editor | code + feature written, e2e next |
| C-body | Water · weight · measurements · workout · last 7 | code written, e2e next |
| D-header-break | Header · lamps · cut tape · break sheets | spec written, region code starting |
| E-settings | Settings v2 | early, still reading v1 ProfileScreen |

Header testid contract: v2-nav-history, v2-nav-badges, v2-nav-settings, v2-nav-account.
