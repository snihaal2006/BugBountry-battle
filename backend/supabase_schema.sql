-- Paste this entire script into your Supabase SQL Editor and run it

CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    tab_switches INTEGER DEFAULT 0,
    is_disqualified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE problems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_index INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sample_input TEXT,
    sample_output TEXT,
    code_c TEXT,
    locked_lines_c TEXT,
    code_cpp TEXT,
    locked_lines_cpp TEXT,
    code_java TEXT,
    locked_lines_java TEXT,
    code_python TEXT,
    locked_lines_python TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE test_cases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    result TEXT DEFAULT 'Pending' CHECK (result IN ('Pending', 'Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE contest (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT DEFAULT 'BugBounty Battle',
    rules TEXT DEFAULT 'Solve the buggy code. Tab switches are logged.',
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'running', 'ended')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-populate the single contest row
INSERT INTO contest (title, status) VALUES ('BugBounty Battle', 'upcoming');
