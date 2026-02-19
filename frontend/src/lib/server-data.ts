// In-memory data store for Vercel serverless deployment
// Career data + user storage

// Re-export comprehensive careers database (60+ profiles)
import { CAREERS_DATABASE } from "./careers-data";
export const CAREERS = CAREERS_DATABASE;


export const ASSESSMENT_QUESTIONS = [
    {
        id: 1, question: "When solving a problem, you prefer to:", category: "analytical", options: [
            { text: "Break it into logical steps and analyze each part", trait: "analytical", score: 5 },
            { text: "Look for creative, unconventional approaches", trait: "creative", score: 5 },
            { text: "Discuss it with others and get different perspectives", trait: "social", score: 5 },
            { text: "Jump right in and learn by doing", trait: "realistic", score: 5 }]
    },
    {
        id: 2, question: "In a group project, you naturally take the role of:", category: "work_style", options: [
            { text: "Leader â€” organizing tasks and directing the team", trait: "enterprising", score: 5 },
            { text: "Researcher â€” gathering data and analyzing information", trait: "analytical", score: 5 },
            { text: "Mediator â€” ensuring everyone is heard and aligned", trait: "social", score: 5 },
            { text: "Executor â€” doing the hands-on work to get things done", trait: "realistic", score: 5 }]
    },
    {
        id: 3, question: "Which activity excites you the most?", category: "interests", options: [
            { text: "Building something with code or technology", trait: "analytical", score: 5 },
            { text: "Designing visuals or creating art", trait: "creative", score: 5 },
            { text: "Leading or starting a new initiative", trait: "enterprising", score: 5 },
            { text: "Helping people solve their problems", trait: "social", score: 5 }]
    },
    {
        id: 4, question: "When you achieve a goal, what matters most to you?", category: "values", options: [
            { text: "Financial reward and stability", trait: "conventional", score: 5 },
            { text: "Recognition and personal growth", trait: "enterprising", score: 5 },
            { text: "Impact â€” knowing I made a difference", trait: "social", score: 5 },
            { text: "The learning and skills I gained along the way", trait: "analytical", score: 5 }]
    },
    {
        id: 5, question: "Your ideal work environment would be:", category: "work_style", options: [
            { text: "A quiet office with focused deep work", trait: "analytical", score: 5 },
            { text: "A vibrant, creative studio", trait: "creative", score: 5 },
            { text: "A bustling startup with constant energy", trait: "enterprising", score: 5 },
            { text: "A collaborative team-based setting", trait: "social", score: 5 }]
    },
    {
        id: 6, question: "Which school subject did you enjoy most?", category: "aptitude", options: [
            { text: "Mathematics or Computer Science", trait: "analytical", score: 5 },
            { text: "Art, Music, or Literature", trait: "creative", score: 5 },
            { text: "Economics or Business Studies", trait: "enterprising", score: 5 },
            { text: "Biology or Social Sciences", trait: "social", score: 5 }]
    },
    {
        id: 7, question: "How do you prefer to learn something new?", category: "learning_style", options: [
            { text: "Read documentation/textbooks and understand concepts", trait: "analytical", score: 5 },
            { text: "Watch videos and visual demonstrations", trait: "creative", score: 5 },
            { text: "Hands-on practice and building projects", trait: "realistic", score: 5 },
            { text: "Discuss with mentors or peers", trait: "social", score: 5 }]
    },
    {
        id: 8, question: "Which of these challenges appeals to you?", category: "interests", options: [
            { text: "Optimizing a system to be more efficient", trait: "analytical", score: 5 },
            { text: "Designing an award-winning brand identity", trait: "creative", score: 5 },
            { text: "Scaling a business from 0 to 1 million users", trait: "enterprising", score: 5 },
            { text: "Teaching underprivileged kids new skills", trait: "social", score: 5 }]
    },
    {
        id: 9, question: "You're more comfortable with:", category: "personality", options: [
            { text: "Numbers, data, and spreadsheets", trait: "conventional", score: 5 },
            { text: "Colors, shapes, and visual patterns", trait: "creative", score: 5 },
            { text: "Words, persuasion, and negotiation", trait: "enterprising", score: 5 },
            { text: "People, emotions, and relationships", trait: "social", score: 5 }]
    },
    {
        id: 10, question: "If money wasn't a concern, you would:", category: "passion", options: [
            { text: "Build technology that changes the world", trait: "analytical", score: 5 },
            { text: "Create art, music, or films", trait: "creative", score: 5 },
            { text: "Start a company and build something from scratch", trait: "enterprising", score: 5 },
            { text: "Work in social causes or NGOs", trait: "social", score: 5 }]
    },
    {
        id: 11, question: "When making decisions, you rely more on:", category: "decision_style", options: [
            { text: "Logic, facts, and data analysis", trait: "analytical", score: 5 },
            { text: "Intuition and gut feeling", trait: "creative", score: 5 },
            { text: "Strategic thinking and risk-reward analysis", trait: "enterprising", score: 5 },
            { text: "How it affects people around me", trait: "social", score: 5 }]
    },
    {
        id: 12, question: "What do you value most in a career?", category: "values", options: [
            { text: "High salary and financial growth", trait: "conventional", score: 5 },
            { text: "Creative freedom and expression", trait: "creative", score: 5 },
            { text: "Power, influence, and leadership opportunities", trait: "enterprising", score: 5 },
            { text: "Work-life balance and meaningful impact", trait: "social", score: 5 }]
    },
    {
        id: 13, question: "Your friends would describe you as:", category: "personality", options: [
            { text: "The logical one who always thinks things through", trait: "analytical", score: 5 },
            { text: "The creative one with wild ideas", trait: "creative", score: 5 },
            { text: "The ambitious one always chasing goals", trait: "enterprising", score: 5 },
            { text: "The caring one everyone goes to for advice", trait: "social", score: 5 }]
    },
    {
        id: 14, question: "Which weekend activity do you prefer?", category: "interests", options: [
            { text: "Coding a side project or learning tech", trait: "analytical", score: 5 },
            { text: "Drawing, designing, or photography", trait: "creative", score: 5 },
            { text: "Reading about business or side hustles", trait: "enterprising", score: 5 },
            { text: "Volunteering or spending time with family", trait: "social", score: 5 }]
    },
    {
        id: 15, question: "When faced with ambiguity, you:", category: "adaptability", options: [
            { text: "Research and gather more data before acting", trait: "analytical", score: 5 },
            { text: "Embrace it and see where creativity takes me", trait: "creative", score: 5 },
            { text: "Make a quick decision and pivot if needed", trait: "enterprising", score: 5 },
            { text: "Seek input from trusted people around me", trait: "social", score: 5 }]
    },
];

// â”€â”€â”€ CODING CHALLENGES (Company-Specific, Career-Based) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const CODING_CHALLENGES = [
    // â”€â”€â”€ EASY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
        id: "cc1", title: "Two Sum", difficulty: "Easy", category: "Arrays", company: ["Google", "Amazon", "Meta"], career: "technology",
        description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.\n\nConstraints:\n- 2 â‰¤ nums.length â‰¤ 10â´\n- Each input has exactly one solution\n- You may not use the same element twice",
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }, { input: "nums = [3,2,4], target = 6", output: "[1,2]" }],
        hints: ["Use a hash map for O(n) solution", "Store complement values as you iterate"],
        starterCode: { javascript: "function twoSum(nums, target) {\n  // Your code here\n}", python: "def two_sum(nums, target):\n    # Your code here\n    pass", java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}", cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};", c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    return NULL;\n}" },
        testCases: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }, { input: [[3, 2, 4], 6], expected: [1, 2] }, { input: [[3, 3], 6], expected: [0, 1] }], tags: ["hash-map", "array"], points: 10
    },

    {
        id: "cc2", title: "Reverse String", difficulty: "Easy", category: "Strings", company: ["Microsoft", "Amazon"], career: "technology",
        description: "Write a function that reverses a string. The input string is given as an array of characters.\n\nDo not allocate extra space for another array.",
        examples: [{ input: '"hello"', output: '"olleh"' }, { input: '"world"', output: '"dlrow"' }],
        hints: ["Try two-pointer approach", "Swap characters from both ends"],
        starterCode: { javascript: "function reverseString(s) {\n  // Your code here\n}", python: "def reverse_string(s):\n    # Your code here\n    pass", java: "class Solution {\n    public String reverseString(String s) {\n        // Your code here\n        return \"\";\n    }\n}", cpp: "class Solution {\npublic:\n    string reverseString(string s) {\n        // Your code here\n        return \"\";\n    }\n};", c: "char* reverseString(char* s) {\n    // Your code here\n    return s;\n}" },
        testCases: [{ input: ["hello"], expected: "olleh" }, { input: ["world"], expected: "dlrow" }], tags: ["string", "two-pointers"], points: 10
    },

    {
        id: "cc3", title: "Valid Parentheses", difficulty: "Easy", category: "Stacks", company: ["Google", "Amazon", "Bloomberg"], career: "technology",
        description: "Given a string containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets are closed by the same type\n2. Open brackets are closed in the correct order",
        examples: [{ input: '"()[]{}"', output: "true" }, { input: '"(]"', output: "false" }],
        hints: ["Use a stack", "Push opening brackets, pop for closing"],
        starterCode: { javascript: "function isValid(s) {\n  // Your code here\n}", python: "def is_valid(s):\n    # Your code here\n    pass", java: "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}", cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n        return false;\n    }\n};", c: "bool isValid(char* s) {\n    // Your code here\n    return false;\n}" },
        testCases: [{ input: ["()[]{}"], expected: true }, { input: ["(]"], expected: false }, { input: ["([])"], expected: true }], tags: ["stack"], points: 10
    },

    {
        id: "cc4", title: "Binary Search", difficulty: "Easy", category: "Searching", company: ["Google", "Microsoft", "Apple"], career: "technology",
        description: "Given a sorted array of integers nums and a target value, return the index of the target if found. If not, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
        hints: ["Use left and right pointers", "Check mid element each iteration"],
        starterCode: { javascript: "function search(nums, target) {\n  // Your code here\n}", python: "def search(nums, target):\n    # Your code here\n    pass", java: "class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}", cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};", c: "int search(int* nums, int numsSize, int target) {\n    // Your code here\n    return -1;\n}" },
        testCases: [{ input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }], tags: ["binary-search"], points: 10
    },

    {
        id: "cc5", title: "Palindrome Check", difficulty: "Easy", category: "Strings", company: ["TCS", "Infosys", "Wipro"], career: "technology",
        description: "Given a string, determine if it is a palindrome. Consider only alphanumeric characters and ignore cases.",
        examples: [{ input: '"racecar"', output: "true" }, { input: '"hello"', output: "false" }],
        hints: ["Compare from both ends", "Convert to lowercase first"],
        starterCode: { javascript: "function isPalindrome(s) {\n  // Your code here\n}", python: "def is_palindrome(s):\n    # Your code here\n    pass", java: "class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}", cpp: "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        return false;\n    }\n};", c: "bool isPalindrome(char* s) {\n    return false;\n}" },
        testCases: [{ input: ["racecar"], expected: true }, { input: ["hello"], expected: false }, { input: ["madam"], expected: true }], tags: ["string", "two-pointers"], points: 10
    },

    {
        id: "cc6", title: "FizzBuzz", difficulty: "Easy", category: "Basics", company: ["TCS", "Cognizant", "Accenture"], career: "technology",
        description: "Given integer n, return a string array answer where:\n- answer[i] = 'FizzBuzz' if i is divisible by 3 and 5\n- answer[i] = 'Fizz' if i is divisible by 3\n- answer[i] = 'Buzz' if i is divisible by 5\n- answer[i] = i (as string) otherwise",
        examples: [{ input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' }],
        hints: ["Check divisibility by 15 first, then 3, then 5"],
        starterCode: { javascript: "function fizzBuzz(n) {\n  // Your code here\n}", python: "def fizz_buzz(n):\n    # Your code here\n    pass", java: "class Solution {\n    public List<String> fizzBuzz(int n) {\n        return new ArrayList<>();\n    }\n}", cpp: "class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        return {};\n    }\n};", c: "char** fizzBuzz(int n, int* returnSize) {\n    return NULL;\n}" },
        testCases: [{ input: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] }, { input: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] }], tags: ["basics", "interview-classic"], points: 5
    },

    {
        id: "cc7", title: "Maximum Element in Array", difficulty: "Easy", category: "Arrays", company: ["Infosys", "Wipro", "HCL"], career: "technology",
        description: "Find the maximum element in an unsorted array of integers.",
        examples: [{ input: "[3, 7, 2, 9, 1]", output: "9" }],
        hints: ["Track max while iterating"],
        starterCode: { javascript: "function findMax(arr) {\n  // Your code here\n}", python: "def find_max(arr):\n    # Your code here\n    pass", java: "class Solution {\n    public int findMax(int[] arr) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int findMax(vector<int>& arr) {\n        return 0;\n    }\n};", c: "int findMax(int* arr, int size) {\n    return 0;\n}" },
        testCases: [{ input: [[3, 7, 2, 9, 1]], expected: 9 }, { input: [[-5, -2, -8, -1]], expected: -1 }], tags: ["array", "basics"], points: 5
    },

    {
        id: "cc8", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", category: "Arrays", company: ["Microsoft", "Facebook", "LinkedIn"], career: "technology",
        description: "Given a sorted array, remove duplicates in-place and return the new length.",
        examples: [{ input: "[1,1,2]", output: "2 (array becomes [1,2])" }],
        hints: ["Use two pointers â€” slow and fast"],
        starterCode: { javascript: "function removeDuplicates(nums) {\n  // Return new length\n}", python: "def remove_duplicates(nums):\n    # Return new length\n    pass", java: "class Solution {\n    public int removeDuplicates(int[] nums) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        return 0;\n    }\n};", c: "int removeDuplicates(int* nums, int numsSize) {\n    return 0;\n}" },
        testCases: [{ input: [[1, 1, 2]], expected: 2 }, { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 }], tags: ["array", "two-pointers"], points: 10
    },

    // â”€â”€â”€ MEDIUM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
        id: "cc9", title: "Maximum Subarray (Kadane's)", difficulty: "Medium", category: "Dynamic Programming", company: ["Amazon", "Microsoft", "Goldman Sachs"], career: "technology",
        description: "Find the contiguous subarray which has the largest sum and return its sum.\n\nConstraints:\n- 1 â‰¤ nums.length â‰¤ 10âµ\n- -10â´ â‰¤ nums[i] â‰¤ 10â´",
        examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6 (subarray [4,-1,2,1])" }],
        hints: ["Kadane's Algorithm â€” keep running sum, reset when negative", "Track global maximum separately"],
        starterCode: { javascript: "function maxSubArray(nums) {\n  // Your code here\n}", python: "def max_sub_array(nums):\n    # Your code here\n    pass", java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};", c: "int maxSubArray(int* nums, int numsSize) {\n    return 0;\n}" },
        testCases: [{ input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }, { input: [[1]], expected: 1 }, { input: [[-1]], expected: -1 }], tags: ["dp", "greedy", "kadane"], points: 20
    },

    {
        id: "cc10", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings", company: ["Amazon", "Google", "Bloomberg", "Uber"], career: "technology",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [{ input: '"abcabcbb"', output: "3 (abc)" }, { input: '"bbbbb"', output: "1 (b)" }],
        hints: ["Sliding window technique", "Use a Set or Map to track characters"],
        starterCode: { javascript: "function lengthOfLongestSubstring(s) {\n  // Your code here\n}", python: "def length_of_longest_substring(s):\n    # Your code here\n    pass", java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};", c: "int lengthOfLongestSubstring(char* s) {\n    return 0;\n}" },
        testCases: [{ input: ["abcabcbb"], expected: 3 }, { input: ["bbbbb"], expected: 1 }, { input: ["pwwkew"], expected: 3 }], tags: ["sliding-window", "hash-map"], points: 25
    },

    {
        id: "cc11", title: "Merge Intervals", difficulty: "Medium", category: "Arrays", company: ["Google", "Facebook", "Bloomberg", "Palantir"], career: "technology",
        description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.",
        examples: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
        hints: ["Sort by start time first", "Compare current end with next start"],
        starterCode: { javascript: "function merge(intervals) {\n  // Your code here\n}", python: "def merge(intervals):\n    # Your code here\n    pass", java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[][]{};\n    }\n}", cpp: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        return {};\n    }\n};", c: "int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}" },
        testCases: [], tags: ["sorting", "intervals"], points: 25
    },

    {
        id: "cc12", title: "3Sum", difficulty: "Medium", category: "Arrays", company: ["Amazon", "Google", "Apple", "Uber"], career: "technology",
        description: "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i â‰  j â‰  k and nums[i] + nums[j] + nums[k] == 0.",
        examples: [{ input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
        hints: ["Sort the array first", "Fix one element, use two pointers for remaining"],
        starterCode: { javascript: "function threeSum(nums) {\n  // Your code here\n}", python: "def three_sum(nums):\n    # Your code here\n    pass", java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}", cpp: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        return {};\n    }\n};", c: "int** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {\n    return NULL;\n}" },
        testCases: [], tags: ["two-pointers", "sorting"], points: 25
    },

    {
        id: "cc13", title: "Linked List Cycle Detection", difficulty: "Medium", category: "Linked Lists", company: ["Amazon", "Microsoft", "Oracle"], career: "technology",
        description: "Given head of a linked list, determine if it has a cycle.",
        examples: [{ input: "[3,2,0,-4], pos=1", output: "true" }],
        hints: ["Floyd's cycle detection (tortoise and hare)", "Slow moves 1, fast moves 2 â€” if they meet, cycle exists"],
        starterCode: { javascript: "function hasCycle(head) {\n  // Your code here\n}", python: "def has_cycle(head):\n    # Your code here\n    pass", java: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}", cpp: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        return false;\n    }\n};", c: "bool hasCycle(struct ListNode *head) {\n    return false;\n}" },
        testCases: [], tags: ["linked-list", "two-pointers", "floyd"], points: 20
    },

    {
        id: "cc14", title: "Product of Array Except Self", difficulty: "Medium", category: "Arrays", company: ["Amazon", "Apple", "Facebook", "Razorpay"], career: "technology",
        description: "Given integer array nums, return array answer where answer[i] is the product of all elements except nums[i]. Must run in O(n) without division.",
        examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
        hints: ["Use prefix and suffix products", "Two-pass approach â€” left products then right products"],
        starterCode: { javascript: "function productExceptSelf(nums) {\n  // Your code here\n}", python: "def product_except_self(nums):\n    # Your code here\n    pass", java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}", cpp: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        return {};\n    }\n};", c: "int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    return NULL;\n}" },
        testCases: [{ input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] }], tags: ["array", "prefix-sum"], points: 25
    },

    {
        id: "cc15", title: "Rotate Matrix 90Â°", difficulty: "Medium", category: "Matrix", company: ["Amazon", "Microsoft", "Google"], career: "technology",
        description: "You are given an n x n 2D matrix. Rotate the image by 90 degrees clockwise in-place.",
        examples: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }],
        hints: ["Transpose the matrix, then reverse each row"],
        starterCode: { javascript: "function rotate(matrix) {\n  // Modify in-place\n}", python: "def rotate(matrix):\n    # Modify in-place\n    pass", java: "class Solution {\n    public void rotate(int[][] matrix) {\n        // Your code here\n    }\n}", cpp: "class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Your code here\n    }\n};", c: "void rotate(int** matrix, int matrixSize, int* matrixColSize) {\n    // Your code here\n}" },
        testCases: [], tags: ["matrix", "in-place"], points: 20
    },

    {
        id: "cc16", title: "Coin Change", difficulty: "Medium", category: "Dynamic Programming", company: ["Google", "Amazon", "Goldman Sachs", "Flipkart"], career: "technology",
        description: "Given coins of different denominations and a total amount, return the fewest number of coins needed. Return -1 if not possible.",
        examples: [{ input: "coins = [1,5,10], amount = 12", output: "3 (10+1+1)" }],
        hints: ["DP bottom-up: dp[i] = min coins for amount i", "Initialize dp[0] = 0, rest = Infinity"],
        starterCode: { javascript: "function coinChange(coins, amount) {\n  // Your code here\n}", python: "def coin_change(coins, amount):\n    # Your code here\n    pass", java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}", cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        return -1;\n    }\n};", c: "int coinChange(int* coins, int coinsSize, int amount) {\n    return -1;\n}" },
        testCases: [{ input: [[1, 5, 10], 12], expected: 3 }, { input: [[2], 3], expected: -1 }], tags: ["dp", "greedy"], points: 25
    },

    {
        id: "cc17", title: "Number of Islands", difficulty: "Medium", category: "Graphs", company: ["Amazon", "Google", "Microsoft", "Uber"], career: "technology",
        description: "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.",
        examples: [{ input: "grid = [[1,1,0],[0,1,0],[0,0,1]]", output: "2" }],
        hints: ["BFS or DFS from each unvisited land cell", "Mark visited cells to avoid counting twice"],
        starterCode: { javascript: "function numIslands(grid) {\n  // Your code here\n}", python: "def num_islands(grid):\n    # Your code here\n    pass", java: "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};", c: "int numIslands(char** grid, int gridSize, int* gridColSize) {\n    return 0;\n}" },
        testCases: [], tags: ["bfs", "dfs", "graph"], points: 25
    },

    {
        id: "cc18", title: "Sort Array of 0s, 1s, 2s (Dutch National Flag)", difficulty: "Medium", category: "Arrays", company: ["TCS", "Infosys", "Microsoft", "Amazon"], career: "technology",
        description: "Sort an array of 0s, 1s, and 2s in a single pass (Dutch National Flag problem).",
        examples: [{ input: "[2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
        hints: ["Three pointers: low, mid, high", "Swap elements based on value at mid"],
        starterCode: { javascript: "function sortColors(nums) {\n  // Sort in-place\n  return nums;\n}", python: "def sort_colors(nums):\n    # Sort in-place\n    return nums", java: "class Solution {\n    public void sortColors(int[] nums) {\n    }\n}", cpp: "class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n    }\n};", c: "void sortColors(int* nums, int numsSize) {\n}" },
        testCases: [{ input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] }, { input: [[2, 0, 1]], expected: [0, 1, 2] }], tags: ["dutch-flag", "in-place"], points: 20
    },

    {
        id: "cc19", title: "Stock Buy Sell (Max Profit)", difficulty: "Medium", category: "Arrays", company: ["Amazon", "Goldman Sachs", "Morgan Stanley", "Flipkart"], career: "finance",
        description: "Given array of stock prices on each day, find max profit from one buy and one sell. You must buy before sell.",
        examples: [{ input: "[7,1,5,3,6,4]", output: "5 (buy at 1, sell at 6)" }],
        hints: ["Track minimum price so far", "Calculate profit at each step"],
        starterCode: { javascript: "function maxProfit(prices) {\n  // Your code here\n}", python: "def max_profit(prices):\n    # Your code here\n    pass", java: "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};", c: "int maxProfit(int* prices, int pricesSize) {\n    return 0;\n}" },
        testCases: [{ input: [[7, 1, 5, 3, 6, 4]], expected: 5 }, { input: [[7, 6, 4, 3, 1]], expected: 0 }], tags: ["array", "greedy"], points: 20
    },

    {
        id: "cc20", title: "Find First and Last Position in Sorted Array", difficulty: "Medium", category: "Searching", company: ["Google", "Amazon", "Uber"], career: "technology",
        description: "Given a sorted array and target, find the starting and ending position of target. Return [-1,-1] if not found. Must be O(log n).",
        examples: [{ input: "nums=[5,7,7,8,8,10], target=8", output: "[3,4]" }],
        hints: ["Two binary searches â€” one for first, one for last occurrence"],
        starterCode: { javascript: "function searchRange(nums, target) {\n  // Your code here\n}", python: "def search_range(nums, target):\n    # Your code here\n    pass", java: "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        return new int[]{-1,-1};\n    }\n}", cpp: "class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        return {-1,-1};\n    }\n};", c: "int* searchRange(int* nums, int numsSize, int target, int* returnSize) {\n    return NULL;\n}" },
        testCases: [{ input: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] }, { input: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] }], tags: ["binary-search"], points: 25
    },

    // â”€â”€â”€ HARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
        id: "cc21", title: "LRU Cache", difficulty: "Hard", category: "Design", company: ["Google", "Amazon", "Microsoft", "Facebook", "Flipkart"], career: "technology",
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement get(key) and put(key, value) in O(1) time.",
        examples: [{ input: "capacity = 2", output: "LRUCache object" }],
        hints: ["Use HashMap + Doubly Linked List", "HashMap gives O(1) lookup, DLL gives O(1) removal"],
        starterCode: { javascript: "class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {}\n  put(key, value) {}\n}", python: "class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass", java: "class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}", cpp: "class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};", c: "// Use struct for LRU Cache implementation\ntypedef struct {\n    int capacity;\n} LRUCache;" },
        testCases: [], tags: ["design", "hash-map", "linked-list"], points: 40
    },

    {
        id: "cc22", title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Searching", company: ["Google", "Amazon", "Goldman Sachs"], career: "technology",
        description: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. Must be O(log(m+n)).",
        examples: [{ input: "nums1=[1,3], nums2=[2]", output: "2.0" }],
        hints: ["Binary search on the smaller array", "Partition both arrays such that left half â‰¤ right half"],
        starterCode: { javascript: "function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}", python: "def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass", java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}", cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};", c: "double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    return 0.0;\n}" },
        testCases: [], tags: ["binary-search", "divide-conquer"], points: 45
    },

    {
        id: "cc23", title: "Trapping Rain Water", difficulty: "Hard", category: "Arrays", company: ["Google", "Amazon", "Microsoft", "Goldman Sachs", "Uber"], career: "technology",
        description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
        examples: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
        hints: ["Two-pointer approach", "Or use prefix max arrays from left and right"],
        starterCode: { javascript: "function trap(height) {\n  // Your code here\n}", python: "def trap(height):\n    # Your code here\n    pass", java: "class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        return 0;\n    }\n};", c: "int trap(int* height, int heightSize) {\n    return 0;\n}" },
        testCases: [{ input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 }], tags: ["two-pointers", "stack"], points: 40
    },

    {
        id: "cc24", title: "Word Ladder", difficulty: "Hard", category: "Graphs", company: ["Amazon", "Google", "Facebook"], career: "technology",
        description: "Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence where only one letter can change at a time.",
        examples: [{ input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]', output: "5" }],
        hints: ["BFS â€” each word is a node, edges connect words differing by one letter"],
        starterCode: { javascript: "function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n}", python: "def ladder_length(begin_word, end_word, word_list):\n    # Your code here\n    pass", java: "class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        return 0;\n    }\n}", cpp: "class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        return 0;\n    }\n};", c: "int ladderLength(char* beginWord, char* endWord, char** wordList, int wordListSize) {\n    return 0;\n}" },
        testCases: [], tags: ["bfs", "graph"], points: 40
    },

    {
        id: "cc25", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", category: "Trees", company: ["Google", "Amazon", "Microsoft", "Uber"], career: "technology",
        description: "Design an algorithm to serialize and deserialize a binary tree.",
        examples: [{ input: "[1,2,3,null,null,4,5]", output: "Same tree reconstructed" }],
        hints: ["Use pre-order traversal with null markers", "BFS level-order also works"],
        starterCode: { javascript: "function serialize(root) {\n  // Your code\n}\nfunction deserialize(data) {\n  // Your code\n}", python: "class Codec:\n    def serialize(self, root):\n        pass\n    def deserialize(self, data):\n        pass", java: "public class Codec {\n    public String serialize(TreeNode root) { return \"\"; }\n    public TreeNode deserialize(String data) { return null; }\n}", cpp: "class Codec {\npublic:\n    string serialize(TreeNode* root) { return \"\"; }\n    TreeNode* deserialize(string data) { return nullptr; }\n};", c: "char* serialize(struct TreeNode* root) { return NULL; }\nstruct TreeNode* deserialize(char* data) { return NULL; }" },
        testCases: [], tags: ["tree", "design", "bfs"], points: 45
    },
];

// â”€â”€â”€ DAILY QUIZ QUESTIONS (MCQ) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const DAILY_QUIZZES: Record<string, any[]> = {
    "technology": [
        { id: "dq1", question: "What does API stand for?", options: ["Application Programming Interface", "Applied Programming Integration", "Automated Process Interface", "Application Process Integration"], correct: 0, explanation: "API stands for Application Programming Interface â€” it defines how software components communicate.", points: 5 },
        { id: "dq2", question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Array", "Tree"], correct: 1, explanation: "Queue uses First-In-First-Out (FIFO) ordering.", points: 5 },
        { id: "dq3", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(nÂ²)", "O(1)"], correct: 1, explanation: "Binary search halves the search space each step, giving O(log n).", points: 5 },
        { id: "dq4", question: "Which protocol does HTTPS use for encryption?", options: ["SSL/TLS", "SSH", "AES", "RSA only"], correct: 0, explanation: "HTTPS uses SSL/TLS to encrypt communications between client and server.", points: 5 },
        { id: "dq5", question: "What is a closure in JavaScript?", options: ["A function with access to its outer scope", "A way to close browser tabs", "A design pattern only", "A type of loop"], correct: 0, explanation: "A closure is a function that has access to its parent scope, even after the parent function has closed.", points: 5 },
        { id: "dq6", question: "Which SQL command is used to retrieve data?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correct: 1, explanation: "SELECT is the SQL command used to query and retrieve data from databases.", points: 5 },
        { id: "dq7", question: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Standard Technology", "Responsive Server Technology", "Real-time Event Stream Transfer"], correct: 0, explanation: "REST is an architectural style for designing networked applications.", points: 5 },
        { id: "dq8", question: "Which company created React.js?", options: ["Google", "Facebook/Meta", "Microsoft", "Amazon"], correct: 1, explanation: "React was created by Facebook (now Meta) and is maintained as an open-source project.", points: 5 },
    ],
    "business": [
        { id: "dq9", question: "What does ROI stand for?", options: ["Return on Investment", "Rate of Interest", "Return on Income", "Revenue on Investment"], correct: 0, explanation: "ROI measures the return (profit/loss) relative to the investment cost.", points: 5 },
        { id: "dq10", question: "What is a balance sheet?", options: ["Summary of revenues", "Statement of assets, liabilities, and equity", "Cash flow report", "Profit and loss statement"], correct: 1, explanation: "A balance sheet shows assets, liabilities, and shareholders' equity at a point in time.", points: 5 },
        { id: "dq11", question: "What is the full form of GST in India?", options: ["General Sales Tax", "Goods and Services Tax", "Government Service Tax", "Gross Standard Tax"], correct: 1, explanation: "GST stands for Goods and Services Tax, implemented in India on July 1, 2017.", points: 5 },
    ],
    "design": [
        { id: "dq12", question: "What does UX stand for?", options: ["User Experience", "Universal Exchange", "User Extension", "Unified Experience"], correct: 0, explanation: "UX = User Experience â€” how a user interacts with and experiences a product.", points: 5 },
        { id: "dq13", question: "Which tool is most used for UI design?", options: ["Photoshop", "Figma", "MS Paint", "PowerPoint"], correct: 1, explanation: "Figma has become the industry standard for collaborative interface design.", points: 5 },
    ],
};

// â”€â”€â”€ COURSES CATALOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const COURSES = [
    { id: "crs1", title: "DSA Mastery: Arrays to Graphs", category: "technology", difficulty: "Beginner to Advanced", duration: "12 weeks", modules: 24, instructor: "SkillSync AI", rating: 4.8, enrolled: 12500, free: true, description: "Complete data structures and algorithms course with 200+ practice problems. Start from arrays, move through trees, graphs, and dynamic programming.", tags: ["DSA", "Coding", "Interview Prep"], image: "ðŸ—ï¸" },
    { id: "crs2", title: "Full Stack Web Development", category: "technology", difficulty: "Intermediate", duration: "16 weeks", modules: 32, instructor: "SkillSync AI", rating: 4.7, enrolled: 8900, free: true, description: "Build production-ready applications with React, Next.js, Node.js, and databases. Includes 5 real-world projects.", tags: ["React", "Node.js", "MongoDB"], image: "ðŸŒ" },
    { id: "crs3", title: "Machine Learning A-Z", category: "technology", difficulty: "Intermediate", duration: "10 weeks", modules: 20, instructor: "SkillSync AI", rating: 4.9, enrolled: 15600, free: true, description: "From linear regression to deep learning. Hands-on with Python, scikit-learn, TensorFlow.", tags: ["ML", "Python", "AI"], image: "ðŸ¤–" },
    { id: "crs4", title: "System Design for Interviews", category: "technology", difficulty: "Advanced", duration: "8 weeks", modules: 16, instructor: "SkillSync AI", rating: 4.6, enrolled: 6700, free: false, description: "Design scalable systems like Twitter, WhatsApp, and Uber. Essential for senior developer interviews.", tags: ["System Design", "Architecture"], image: "ðŸ›ï¸" },
    { id: "crs5", title: "UI/UX Design Fundamentals", category: "design", difficulty: "Beginner", duration: "8 weeks", modules: 16, instructor: "SkillSync AI", rating: 4.7, enrolled: 5400, free: true, description: "Learn user research, wireframing, prototyping, and visual design with Figma.", tags: ["Figma", "UX", "Design"], image: "ðŸŽ¨" },
    { id: "crs6", title: "Business Communication Mastery", category: "business", difficulty: "Beginner", duration: "4 weeks", modules: 8, instructor: "SkillSync AI", rating: 4.5, enrolled: 9800, free: true, description: "Master email writing, presentations, negotiation, and professional communication for Indian workplaces.", tags: ["Communication", "Soft Skills"], image: "ðŸ—£ï¸" },
    { id: "crs7", title: "Placement Preparation Bootcamp", category: "technology", difficulty: "Intermediate", duration: "6 weeks", modules: 18, instructor: "SkillSync AI", rating: 4.8, enrolled: 22000, free: true, description: "Comprehensive placement prep: aptitude, coding, group discussion, HR interview, and resume building.", tags: ["Placements", "Interview", "AMCAT"], image: "ðŸŽ¯" },
    { id: "crs8", title: "Python for Data Science", category: "technology", difficulty: "Beginner", duration: "6 weeks", modules: 12, instructor: "SkillSync AI", rating: 4.7, enrolled: 18200, free: true, description: "Learn Python from scratch. Pandas, NumPy, Matplotlib, and real datasets. NPTEL certified equivalent.", tags: ["Python", "Data Science"], image: "ðŸ" },
];

// â”€â”€â”€ JOB LISTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const JOB_LISTINGS = [
    { id: "j1", title: "Software Development Engineer", company: "Amazon", location: "Bangalore", type: "Full-time", salary: "â‚¹14-25 LPA", experience: "0-2 years", skills: ["Java", "DSA", "System Design"], posted: "2 hours ago", category: "technology", isHot: true, applicants: 234, deadline: "7 days", url: "#" },
    { id: "j2", title: "Frontend Developer Intern", company: "Razorpay", location: "Bangalore (Remote)", type: "Internship", salary: "â‚¹40K/month", experience: "0-1 years", skills: ["React", "TypeScript", "CSS"], posted: "5 hours ago", category: "technology", isHot: true, applicants: 156, deadline: "14 days", url: "#" },
    { id: "j3", title: "Data Analyst", company: "Flipkart", location: "Bangalore", type: "Full-time", salary: "â‚¹8-15 LPA", experience: "0-3 years", skills: ["SQL", "Python", "Excel", "Tableau"], posted: "1 day ago", category: "technology", isHot: false, applicants: 312, deadline: "10 days", url: "#" },
    { id: "j4", title: "ML Engineer Intern", company: "Google", location: "Hyderabad", type: "Internship", salary: "â‚¹1.2L/month", experience: "0 years", skills: ["Python", "TensorFlow", "ML"], posted: "3 hours ago", category: "technology", isHot: true, applicants: 520, deadline: "5 days", url: "#" },
    { id: "j5", title: "Product Manager Associate", company: "CRED", location: "Bangalore", type: "Full-time", salary: "â‚¹18-30 LPA", experience: "1-3 years", skills: ["Product Strategy", "Analytics", "SQL"], posted: "1 day ago", category: "business", isHot: false, applicants: 89, deadline: "21 days", url: "#" },
    { id: "j6", title: "UX Design Intern", company: "Swiggy", location: "Remote", type: "Internship", salary: "â‚¹25K/month", experience: "0 years", skills: ["Figma", "User Research", "Prototyping"], posted: "6 hours ago", category: "design", isHot: true, applicants: 167, deadline: "10 days", url: "#" },
    { id: "j7", title: "Cybersecurity Analyst", company: "Deloitte", location: "Mumbai", type: "Full-time", salary: "â‚¹8-16 LPA", experience: "0-2 years", skills: ["SIEM", "Python", "Network Security"], posted: "2 days ago", category: "technology", isHot: false, applicants: 78, deadline: "15 days", url: "#" },
    { id: "j8", title: "Backend Developer", company: "PhonePe", location: "Pune", type: "Full-time", salary: "â‚¹12-22 LPA", experience: "1-3 years", skills: ["Java", "Spring Boot", "Microservices"], posted: "4 hours ago", category: "technology", isHot: true, applicants: 198, deadline: "7 days", url: "#" },
    { id: "j9", title: "Business Analyst Intern", company: "McKinsey", location: "Delhi (Hybrid)", type: "Internship", salary: "â‚¹80K/month", experience: "0 years", skills: ["Excel", "PowerPoint", "Analytics"], posted: "1 day ago", category: "business", isHot: true, applicants: 445, deadline: "3 days", url: "#" },
    { id: "j10", title: "DevOps Engineer", company: "Zomato", location: "Gurugram", type: "Full-time", salary: "â‚¹10-20 LPA", experience: "1-3 years", skills: ["Docker", "Kubernetes", "AWS", "CI/CD"], posted: "8 hours ago", category: "technology", isHot: false, applicants: 112, deadline: "12 days", url: "#" },
];

// â”€â”€â”€ PERSISTENT STORE (survives server restarts) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import * as fs from "fs";
import * as path from "path";

interface User {
    id: string; email: string; name: string; passwordHash: string;
    role: "student" | "admin" | "mentor";
    age?: number; education_level?: string; city?: string; institution?: string;
    isPremium?: boolean; premiumExpiry?: string; streak?: number; lastActive?: string;
    points?: number; careerChoice?: string;
}
interface Assessment { id: string; userId: string; answers: Record<string, number>; results: Record<string, unknown>; }
interface ChatSession { id: string; userId: string; messages: { role: string; content: string; timestamp: string }[]; }
interface CommunityPost { id: string; userId: string; userName: string; title: string; content: string; category: string; tags: string[]; likes: number; comments: { userId: string; userName: string; content: string; timestamp: string }[]; timestamp: string; }

export interface Opening {
    id: string;
    title: string;
    company: string;
    location: string;
    type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance";
    salary: string;
    experience: string;
    skills: string[];
    description: string;
    applyUrl: string;
    category: "technology" | "business" | "design" | "finance" | "marketing" | "healthcare" | "engineering";
    isActive: boolean;
    isUrgent: boolean;
    postedBy: string;
    postedAt: string;
    deadline: string;
    applicants: number;
}

// Persistence helper â€” saves data to JSON files so state survives server restarts
const DATA_DIR = path.join(process.cwd(), ".skillsync-data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const OPENINGS_FILE = path.join(DATA_DIR, "openings.json");

function ensureDataDir() {
    try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch { /* ignore */ }
}

function loadUsersFromDisk(): Map<string, User> {
    const map = new Map<string, User>();
    try {
        ensureDataDir();
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, "utf-8");
            const arr: User[] = JSON.parse(raw);
            for (const u of arr) map.set(u.id, u);
        }
    } catch (e) { console.error("Failed to load users from disk:", e); }
    return map;
}

function saveUsersToDisk(users: Map<string, User>) {
    try {
        ensureDataDir();
        fs.writeFileSync(USERS_FILE, JSON.stringify(Array.from(users.values()), null, 2), "utf-8");
    } catch (e) { console.error("Failed to save users to disk:", e); }
}

function loadOpeningsFromDisk(): Opening[] {
    try {
        ensureDataDir();
        if (fs.existsSync(OPENINGS_FILE)) {
            const raw = fs.readFileSync(OPENINGS_FILE, "utf-8");
            return JSON.parse(raw);
        }
    } catch (e) { console.error("Failed to load openings from disk:", e); }
    return [];
}

function saveOpeningsToDisk(openings: Opening[]) {
    try {
        ensureDataDir();
        fs.writeFileSync(OPENINGS_FILE, JSON.stringify(openings, null, 2), "utf-8");
    } catch (e) { console.error("Failed to save openings to disk:", e); }
}

// Default seed openings
const SEED_OPENINGS: Opening[] = [
    { id: "op1", title: "AI/ML Engineer", company: "Google India", location: "Bangalore", type: "Full-time", salary: "â‚¹25-45 LPA", experience: "1-3 years", skills: ["Python", "TensorFlow", "PyTorch", "NLP"], description: "Join Google's AI team to build next-generation ML products. Work on large-scale systems serving billions of users. Strong background in deep learning and production ML required.", applyUrl: "https://careers.google.com", category: "technology", isActive: true, isUrgent: true, postedBy: "admin", postedAt: "2026-02-18T10:00:00Z", deadline: "2026-03-15", applicants: 342 },
    { id: "op2", title: "Full Stack Developer Intern", company: "Razorpay", location: "Bangalore (Remote)", type: "Internship", salary: "â‚¹50K/month + PPO", experience: "0 years (Students)", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], description: "6-month internship with Pre-Placement Offer opportunity. Build payment infrastructure used by 8M+ businesses. Fast-paced startup culture with real ownership from day 1.", applyUrl: "https://razorpay.com/careers", category: "technology", isActive: true, isUrgent: true, postedBy: "admin", postedAt: "2026-02-17T14:00:00Z", deadline: "2026-03-01", applicants: 567 },
    { id: "op3", title: "Product Design Lead", company: "CRED", location: "Bangalore", type: "Full-time", salary: "â‚¹22-38 LPA", experience: "3-5 years", skills: ["Figma", "Design Systems", "User Research", "Prototyping"], description: "Lead the design of CRED's consumer-facing products. Shape the experience for 25M+ premium users. Looking for someone who obsesses over craft and detail.", applyUrl: "https://cred.club/careers", category: "design", isActive: true, isUrgent: false, postedBy: "admin", postedAt: "2026-02-16T09:00:00Z", deadline: "2026-03-20", applicants: 89 },
    { id: "op4", title: "Data Analyst - Growth", company: "Swiggy", location: "Bangalore / Remote", type: "Full-time", salary: "â‚¹10-18 LPA", experience: "0-2 years", skills: ["SQL", "Python", "Tableau", "A/B Testing"], description: "Analyze growth metrics for India's leading food delivery platform. Work with product and marketing teams to drive user engagement and retention strategies.", applyUrl: "https://swiggy.com/careers", category: "technology", isActive: true, isUrgent: false, postedBy: "admin", postedAt: "2026-02-15T11:00:00Z", deadline: "2026-03-10", applicants: 234 },
    { id: "op5", title: "DevOps Engineer", company: "PhonePe", location: "Pune / Bangalore", type: "Full-time", salary: "â‚¹15-28 LPA", experience: "2-4 years", skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"], description: "Scale infrastructure for India's #1 UPI app processing 5B+ monthly transactions. High-impact role with exposure to massive distributed systems.", applyUrl: "https://phonepe.com/careers", category: "technology", isActive: true, isUrgent: true, postedBy: "admin", postedAt: "2026-02-18T08:00:00Z", deadline: "2026-03-05", applicants: 156 },
    { id: "op6", title: "Business Analyst Intern", company: "McKinsey & Company", location: "Delhi / Mumbai (Hybrid)", type: "Internship", salary: "â‚¹1L/month", experience: "0 years (MBA/Final Year)", skills: ["Excel", "PowerPoint", "Problem Solving", "Data Analysis"], description: "10-week summer internship at one of the world's top consulting firms. Work on real client engagements across industries. Strong analytical and communication skills required.", applyUrl: "https://mckinsey.com/careers", category: "business", isActive: true, isUrgent: true, postedBy: "admin", postedAt: "2026-02-17T16:00:00Z", deadline: "2026-02-28", applicants: 890 },
    { id: "op7", title: "Cybersecurity Analyst", company: "Deloitte India", location: "Hyderabad / Mumbai", type: "Full-time", salary: "â‚¹8-16 LPA", experience: "0-2 years", skills: ["SIEM", "SOC", "Python", "Network Security", "VAPT"], description: "Join Deloitte's Cyber Risk team. Conduct vulnerability assessments, manage SOC operations, and help enterprises secure their digital infrastructure.", applyUrl: "https://deloitte.com/careers", category: "technology", isActive: true, isUrgent: false, postedBy: "admin", postedAt: "2026-02-14T10:00:00Z", deadline: "2026-03-25", applicants: 112 },
    { id: "op8", title: "Digital Marketing Manager", company: "Zerodha", location: "Bangalore (Remote-first)", type: "Full-time", salary: "â‚¹12-22 LPA", experience: "2-4 years", skills: ["SEO", "Content Strategy", "Google Analytics", "Social Media"], description: "Lead digital marketing for India's largest stock broker. Drive user acquisition and engagement through content, SEO, and performance marketing.", applyUrl: "https://zerodha.com/careers", category: "marketing", isActive: true, isUrgent: false, postedBy: "admin", postedAt: "2026-02-13T12:00:00Z", deadline: "2026-03-15", applicants: 67 },
];

class Store {
    users: Map<string, User>;
    openings: Opening[];
    assessments: Map<string, Assessment[]> = new Map();
    chatSessions: Map<string, ChatSession> = new Map();
    communityPosts: CommunityPost[] = [
        { id: "p1", userId: "seed1", userName: "Priya S.", title: "How I got into Google as a fresher from a Tier-3 college", content: "I want to share my journey of cracking Google's interview. I started with zero DSA knowledge in 3rd year. Here's my exact preparation strategy...\n\n1. Spent 3 months on Striver's A2Z DSA Sheet\n2. Built 2 full-stack projects\n3. Did 50+ mock interviews on Pramp\n4. Got referral through LinkedIn networking\n\nTotal prep time: 8 months. Don't let your college name hold you back!", category: "success-stories", tags: ["google", "placement", "tier-3"], likes: 347, comments: [{ userId: "seed2", userName: "Rahul K.", content: "This is so inspiring! Which optional subject did you focus on?", timestamp: "2026-02-15T10:30:00Z" }], timestamp: "2026-02-14T08:00:00Z" },
        { id: "p2", userId: "seed2", userName: "Rahul K.", title: "Best free resources for ML in 2026", content: "After trying 20+ courses, here are my top picks for learning ML for free in India:\n\nðŸ¥‡ Andrew Ng's ML Specialization (Coursera audit)\nðŸ¥ˆ NPTEL ML by IIT Madras\nðŸ¥‰ Fast.ai Practical Deep Learning\n\nHonorable mentions: Kaggle Learn, Google's ML Crash Course, 3Blue1Brown for math intuition.\n\nAvoid paid bootcamps unless they have placement guarantees.", category: "resources", tags: ["ml", "free-resources", "learning"], likes: 215, comments: [], timestamp: "2026-02-13T14:00:00Z" },
        { id: "p3", userId: "seed3", userName: "Ananya M.", title: "Parents want me to do MBA, I want to be a designer - advice?", content: "I'm in my final year of B.Com and I've been doing freelance graphic design for 2 years. My parents are insisting on CAT prep for MBA. I genuinely enjoy design and have a portfolio of 15+ projects.\n\nHow do I convince them? Has anyone faced a similar situation?", category: "career-dilemma", tags: ["parents", "design", "mba", "career-choice"], likes: 189, comments: [{ userId: "seed1", userName: "Priya S.", content: "Show them the salary data! UX designers at good companies earn 12-25 LPA. Also, check SkillSync's Parent Toolkit feature.", timestamp: "2026-02-12T16:00:00Z" }], timestamp: "2026-02-12T12:00:00Z" },
    ];
    quizHistory: Map<string, { date: string; score: number; total: number }[]> = new Map();

    constructor() {
        // Load persisted users on startup
        this.users = loadUsersFromDisk();
        console.log(`[SkillSync Store] Loaded ${this.users.size} users from disk`);

        // Seed admin account if not exists (password: admin123)
        if (!this.getUserByEmail("admin@skillsync.ai")) {
            const { hashSync } = require("bcryptjs");
            this.users.set("admin-001", {
                id: "admin-001", email: "admin@skillsync.ai", name: "SkillSync Admin",
                passwordHash: hashSync("admin123", 10), role: "admin", points: 0
            });
            saveUsersToDisk(this.users);
            console.log("[SkillSync Store] Seeded admin account: admin@skillsync.ai / admin123");
        }

        // Load or seed openings
        const diskOpenings = loadOpeningsFromDisk();
        if (diskOpenings.length > 0) {
            this.openings = diskOpenings;
        } else {
            this.openings = [...SEED_OPENINGS];
            saveOpeningsToDisk(this.openings);
        }
        console.log(`[SkillSync Store] Loaded ${this.openings.length} openings`);
    }

    // â”€â”€â”€ User methods â”€â”€â”€
    addUser(user: User) {
        if (!user.role) user.role = "student";
        this.users.set(user.id, user);
        saveUsersToDisk(this.users);
    }
    getUserByEmail(email: string) { return Array.from(this.users.values()).find(u => u.email === email); }
    getUserById(id: string) { return this.users.get(id); }
    getAllUsers() { return Array.from(this.users.values()); }
    updateUserRole(userId: string, role: "student" | "admin" | "mentor") {
        const user = this.users.get(userId);
        if (user) { user.role = role; this.users.set(userId, user); saveUsersToDisk(this.users); }
        return user;
    }

    // â”€â”€â”€ Assessment methods â”€â”€â”€
    addAssessment(userId: string, assessment: Assessment) {
        const list = this.assessments.get(userId) || [];
        list.push(assessment);
        this.assessments.set(userId, list);
    }
    getLatestAssessment(userId: string) {
        const list = this.assessments.get(userId) || [];
        return list[list.length - 1] || null;
    }

    // â”€â”€â”€ Chat methods â”€â”€â”€
    getOrCreateChat(sessionId: string, userId: string): ChatSession {
        let session = this.chatSessions.get(sessionId);
        if (!session) {
            session = { id: sessionId, userId, messages: [] };
            this.chatSessions.set(sessionId, session);
        }
        return session;
    }

    // â”€â”€â”€ Community methods â”€â”€â”€
    addCommunityPost(post: CommunityPost) { this.communityPosts.unshift(post); }
    getCommunityPosts(category?: string) { return category ? this.communityPosts.filter(p => p.category === category) : this.communityPosts; }
    likePost(postId: string) { const p = this.communityPosts.find(p => p.id === postId); if (p) p.likes++; return p; }
    addComment(postId: string, comment: { userId: string; userName: string; content: string; timestamp: string }) {
        const p = this.communityPosts.find(p => p.id === postId);
        if (p) p.comments.push(comment);
        return p;
    }

    // â”€â”€â”€ Points / Leaderboard â”€â”€â”€
    addPoints(userId: string, points: number) {
        const user = this.users.get(userId);
        if (user) { user.points = (user.points || 0) + points; this.users.set(userId, user); saveUsersToDisk(this.users); }
    }
    getLeaderboard() {
        return Array.from(this.users.values())
            .filter(u => u.role !== "admin")
            .map(u => ({ name: u.name, points: u.points || 0, streak: u.streak || 0 }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 20);
    }

    // â”€â”€â”€ Openings CRUD â”€â”€â”€
    getOpenings(activeOnly = true) {
        return activeOnly ? this.openings.filter(o => o.isActive) : this.openings;
    }
    getOpeningById(id: string) { return this.openings.find(o => o.id === id); }
    addOpening(opening: Opening) {
        this.openings.unshift(opening);
        saveOpeningsToDisk(this.openings);
    }
    updateOpening(id: string, data: Partial<Opening>) {
        const idx = this.openings.findIndex(o => o.id === id);
        if (idx !== -1) {
            this.openings[idx] = { ...this.openings[idx], ...data };
            saveOpeningsToDisk(this.openings);
            return this.openings[idx];
        }
        return null;
    }
    deleteOpening(id: string) {
        this.openings = this.openings.filter(o => o.id !== id);
        saveOpeningsToDisk(this.openings);
    }
    applyToOpening(id: string) {
        const opening = this.openings.find(o => o.id === id);
        if (opening) { opening.applicants = (opening.applicants || 0) + 1; saveOpeningsToDisk(this.openings); }
        return opening;
    }
}

// Use globalThis to ensure the Store singleton survives Next.js HMR reloads
// Without this, each hot reload creates a new Store instance and users are lost
const globalForStore = globalThis as unknown as { __skillsync_store?: Store };

if (!globalForStore.__skillsync_store) {
    globalForStore.__skillsync_store = new Store();
}

export const store = globalForStore.__skillsync_store;
