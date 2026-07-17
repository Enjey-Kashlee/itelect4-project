import type { User, Course, Submission, ApiResponse } from "./types/index";

// ===== PRIMITIVE TYPE ANNOTATIONS =====
// Variables with explicit types
const projectName: string = "itelect4-project";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const notSet: undefined = undefined;
// Function: typed parameters + typed return value
function greet(name: string, year: number): string {
    return `Welcome to ${name} -- AY ${year}!`;
}
// void: function that does NOT return a value
function logMessage(message: string): void {
    console.log(message);
}
logMessage(greet(projectName, currentYear));

// ===== SPECIAL TYPES =====
// any -- disables TypeScript type checking
// [!] Avoid using this; it defeats the purpose of TypeScript
let anything: any = "hello";
anything = 42; // No error
anything = true; // No error
// unknown -- the safer version of any
// You MUST check the type before using it
let userInput: unknown = "test";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase()); // OK -- TypeScript knows it's a string here
}
// never -- a function that NEVER returns
// Used when a function always throws an error or loops forever
function throwError(message: string): never {
    throw new Error(message);
}

// ===== USING INTERFACES =====
const student: User = {
    id: 1,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
};
const course: Course = {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st Semester 2026-2027",
};
console.log(student);
console.log(course);

// ===== TYPE NARROWING =====
import type { StringOrNumber } from "./types/index";
// Narrowing with typeof
// Without the if-check, TypeScript would error:
// Property 'toUpperCase' does not exist on type 'number'
function processInput(input: StringOrNumber): string {
    if (typeof input === "string") {
        return input.toUpperCase(); // TypeScript knows: input is string here
    }
    return input.toFixed(2); // TypeScript knows: input is number here
}
// Narrowing with instanceof
// Used with class instances like Date, Error, etc.
function formatDate(value: string | Date): string {
    if (value instanceof Date) {
        return value.toLocaleDateString(); // TypeScript knows: it's a Date
    }
    return value; // TypeScript knows: it's a string
}
console.log(processInput("hello")); // HELLO
console.log(processInput(3.14159)); // 3.14
console.log(formatDate(new Date())); // e.g. 7/4/2026

// ===== GENERIC FUNCTIONS =====
// T is inferred automatically from whatever array you pass in
function getFirst<T>(items: T[]): T | undefined {
    return items[0];
}
// Constrained generic -- T must have an "id: number" field
function getById<T extends { id: number }>(
    items: T[],
    id: number
): T | undefined {
    return items.find((item) => item.id === id);
}
// [student] is an array containing one element
const firstUser = getFirst<User>([student]);
const foundUser = getById<User>([student], 1);
// Each ?. checks whether the object on its left exists before trying to access the next property, preventing errors if any part of the chain is null or undefined.
    console.log(firstUser?.name); // Juan dela Cruz
console.log(foundUser?.email); // juan@example.com

const userResponse: ApiResponse<User> = {
    success: true,
    data: student,
};
const courseResponse: ApiResponse<Course[]> = {
    success: true,
    data: [course],
};
console.log(userResponse.data.name); // Juan dela Cruz