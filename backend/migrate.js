require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    console.log("Running migration: Adding multi-language columns to problems table...");

    // We use Supabase's rpc to run raw SQL
    const { error } = await supabase.rpc('exec_sql', {
        sql: `
            ALTER TABLE problems 
                ADD COLUMN IF NOT EXISTS order_index INTEGER UNIQUE,
                ADD COLUMN IF NOT EXISTS code_c TEXT,
                ADD COLUMN IF NOT EXISTS locked_lines_c TEXT,
                ADD COLUMN IF NOT EXISTS code_cpp TEXT,
                ADD COLUMN IF NOT EXISTS locked_lines_cpp TEXT,
                ADD COLUMN IF NOT EXISTS code_java TEXT,
                ADD COLUMN IF NOT EXISTS locked_lines_java TEXT,
                ADD COLUMN IF NOT EXISTS code_python TEXT,
                ADD COLUMN IF NOT EXISTS locked_lines_python TEXT;
            NOTIFY pgrst, 'reload schema';
        `
    });

    if (error) {
        console.error("Migration error via rpc:", error.message);
        console.log("\n--- IMPORTANT ---");
        console.log("Please run the following SQL in the Supabase SQL Editor manually:");
        console.log(`
ALTER TABLE problems 
    ADD COLUMN IF NOT EXISTS order_index INTEGER UNIQUE,
    ADD COLUMN IF NOT EXISTS code_c TEXT,
    ADD COLUMN IF NOT EXISTS locked_lines_c TEXT,
    ADD COLUMN IF NOT EXISTS code_cpp TEXT,
    ADD COLUMN IF NOT EXISTS locked_lines_cpp TEXT,
    ADD COLUMN IF NOT EXISTS code_java TEXT,
    ADD COLUMN IF NOT EXISTS locked_lines_java TEXT,
    ADD COLUMN IF NOT EXISTS code_python TEXT,
    ADD COLUMN IF NOT EXISTS locked_lines_python TEXT;

NOTIFY pgrst, 'reload schema';
        `);
    } else {
        console.log("Migration successful! Schema cache reloaded.");
    }
}

migrate();
