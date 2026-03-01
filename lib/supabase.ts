import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client configured with the service role key.
 * The service role key bypasses Row Level Security — only use server-side.
 */
export function getSupabaseClient(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
        );
    }

    supabaseInstance = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return supabaseInstance;
}
