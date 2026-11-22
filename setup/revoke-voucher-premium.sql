-- Revoke premium granted by the leaked voucher code (FreeFoodTips2026).
-- Run in the Supabase SQL editor. Only touches rows the /redeem endpoint wrote
-- (source = 'voucher'); paid/webhook entitlements are left alone.
--
-- Note: every voucher shared the same source tag, so this reverts ALL voucher
-- redemptions. Re-grant anyone legitimate after rotating to the new code
-- (they can simply redeem the new one).

-- 1. Preview who will be affected.
SELECT e.user_id, u.email, e.tier, e.status, e.created_at, e.updated_at
FROM entitlements e
JOIN auth.users u ON u.id = e.user_id
WHERE e.source = 'voucher' AND e.tier = 'premium'
ORDER BY e.updated_at DESC;

-- 2. Downgrade them to free.
UPDATE entitlements
SET tier = 'free', status = 'inactive', expires_at = NULL,
    source = 'voucher_revoked', updated_at = NOW()
WHERE source = 'voucher' AND tier = 'premium';
