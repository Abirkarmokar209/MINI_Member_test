// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ftqrdpjkksthjbtzjgcw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_nURZLzAe-6mShXdhoYL_TQ_2kuikjrz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);