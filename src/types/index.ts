// ===== INTERFACES =====
// An interface defines the SHAPE of an object -- what fields it must have.
export interface User {
  id: number | string;
  name: string;
  email: string;
  role: "student" | "security_admin"; // only these values
  isActive: boolean;
}
// An Item is a lost/found post reported by a user.
export interface Item {
  id: number;
  title: string;
  description: string;
  status: "lost" | "found";
  location: string;
  reportedById: number | string;
}
// A Claim is filed when a user claims an item; a security admin verifies it.
export interface Claim {
  id: number;
  itemId: number;
  claimantId: number | string;
  claimedAt: Date;
  verified?: boolean; // ? means this field is optional -- set once an admin verifies
}

// ===== TYPE ALIASES =====
// A type alias gives a name to any type -- primitives, unions, functions, objects
// Alias for a union type (string OR number)
export type ID = number | string;
// Alias for an object shape -- e.g. a pin on the campus map where an item was found
export type Coordinate = {
  x: number;
  y: number;
};
// Alias for a function signature
export type Formatter = (value: number) => string;
// Using them
const studentId: ID = "S2026-001";
const position: Coordinate = { x: 10, y: 20 };
const formatScore: Formatter = (value) => `${value}%`;
console.log(studentId); // S2026-001
console.log(formatScore(95.5)); // 95.5%

// ===== UNION TYPES -- One OR the other =====
export type StringOrNumber = string | number;
export type Status = "pending" | "active" | "inactive"; // literal union
// Function that accepts a union type
export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}
printId(101);
printId("S2026-001");

// ===== INTERSECTION TYPES -- combines ALL properties =====
// UserWithItem must have all User fields AND reportedItem AND reportCount
export type UserWithItem = User & {
  reportedItem: Item;
  reportCount: number;
};
const topReporter: UserWithItem = {
  id: 1,
  name: "Maria Santos",
  email: "m@example.com",
  role: "student",
  isActive: true,
  reportedItem: {
    id: 101,
    title: "Blue Water Bottle",
    description: "Hydro Flask with a DLSL sticker",
    status: "lost",
    location: "Library, 2nd floor",
    reportedById: 1,
  },
  reportCount: 5,
};

// ===== GENERIC INTERFACE =====
// ApiResponse<T> can wrap ANY data type -- every future GT reuses this
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
// Partial<T> -- every field becomes optional
export type UserUpdate = Partial<User>;
// Pick<T, K> -- keep ONLY the listed fields
export type UserPreview = Pick<User, "id" | "name" | "role">;
// Omit<T, K> -- keep every field EXCEPT the listed ones
export type PublicUser = Omit<User, "email" | "isActive">;
// Record<K, T> -- a fixed set of keys, each mapped to the same value type
export type RoleCount = Record<"student" | "security_admin", number>;

// ===== ENUMS =====
// Regular enum -- exists at runtime; can be looped over or reverse-mapped
export enum ClaimStatus {
  Pending,
  Approved,
  Rejected,
}
// const enum -- inlined at compile time, zero runtime overhead
export const enum Role {
  Student = "student",
  SecurityAdmin = "security_admin",
}
