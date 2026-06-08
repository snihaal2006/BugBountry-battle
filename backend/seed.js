require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const problems = [
    {
        order_index: 1,
        title: "Stage 1: Find the Largest Number",
        description: "Find the largest element in an array. The starter code initializes the maximum value incorrectly, causing it to fail when the array contains only negative numbers.",
        sample_input: "5\n10 20 5 15 8",
        sample_output: "20\n",
        code_c: `#include <stdio.h>\n\nint find_largest(int arr[], int n) {\n    int max_val = 0;\n    for(int i = 0; i < n; i++) {\n        if(arr[i] > max_val) {\n            max_val = arr[i];\n        }\n    }\n    return max_val;\n}\n\nint main() {\n    int n;\n    if(scanf("%d", &n) == 1) {\n        int arr[100000];\n        for(int i = 0; i < n; i++) scanf("%d", &arr[i]);\n        printf("%d\\n", find_largest(arr, n));\n    }\n    return 0;\n}`,
        locked_lines_c: "1,3,5-8,10-21",
        code_cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint find_largest(vector<int>& arr) {\n    int max_val = 0;\n    for(int num : arr) {\n        if(num > max_val) {\n            max_val = num;\n        }\n    }\n    return max_val;\n}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> arr(n);\n        for(int i = 0; i < n; i++) cin >> arr[i];\n        cout << find_largest(arr) << "\\n";\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,7-10,12-23",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int find_largest(int[] arr) {\n        int max_val = 0;\n        for(int num : arr) {\n            if (num > max_val) {\n                max_val = num;\n            }\n        }\n        return max_val;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for(int i=0; i<n; i++) arr[i] = sc.nextInt();\n            System.out.println(find_largest(arr));\n        }\n    }\n}`,
        locked_lines_java: "1-4,6-10,12-23",
        code_python: `def find_largest(arr):\n    max_val = 0\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val\n\nif __name__ == "__main__":\n    n = int(input())\n    arr = list(map(int, input().split()))\n    print(find_largest(arr))`,
        locked_lines_python: "1,3-6,8-11",
        testcases: [
            { input: "5\n10 20 5 15 8", expected_output: "20\n" },
            { input: "3\n-10 -20 -5", expected_output: "-5\n" },
            { input: "4\n0 0 0 0", expected_output: "0\n" },
            { input: "1\n100", expected_output: "100\n" }
        ]
    },
    {
        order_index: 2,
        title: "Stage 2: Count Even Numbers",
        description: "Count the number of even integers in an array. A bug in the loop logic causes it to accidentally count odd numbers instead of even ones.",
        sample_input: "5\n1 2 3 4 5",
        sample_output: "2\n",
        code_c: `#include <stdio.h>\n\nint count_even(int arr[], int n) {\n    int count = 0;\n    for(int i = 0; i < n; i++) {\n        if(arr[i] % 2 == 1) {\n            count++;\n        }\n    }\n    return count;\n}\n\nint main() {\n    int n;\n    if(scanf("%d", &n) == 1) {\n        int arr[100000];\n        for(int i = 0; i < n; i++) scanf("%d", &arr[i]);\n        printf("%d\\n", count_even(arr, n));\n    }\n    return 0;\n}`,
        locked_lines_c: "1,3,4,5,7-9,11-21",
        code_cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint count_even(vector<int>& arr) {\n    int count = 0;\n    for(int num : arr) {\n        if(num % 2 == 1) {\n            count++;\n        }\n    }\n    return count;\n}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> arr(n);\n        for(int i = 0; i < n; i++) cin >> arr[i];\n        cout << count_even(arr) << "\\n";\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,7,9-12,14-23",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int count_even(int[] arr) {\n        int count = 0;\n        for(int num : arr) {\n            if (num % 2 == 1) {\n                count++;\n            }\n        }\n        return count;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for(int i=0; i<n; i++) arr[i] = sc.nextInt();\n            System.out.println(count_even(arr));\n        }\n    }\n}`,
        locked_lines_java: "1-4,6,8-12,14-23",
        code_python: `def count_even(arr):\n    count = 0\n    for num in arr:\n        if num % 2 == 1:\n            count += 1\n    return count\n\nif __name__ == "__main__":\n    n = int(input())\n    arr = list(map(int, input().split()))\n    print(count_even(arr))`,
        locked_lines_python: "1,2,3,5-7,9-11",
        testcases: [
            { input: "5\n1 2 3 4 5", expected_output: "2\n" },
            { input: "3\n2 4 6", expected_output: "3\n" },
            { input: "3\n1 3 5", expected_output: "0\n" },
            { input: "1\n0", expected_output: "1\n" }
        ]
    },
    {
        order_index: 3,
        title: "Stage 3: Reverse a String",
        description: "Reverse a given string. A bug in the loop condition causes the reversed string to be missing the first character of the original string.",
        sample_input: "hello",
        sample_output: "olleh\n",
        code_c: `#include <stdio.h>\n#include <string.h>\n\nvoid reverse_string(char str[]) {\n    int n = strlen(str);\n    for(int i = n - 1; i > 0; i--) {\n        printf("%c", str[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    char str[100000];\n    if(scanf("%s", str) == 1) {\n        reverse_string(str);\n    }\n    return 0;\n}`,
        locked_lines_c: "1,2,4,5,7-9,11-18",
        code_cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nvoid reverse_string(string str) {\n    for(int i = str.length() - 1; i > 0; i--) {\n        cout << str[i];\n    }\n    cout << "\\n";\n}\n\nint main() {\n    string str;\n    if(cin >> str) {\n        reverse_string(str);\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,7-10,12-18",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static void reverse_string(String str) {\n        for(int i = str.length() - 1; i > 0; i--) {\n            System.out.print(str.charAt(i));\n        }\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            reverse_string(sc.next());\n        }\n    }\n}`,
        locked_lines_java: "1-4,6-9,11-17",
        code_python: `def reverse_string(s):\n    rev = ""\n    for i in range(len(s) - 1, 0, -1):\n        rev += s[i]\n    print(rev)\n\nif __name__ == "__main__":\n    s = input().strip()\n    reverse_string(s)`,
        locked_lines_python: "1,2,4-6,8-9",
        testcases: [
            { input: "hello", expected_output: "olleh\n" },
            { input: "a", expected_output: "a\n" },
            { input: "racecar", expected_output: "racecar\n" },
            { input: "ab", expected_output: "ba\n" }
        ]
    },
    {
        order_index: 4,
        title: "Stage 4: Sum of Digits",
        description: "Calculate the sum of digits of a given positive integer. A bug causes the program to print the last digit instead of the sum of all digits.",
        sample_input: "1234",
        sample_output: "10\n",
        code_c: `#include <stdio.h>\n\nint sum_of_digits(int n) {\n    int sum = 0;\n    while(n > 0) {\n        sum = n % 10;\n        n /= 10;\n    }\n    return sum;\n}\n\nint main() {\n    int n;\n    if(scanf("%d", &n) == 1) {\n        printf("%d\\n", sum_of_digits(n));\n    }\n    return 0;\n}`,
        locked_lines_c: "1,3,4,5,7-10,12-18",
        code_cpp: `#include <iostream>\nusing namespace std;\n\nint sum_of_digits(int n) {\n    int sum = 0;\n    while(n > 0) {\n        sum = n % 10;\n        n /= 10;\n    }\n    return sum;\n}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        cout << sum_of_digits(n) << "\\n";\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,7,9-12,14-20",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static int sum_of_digits(int n) {\n        int sum = 0;\n        while (n > 0) {\n            sum = n % 10;\n            n /= 10;\n        }\n        return sum;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            System.out.println(sum_of_digits(sc.nextInt()));\n        }\n    }\n}`,
        locked_lines_java: "1-4,6,8-12,14-20",
        code_python: `def sum_of_digits(n):\n    total_sum = 0\n    while n > 0:\n        total_sum = n % 10\n        n //= 10\n    return total_sum\n\nif __name__ == "__main__":\n    n = int(input())\n    print(sum_of_digits(n))`,
        locked_lines_python: "1,2,3,5-7,9-10",
        testcases: [
            { input: "1234", expected_output: "10\n" },
            { input: "5", expected_output: "5\n" },
            { input: "999", expected_output: "27\n" },
            { input: "1000", expected_output: "1\n" }
        ]
    },
    {
        order_index: 5,
        title: "Stage 5: Prime Number Check",
        description: "Determine whether a number is prime. The loop incorrectly returns 'Prime' or 'Not Prime' on its very first iteration instead of finishing all checks.",
        sample_input: "13",
        sample_output: "Prime\n",
        code_c: `#include <stdio.h>\n\nvoid check_prime(int n) {\n    if (n <= 1) {\n        printf("Not Prime\\n");\n        return;\n    }\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i != 0) {\n            printf("Prime\\n");\n            return;\n        } else {\n            printf("Not Prime\\n");\n            return;\n        }\n    }\n    printf("Prime\\n");\n}\n\nint main() {\n    int n;\n    if(scanf("%d", &n) == 1) {\n        check_prime(n);\n    }\n    return 0;\n}`,
        locked_lines_c: "1,3-8,17-26",
        code_cpp: `#include <iostream>\nusing namespace std;\n\nvoid check_prime(int n) {\n    if (n <= 1) {\n        cout << "Not Prime\\n";\n        return;\n    }\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i != 0) {\n            cout << "Prime\\n";\n            return;\n        } else {\n            cout << "Not Prime\\n";\n            return;\n        }\n    }\n    cout << "Prime\\n";\n}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        check_prime(n);\n    }\n    return 0;\n}`,
        locked_lines_cpp: "1-5,9,18-27",
        code_java: `import java.util.Scanner;\n\npublic class Main {\n    public static void check_prime(int n) {\n        if (n <= 1) {\n            System.out.println("Not Prime");\n            return;\n        }\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i != 0) {\n                System.out.println("Prime");\n                return;\n            } else {\n                System.out.println("Not Prime");\n                return;\n            }\n        }\n        System.out.println("Prime");\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            check_prime(sc.nextInt());\n        }\n    }\n}`,
        locked_lines_java: "1-4,10,20-29",
        code_python: `def check_prime(n):\n    if n <= 1:\n        print("Not Prime")\n        return\n    for i in range(2, int(n**0.5) + 1):\n        if n % i != 0:\n            print("Prime")\n            return\n        else:\n            print("Not Prime")\n            return\n    print("Prime")\n\nif __name__ == "__main__":\n    n = int(input())\n    check_prime(n)`,
        locked_lines_python: "1,5,13-16",
        testcases: [
            { input: "13", expected_output: "Prime\n" },
            { input: "15", expected_output: "Not Prime\n" },
            { input: "2", expected_output: "Prime\n" },
            { input: "1", expected_output: "Not Prime\n" },
            { input: "9", expected_output: "Not Prime\n" }
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
