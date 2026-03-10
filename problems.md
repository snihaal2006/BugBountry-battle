# BugBounty Battle - 5 Staged Debugging Problems

---
## STAGE 1 — EASY

**Title:** Fix the Addition Logic
**Difficulty:** Easy
**Description:** The function should return the sum of two integers. A logical bug causes it to output the difference instead.

**Python**
```python
# Locked Code Section (Line 1, Line 3)
def add(a, b):
    # Editable Code Section (Line 2)
    result = a - b
    return result

# Partially Locked Main Function (Lines 5-7 locked)
if __name__ == "__main__":
    a, b = map(int, input().split())
    print(add(a, b))
```

**Test Cases (4)**
- **Test Case 1:** Input: `5 3` | Expected Output: `8`
- **Test Case 2:** Input: `10 4` | Expected Output: `14`
- **Test Case 3:** Input: `2 7` | Expected Output: `9`
- **Test Case 4:** Input: `12 8` | Expected Output: `20`

**Correct Solution**
```python
def add(a, b):
    result = a + b
    return result
```
**Explanation:** The subtraction operator (`-`) must be replaced with the addition operator (`+`).

---
## STAGE 2 — EASY-MEDIUM

**Title:** Fix the Factorial Function
**Difficulty:** Easy-Medium
**Description:** The function is supposed to calculate the factorial of a given number `n`. However, the initialization is incorrect, always resulting in 0.

**Python**
```python
# Locked Code Section (Line 1, Lines 4-5)
def factorial(n):
    # Editable Code Section (Line 2)
    prod = 0
    for i in range(1, n + 1):
        prod *= i
    return prod

# Partially Locked Main Function (Lines 7-9 locked)
if __name__ == "__main__":
    n = int(input())
    print(factorial(n))
```

**Test Cases (4)**
- **Test Case 1:** Input: `5` | Expected Output: `120`
- **Test Case 2:** Input: `4` | Expected Output: `24`
- **Test Case 3:** Input: `1` | Expected Output: `1`
- **Test Case 4:** Input: `6` | Expected Output: `720`

**Correct Solution**
```python
def factorial(n):
    prod = 1
    for i in range(1, n + 1):
        prod *= i
    return prod
```
**Explanation:** The variable `prod` should be initialized to `1` instead of `0` because multiplying by 0 will always result in 0.

---
## STAGE 3 — MEDIUM

**Title:** Even Number Checker
**Difficulty:** Medium
**Description:** The function should return "Even" if a number is divisible by 2, and "Odd" otherwise. A conditional error has inverted the logic.

**Python**
```python
# Locked Code Section (Line 1, Lines 3-6)
def check_even(num):
    # Editable Code Section (Line 2)
    if num % 2 == 1:
        return "Even"
    else:
        return "Odd"

# Partially Locked Main Function (Lines 8-10 locked)
if __name__ == "__main__":
    num = int(input())
    print(check_even(num))
```

**Test Cases (4)**
- **Test Case 1:** Input: `4` | Expected Output: `Even`
- **Test Case 2:** Input: `7` | Expected Output: `Odd`
- **Test Case 3:** Input: `0` | Expected Output: `Even`
- **Test Case 4:** Input: `-2` | Expected Output: `Even`

**Correct Solution**
```python
def check_even(num):
    if num % 2 == 0:
        return "Even"
    else:
        return "Odd"
```
**Explanation:** The condition `num % 2 == 1` checks for odd numbers. It should be changed to `num % 2 == 0`.

---
## STAGE 4 — HARD

**Title:** Array Maximum Finder
**Difficulty:** Hard
**Description:** The function should find the maximum element in a list of integers. It works for positive numbers but fails when the list contains only negative numbers.

**Python**
```python
# Locked Code Section (Line 1, Lines 3-6)
def find_max(arr):
    # Editable Code Section (Line 2)
    max_val = 0
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

# Partially Locked Main Function (Lines 8-10 locked)
if __name__ == "__main__":
    arr = list(map(int, input().split()))
    print(find_max(arr))
```

**Test Cases (4)**
- **Test Case 1:** Input: `1 5 3 9 2` | Expected Output: `9`
- **Test Case 2:** Input: `-5 -2 -10 -1` | Expected Output: `-1`
- **Test Case 3:** Input: `0 -5 5` | Expected Output: `5`
- **Test Case 4:** Input: `-100 -200` | Expected Output: `-100`

**Correct Solution**
```python
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
```
**Explanation:** Initializing `max_val` to `0` introduces a bug for arrays containing exclusively negative numbers. It should be initialized to `arr[0]` or `-float('inf')`.

---
## STAGE 5 — ADVANCED

**Title:** Fibonacci Generator
**Difficulty:** Advanced
**Description:** The function should return the N-th Fibonacci number (where Fib(0)=0, Fib(1)=1). An error in the loop logic causes the values to overwrite incorrectly.

**Python**
```python
# Locked Code Section (Lines 1-4, Line 8)
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        # Editable Code Section (Lines 6-7)
        a = b
        b = a + b
    return b

# Partially Locked Main Function (Lines 10-12 locked)
if __name__ == "__main__":
    n = int(input())
    print(fibonacci(n))
```

**Test Cases (4)**
- **Test Case 1:** Input: `5` | Expected Output: `5`
- **Test Case 2:** Input: `7` | Expected Output: `13`
- **Test Case 3:** Input: `10` | Expected Output: `55`
- **Test Case 4:** Input: `0` | Expected Output: `0`

**Correct Solution**
```python
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        temp = a + b
        a = b
        b = temp
        # OR simply: a, b = b, a + b
    return b
```
**Explanation:** Updating `a = b` first modifies `a` before its previous value can be used to calculate `b`. It should be updated simultaneously using `a, b = b, a + b` or by using a temporary variable.
