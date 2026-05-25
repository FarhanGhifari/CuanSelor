import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { env, requireEnv } from "./env.js";

requireEnv(["supabaseUrl", "supabaseServiceRoleKey"]);

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
});
