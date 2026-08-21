import type { Claim, Item, User } from "../types/index";

export const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

export const mockItems: Item[] = [
  {
    id: 101,
    title: "Blue Water Bottle",
    description: "Hydro Flask with a DLSL sticker",
    status: "lost",
    location: "Library, 2nd floor",
    reportedById: student.id,
  },
  {
    id: 102,
    title: "Black Umbrella",
    description: "Folding umbrella, slightly bent handle",
    status: "found",
    location: "Cafeteria",
    reportedById: student.id,
  },
  {
    id: 103,
    title: "Student ID Card",
    description: "DLSL ID, name partly worn off",
    status: "lost",
    location: "Gymnasium entrance",
    reportedById: student.id,
  },
  {
    id: 104,
    title: "Grey Backpack",
    description: "Jansport backpack with a laptop inside",
    status: "found",
    location: "Parking Lot B",
    reportedById: student.id,
  },
  {
    id: 105,
    title: "Wired Earphones",
    description: "White earphones, tangled in a small pouch",
    status: "lost",
    location: "Room CB204",
    reportedById: student.id,
  },
];

export const mockClaims: Claim[] = [
  {
    id: 1,
    itemId: 101,
    claimantId: student.id,
    claimedAt: new Date("2026-08-05T10:15:00"),
    verified: false,
  },
  {
    id: 2,
    itemId: 103,
    claimantId: student.id,
    claimedAt: new Date("2026-08-06T14:30:00"),
    verified: true,
  },
  {
    id: 3,
    itemId: 105,
    claimantId: student.id,
    claimedAt: new Date("2026-08-07T09:00:00"),
    verified: false,
  },
];
