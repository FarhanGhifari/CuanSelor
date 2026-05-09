require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env",
  );
}

// Kita menggunakan SERVICE ROLE KEY di backend karena backend bertindak sebagai admin
// yang memiliki akses penuh untuk bypass RLS (Row Level Security) saat memanipulasi data
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
