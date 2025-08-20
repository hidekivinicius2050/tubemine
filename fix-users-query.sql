-- Query corrigida para pegar a assinatura mais recente
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.created_at,
  u.updated_at,
  s.plan_type,
  s.status as subscription_status,
  s.valid_until,
  COUNT(sl.id) as search_count
FROM users u
LEFT JOIN (
  SELECT 
    user_id,
    plan_type,
    status,
    valid_until,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM subscriptions
) s ON u.id = s.user_id AND s.rn = 1
LEFT JOIN search_logs sl ON u.id = sl.user_id
GROUP BY u.id
ORDER BY u.created_at DESC
