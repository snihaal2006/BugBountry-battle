require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const problems = [
    {
        order_index: 1,
        title: "Stage 1: Fix the Addition Logic",
        description: "The function should return the sum of two integers. A logical bug causes incorrect output.",
        sample_input: "5 3",
        sample_output: "8",
        code_c: `#include <stdio.h>\n\nint add(int a, int b) {\n    int result = a - b;\n    return result;\n}\n\nint main() {\n    int a, b;\n    if(scanf("%d %d", &a, &b) == 2) {\n        printf("%d\\n", add(a, b));\n    }\n    return 0;\n}`,
        locked_lines_c: "1,2,3,6,8-14",
        code_cpp: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    int result = a - b;\n    return result;\n}\n\nint main() {\n    int a, b;\n    if(cin >> a >> b) {\n        cout << add(a, b) << endl;\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1,2,4,5,8,10-16",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int add(int a, int b) {\n        int result = a - b;\n        return result;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(add(a, b));\n        }\n    }\n}`,
        locked_lines_java: "1-4,7,9-16",
        code_python: `def add(a, b):\n    result = a - b\n    return result\n\nif __name__ == "__main__":\n    a, b = map(int, input().split())\n    print(add(a, b))`,
        locked_lines_python: "1,4-7",
        testcases: [
            { input: "5 3", expected_output: "8\n" },
            { input: "10 4", expected_output: "14\n" },
            { input: "2 7", expected_output: "9\n" },
            { input: "12 -8", expected_output: "4\n" }
        ]
    },
    {
        order_index: 2,
        title: "Stage 2: Fix the Factorial Function",
        description: "Calculate the factorial of a given number n. The initialization is currently incorrect.",
        sample_input: "5",
        sample_output: "120",
        code_c: `#include <stdio.h>\n\nlong long factorial(int n) {\n    long long prod = 0;\n    for (int i = 1; i <= n; i++) {\n        prod *= i;\n    }\n    return prod;\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%lld\\n", factorial(n));\n    return 0;\n}`,
        locked_lines_c: "1,3,4,6-9,11-16",
        code_cpp: `#include <iostream>\n\nlong long factorial(int n) {\n    long long prod = 0;\n    for (int i = 1; i <= n; i++) {\n        prod *= i;\n    }\n    return prod;\n}\n\nint main() {\n    int n;\n    std::cin >> n;\n    std::cout << factorial(n) << "\\n";\n    return 0;\n}`,
        locked_lines_cpp: "1,3,4,6-9,11-16",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static long factorial(int n) {\n        long prod = 0;\n        for (int i = 1; i <= n; i++) {\n            prod *= i;\n        }\n        return prod;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            System.out.println(factorial(sc.nextInt()));\n        }\n    }\n}`,
        locked_lines_java: "1-4,6-10,12-18",
        code_python: `def factorial(n):\n    prod = 0\n    for i in range(1, n + 1):\n        prod *= i\n    return prod\n\nif __name__ == "__main__":\n    n = int(input())\n    print(factorial(n))`,
        locked_lines_python: "1,4-8",
        testcases: [
            { input: "5", expected_output: "120\n" },
            { input: "4", expected_output: "24\n" },
            { input: "1", expected_output: "1\n" },
            { input: "6", expected_output: "720\n" }
        ]
    },
    {
        order_index: 3,
        title: "Stage 3: Even Number Checker",
        description: "Return 'Even' if a number is divisible by 2, and 'Odd' otherwise. A conditional error has inverted the logic.",
        sample_input: "4",
        sample_output: "Even\n",
        code_c: `#include <stdio.h>\n\nvoid checkEven(int num) {\n    if (num % 2 == 1) {\n        printf("Even\\n");\n    } else {\n        printf("Odd\\n");\n    }\n}\n\nint main() {\n    int num;\n    scanf("%d", &num);\n    checkEven(num);\n    return 0;\n}`,
        locked_lines_c: "1,3,5,7,10-15",
        code_cpp: `#include <iostream>\n\nvoid checkEven(int num) {\n    if (num % 2 == 1) {\n        std::cout << "Even\\n";\n    } else {\n        std::cout << "Odd\\n";\n    }\n}\n\nint main() {\n    int num;\n    std::cin >> num;\n    checkEven(num);\n    return 0;\n}`,
        locked_lines_cpp: "1,3,5,7,10-15",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static String checkEven(int num) {\n        if (num % 2 == 1) {\n            return "Even";\n        } else {\n            return "Odd";\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            System.out.println(checkEven(scanner.nextInt()));\n        }\n        scanner.close();\n    }\n}`,
        locked_lines_java: "1-4,6-10,12-20",
        code_python: `def checkEven(num):\n    if num % 2 == 1:\n        return "Even"\n    else:\n        return "Odd"\n\nif __name__ == "__main__":\n    num = int(input())\n    print(checkEven(num))`,
        locked_lines_python: "1,3,5-9",
        testcases: [
            { input: "4", expected_output: "Even\n" },
            { input: "7", expected_output: "Odd\n" },
            { input: "0", expected_output: "Even\n" },
            { input: "11", expected_output: "Odd\n" }
        ]
    },
    {
        order_index: 4,
        title: "Stage 4: Array Maximum Finder",
        description: "Find the maximum element in a list of integers. It fails when the list contains only negative numbers.",
        sample_input: "5\n1 5 3 9 2",
        sample_output: "9",
        code_c: `#include <stdio.h>\n\nint find_max(int arr[], int n) {\n    int max_val = 0;\n    for(int i = 0; i < n; i++) {\n        if(arr[i] > max_val) {\n            max_val = arr[i];\n        }\n    }\n    return max_val;\n}\n\nint main() {\n    int n;\n    if(scanf("%d", &n) == 1) {\n        int arr[100];\n        for(int i = 0; i < n; i++) scanf("%d", &arr[i]);\n        printf("%d\\n", find_max(arr, n));\n    }\n    return 0;\n}`,
        locked_lines_c: "1,3,5-8,10-20",
        code_cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint find_max(vector<int>& arr) {\n    int max_val = 0;\n    for(int num : arr) {\n        if(num > max_val) {\n            max_val = num;\n        }\n    }\n    return max_val;\n}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> arr(n);\n        for(int i = 0; i < n; i++) cin >> arr[i];\n        cout << find_max(arr) << "\\n";\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,7-10,12-23",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int find_max(int[] arr) {\n        int max_val = 0;\n        for(int num : arr) {\n            if (num > max_val) {\n                max_val = num;\n            }\n        }\n        return max_val;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for(int i=0; i<n; i++) arr[i] = sc.nextInt();\n            System.out.println(find_max(arr));\n        }\n    }\n}`,
        locked_lines_java: "1-4,6-10,12-23",
        code_python: `def find_max(arr):\n    max_val = 0\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val\n\nif __name__ == "__main__":\n    n = input()\n    arr = list(map(int, input().split()))\n    print(find_max(arr))`,
        locked_lines_python: "1,2,4-7,9-11",
        testcases: [
            { input: "5\n1 5 3 9 2", expected_output: "9\n" },
            { input: "4\n-5 -2 -10 -1", expected_output: "-1\n" },
            { input: "3\n0 -5 5", expected_output: "5\n" },
            { input: "2\n-100 -200", expected_output: "-100\n" }
        ]
    },
    {
        order_index: 5,
        title: "Stage 5: Fibonacci Generator",
        description: "Return the N-th Fibonacci number. An error in the loop logic causes values to overwrite incorrectly.",
        sample_input: "5",
        sample_output: "5\n",
        code_c: `#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for(int i = 2; i <= n; i++) {\n        a = b;\n        b = a + b;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d\\n", fibonacci(n));\n    return 0;\n}`,
        locked_lines_c: "1,3-6,9-17",
        code_cpp: `#include <iostream>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for(int i = 2; i <= n; i++) {\n        a = b;\n        b = a + b;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    std::cin >> n;\n    std::cout << fibonacci(n) << "\\n";\n    return 0;\n}`,
        locked_lines_cpp: "1,3-6,9-17",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            a = b;\n            b = a + b;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            System.out.println(fibonacci(sc.nextInt()));\n        }\n    }\n}`,
        locked_lines_java: "1-7,10-12,14-20",
        code_python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a = b\n        b = a + b\n    return b\n\nif __name__ == "__main__":\n    n = int(input())\n    print(fibonacci(n))`,
        locked_lines_python: "1-5,8-12",
        testcases: [
            { input: "5", expected_output: "5\n" },
            { input: "7", expected_output: "13\n" },
            { input: "10", expected_output: "55\n" },
            { input: "0", expected_output: "0\n" }
        ]
    }
];

async function seed() {
    console.log("Starting Problem Injection...");

    // Clear old testcases first to avoid foreign key restraints. 
    await supabase.from('test_cases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // Clear old submissions
    await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // Clear problems
    await supabase.from('problems').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // Reset Team progress
    await supabase.from('teams').update({ score: 0, problems_solved: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');

    for (let p of problems) {
        console.log("Injecting Stage " + p.order_index + ":", p.title);
        const { data: prob, error: pError } = await supabase
            .from('problems')
            .insert([{
                order_index: p.order_index,
                title: p.title,
                description: p.description,
                sample_input: p.sample_input,
                sample_output: p.sample_output,
                code_c: p.code_c, locked_lines_c: p.locked_lines_c,
                code_cpp: p.code_cpp, locked_lines_cpp: p.locked_lines_cpp,
                code_java: p.code_java, locked_lines_java: p.locked_lines_java,
                code_python: p.code_python, locked_lines_python: p.locked_lines_python,
            }])
            .select()
            .single();

        if (pError) {
            console.error("Problem Error:", pError);
            continue;
        }

        const tcs = p.testcases.map(tc => ({
            problem_id: prob.id,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: true
        }));

        const { error: tcError } = await supabase.from('test_cases').insert(tcs);
        if (tcError) {
            console.error("Test Case Error:", tcError);
        }
    }
    console.log("All Multi-Language problems injected successfully and Team scores reset to 0!");
}

seed();
