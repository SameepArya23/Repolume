import NodeCache from "node-cache";

// 24-hour TTL (in seconds)
const TTL_SECONDS = 24 * 60 * 60;

const cache = new NodeCache({ stdTTL: TTL_SECONDS, checkperiod: 60 * 10 });

/**
 * Retrieve a cached value by key.
 * Returns undefined if the key does not exist or has expired.
 */
export function getCached<T>(key: string): T | undefined {
    return cache.get<T>(key);
}

/**
 * Store a value in the cache with the default 24-hour TTL.
 */
export function setCached<T>(key: string, value: T): void {
    cache.set<T>(key, value);
}

/**
 * Remove a specific key from the cache.
 */
export function invalidateCache(key: string): void {
    cache.del(key);
}

/**
 * Build a normalized cache key for a repository analysis result.
 * Format: `repo:owner/repo`
 */
export function repoCacheKey(owner: string, repo: string): string {
    return `repo:${owner}/${repo}`;
}
