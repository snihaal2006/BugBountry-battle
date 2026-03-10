const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let initClient = () => {
  // We try to use the service role key to bypass RLS for admin tasks (if provided),
  // otherwise fallback to the anon key.
  const key = supabaseServiceKey || supabaseKey;
  if (!supabaseUrl || !key) {
    console.error('Supabase URL or Key is missing in environment variables.');
  }
  return createClient(supabaseUrl || 'http://localhost', key || 'placeholder');
}

const supabase = initClient();

module.exports = supabase;
