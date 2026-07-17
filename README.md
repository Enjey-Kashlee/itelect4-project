# itelect4-project — Campus Lost & Found Tracker

A TypeScript project for a **Campus Lost & Found Tracker**. Students and security admins report items that have been lost or found around campus; when a user recognizes an item as theirs, they file a claim on it, and a security admin verifies the claim before the item is handed over. This repo models that domain with TypeScript interfaces, type aliases, unions, generics, utility types, and enums.

## Interfaces / Types defined so far

### Core interfaces
- **`User`** — a person on the platform (`role: "student" | "security_admin"`).
- **`Item`** — a lost/found post (`status: "lost" | "found"`, plus `location` and who reported it).
- **`Claim`** — filed when a user claims an item; a security admin verifies it (`verified?`).

### Type aliases & unions
- **`ID`** — `number | string`.
- **`Coordinate`** — an `{ x, y }` object shape (e.g. a pin on the campus map).
- **`Formatter`** — a function signature `(value: number) => string`.
- **`StringOrNumber`** — union of `string | number`.
- **`Status`** — literal union `"pending" | "active" | "inactive"`.

### Intersection type
- **`UserWithItem`** — `User` combined with a `reportedItem` and a `reportCount`.

### Generic interface
- **`ApiResponse<T>`** — a reusable API envelope (`success`, `data: T`, optional `message`).

### Utility types (derived from `User`)
- **`UserUpdate`** — `Partial<User>` (all fields optional, for update payloads).
- **`UserPreview`** — `Pick<User, "id" | "name" | "role">`.
- **`PublicUser`** — `Omit<User, "email" | "isActive">` (safe to expose publicly).
- **`RoleCount`** — `Record<"student" | "security_admin", number>` (dashboard counts).

### Enums
- **`ClaimStatus`** — `Pending | Approved | Rejected` (claim verification lifecycle).
- **`Role`** — const enum: `Student = "student"`, `SecurityAdmin = "security_admin"`.

## Install & run

```bash
# 1. Install dependencies
npm install

# 2. Run the entry point
npx ts-node src/index.ts
```

To type-check without running:

```bash
npx tsc --noEmit
```

## Project structure

```
src/
  index.ts        # Entry point — demonstrates every type in use
  sample.ts       # GT1 Part 1 exercise (JS -> TS conversion)
  types/
    index.ts      # All interfaces, aliases, unions, generics, utility types, enums
tsconfig.json     # Compiler options (strict mode enabled)
```
