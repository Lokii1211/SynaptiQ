import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Supabase Configuration ───
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is properly configured for SERVER-SIDE operations
// Requires the service role key for full database access
export function isSupabaseConfigured(): boolean {
    return !!(supabaseUrl && supabaseUrl.startsWith("http") && supabaseServiceKey);
}

// Lazy-initialized clients — only created when actually needed
let _supabaseAdmin: SupabaseClient | null = null;
let _supabaseAnon: SupabaseClient | null = null;

// Service-role client for server-side operations (full access, bypasses RLS)
export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env.local");
        }
        _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });
    }
    return _supabaseAdmin;
}

// Anon client for client-side operations (respects RLS)
export function getSupabaseAnon(): SupabaseClient {
    if (!_supabaseAnon) {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase anon key is not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
        }
        _supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabaseAnon;
}
