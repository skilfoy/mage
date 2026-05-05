type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
export function checkRateLimit(key: string, maxRequests: number, windowSeconds: number) { const now=Date.now(); const bucket=buckets.get(key); if(!bucket || bucket.resetAt<=now){ buckets.set(key,{count:1,resetAt:now+windowSeconds*1000}); return { allowed:true, remaining:maxRequests-1 }; } if(bucket.count>=maxRequests) return { allowed:false, remaining:0, resetAt:bucket.resetAt }; bucket.count++; return { allowed:true, remaining:maxRequests-bucket.count, resetAt:bucket.resetAt }; }
export function resetRateLimits(){ buckets.clear(); }
