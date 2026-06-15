// TypeScript interfaces for User Administration
export type UserRole =
  | "Data Department Staff"
  | "Tech Department Staff"
  | "Technical Lead"
  | "System Administrator";

export type UserStatus = "Active" | "Pending" | "Disabled";

export type ActivityAction =
  | "Account Created"
  | "Role Changed"
  | "Account Disabled"
  | "Account Enabled"
  | "Password Reset";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  department: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  department?: string;
  role?: UserRole;
}

// All departments
export const DEPARTMENTS = [
  "Bursa Operations",
  "Risk & Compliance",
  "Platform Engineering",
  "IT Governance",
  "Data Analytics",
  "Quality Assurance",
] as const;

export const ROLES: UserRole[] = [
  "Data Department Staff",
  "Tech Department Staff",
  "Technical Lead",
  "System Administrator",
];

// ── Mock Data ────────────────────────────────────────────────────────────────

let users: User[] = [
  {
    id: "1",
    name: "Aisha Rahman",
    email: "aisha.rahman@et.com",
    department: "Bursa Operations",
    role: "Data Department Staff",
    status: "Active",
    createdAt: "2025-02-14",
    lastLogin: "2026-06-14",
  },
  {
    id: "2",
    name: "Wei Lin Tan",
    email: "weilin.tan@et.com",
    department: "Risk & Compliance",
    role: "Tech Department Staff",
    status: "Active",
    createdAt: "2025-04-02",
    lastLogin: "2026-06-15",
  },
  {
    id: "3",
    name: "Marcus Lee",
    email: "marcus.lee@et.com",
    department: "Platform Engineering",
    role: "Technical Lead",
    status: "Pending",
    createdAt: "2026-06-10",
  },
  {
    id: "4",
    name: "Priya Nair",
    email: "priya.nair@et.com",
    department: "Bursa Operations",
    role: "Data Department Staff",
    status: "Disabled",
    createdAt: "2024-11-21",
  },
  {
    id: "5",
    name: "Daniel Wong",
    email: "daniel.wong@et.com",
    department: "IT Governance",
    role: "System Administrator",
    status: "Active",
    createdAt: "2023-08-09",
    lastLogin: "2026-06-15",
  },
  {
    id: "6",
    name: "Suresh Kumar",
    email: "suresh.kumar@et.com",
    department: "Bursa Operations",
    role: "Data Department Staff",
    status: "Active",
    createdAt: "2025-09-18",
    lastLogin: "2026-06-10",
  },
  {
    id: "7",
    name: "Mei Ling Chong",
    email: "meiling.chong@et.com",
    department: "Risk & Compliance",
    role: "Tech Department Staff",
    status: "Pending",
    createdAt: "2026-05-30",
  },
  {
    id: "8",
    name: "Arif Hassan",
    email: "arif.hassan@et.com",
    department: "Bursa Operations",
    role: "Data Department Staff",
    status: "Active",
    createdAt: "2025-12-01",
    lastLogin: "2026-06-12",
  },
  {
    id: "9",
    name: "Nurul Izzah",
    email: "nurul.izzah@et.com",
    department: "Risk & Compliance",
    role: "Tech Department Staff",
    status: "Active",
    createdAt: "2024-07-15",
    lastLogin: "2026-06-13",
  },
  {
    id: "10",
    name: "James Lim",
    email: "james.lim@et.com",
    department: "Platform Engineering",
    role: "Technical Lead",
    status: "Disabled",
    createdAt: "2024-03-22",
  },
  {
    id: "11",
    name: "Farah Diana",
    email: "farah.diana@et.com",
    department: "Data Analytics",
    role: "Data Department Staff",
    status: "Pending",
    createdAt: "2026-06-12",
  },
  {
    id: "12",
    name: "Kevin Tan",
    email: "kevin.tan@et.com",
    department: "IT Governance",
    role: "System Administrator",
    status: "Active",
    createdAt: "2023-05-04",
    lastLogin: "2026-06-14",
  },
];

let activities: ActivityLog[] = [
  { id: "a1", userId: "1", userName: "Aisha Rahman", action: "Account Created", performedBy: "System Admin", timestamp: "2025-02-14T09:00:00Z" },
  { id: "a2", userId: "2", userName: "Wei Lin Tan", action: "Account Created", performedBy: "System Admin", timestamp: "2025-04-02T10:30:00Z" },
  { id: "a3", userId: "5", userName: "Daniel Wong", action: "Role Changed", performedBy: "System Admin", timestamp: "2025-01-15T14:00:00Z", details: "Promoted to System Administrator" },
  { id: "a4", userId: "4", userName: "Priya Nair", action: "Account Disabled", performedBy: "System Admin", timestamp: "2026-03-10T11:00:00Z" },
  { id: "a5", userId: "10", userName: "James Lim", action: "Account Disabled", performedBy: "System Admin", timestamp: "2026-04-20T08:45:00Z" },
  { id: "a6", userId: "3", userName: "Marcus Lee", action: "Account Created", performedBy: "System Admin", timestamp: "2026-06-10T16:20:00Z" },
  { id: "a7", userId: "12", userName: "Kevin Tan", action: "Password Reset", performedBy: "Kevin Tan", timestamp: "2026-06-01T09:15:00Z" },
  { id: "a8", userId: "9", userName: "Nurul Izzah", action: "Role Changed", performedBy: "System Admin", timestamp: "2025-09-01T13:00:00Z", details: "Changed from Data Department Staff to Tech Department Staff" },
  { id: "a9", userId: "6", userName: "Suresh Kumar", action: "Account Created", performedBy: "System Admin", timestamp: "2025-09-18T08:00:00Z" },
  { id: "a10", userId: "2", userName: "Wei Lin Tan", action: "Password Reset", performedBy: "Wei Lin Tan", timestamp: "2026-05-20T10:00:00Z" },
  { id: "a11", userId: "7", userName: "Mei Ling Chong", action: "Account Created", performedBy: "System Admin", timestamp: "2026-05-30T15:00:00Z" },
  { id: "a12", userId: "8", userName: "Arif Hassan", action: "Password Reset", performedBy: "System Admin", timestamp: "2026-04-05T12:30:00Z" },
];

let nextUserId = 13;
let nextActivityId = 13;

// Simulate async delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function addActivity(userId: string, userName: string, action: ActivityAction, performedBy: string, details?: string) {
  activities.unshift({
    id: `a${nextActivityId++}`,
    userId,
    userName,
    action,
    performedBy,
    timestamp: new Date().toISOString(),
    details,
  });
}

// ── Service ──────────────────────────────────────────────────────────────────

export const userService = {
  async list() {
    await delay();
    return [...users];
  },

  async getById(id: string) {
    await delay();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    return { ...user };
  },

  async create(input: CreateUserInput, performedBy = "System Admin") {
    await delay();
    const newUser: User = {
      id: String(nextUserId++),
      ...input,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    users.push(newUser);
    addActivity(newUser.id, newUser.name, "Account Created", performedBy);
    return { ...newUser };
  },

  async update(id: string, input: UpdateUserInput, performedBy = "System Admin") {
    await delay();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    const prevRole = users[idx].role;
    users[idx] = { ...users[idx], ...input };
    if (input.role && input.role !== prevRole) {
      addActivity(id, users[idx].name, "Role Changed", performedBy, `Changed from ${prevRole} to ${input.role}`);
    }
    return { ...users[idx] };
  },

  async setStatus(id: string, status: UserStatus, performedBy = "System Admin") {
    await delay();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    users[idx] = { ...users[idx], status };
    const action: ActivityAction = status === "Disabled" ? "Account Disabled" : "Account Enabled";
    addActivity(id, users[idx].name, action, performedBy);
    return { ...users[idx] };
  },

  async resetPassword(id: string, performedBy: string) {
    await delay();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    addActivity(id, user.name, "Password Reset", performedBy);
    return { success: true };
  },

  async getActivities() {
    await delay();
    return [...activities];
  },

  async getActivitiesForUser(userId: string) {
    await delay();
    return activities.filter((a) => a.userId === userId);
  },
};