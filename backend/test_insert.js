require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
    console.log('Testing simple insert...');

    const { data, error } = await supabase
        .from('problems')
        .insert([{
            order_index: 99,
            title: 'TEST',
            description: 'test',
            sample_input: 'x',
            sample_output: 'y',
            code_python: 'print("hello")',
            locked_lines_python: '1'
        }])
        .select()
        .single();

    if (error) {
        // Write full error to stdout so it isn't truncated
        process.stdout.write('\nFULL ERROR:\n' + JSON.stringify(error, null, 2) + '\n');
        process.exit(1);
    } else {
        console.log('Insert successful! ID:', data.id, 'order_index:', data.order_index);
        await supabase.from('problems').delete().eq('id', data.id);
        console.log('Cleaned up test row. Schema migration is working!');
    }
}

testInsert();
