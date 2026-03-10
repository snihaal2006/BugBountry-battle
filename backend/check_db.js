require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: problems, error } = await supabase
        .from('problems')
        .select('id, order_index, title, code_c, code_python')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching problems:', JSON.stringify(error, null, 2));
    } else {
        console.log(`Found ${problems.length} problems:`);
        problems.forEach(p => {
            console.log(`  - [${p.order_index}] ${p.title} | has code_c: ${!!p.code_c} | has code_python: ${!!p.code_python}`);
        });
    }

    const { data: testcases, error: tcErr } = await supabase.from('test_cases').select('id, problem_id');
    if (!tcErr) console.log(`\nTotal test cases: ${testcases.length}`);
}

check();
