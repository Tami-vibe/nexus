-- KEYS[1] = capacity:{tenant_id}
-- KEYS[2] = hold:{hold_id}
-- ARGV[1] = hold_id
-- ARGV[2] = tenant_id
-- ARGV[3] = ttl_seconds
-- Returns: 1 on success, 0 if no capacity

local available = tonumber(redis.call('GET', KEYS[1]) or '0')
if available <= 0 then
  return 0
end

redis.call('DECRBY', KEYS[1], 1)
redis.call('SET', KEYS[2], ARGV[2], 'EX', tonumber(ARGV[3]))
return 1
