// TypeScript interfaces for Security Management
export type ActivityEvent =
  | "Login"
  | "Logout"
  | "Role Change"
  | "Failed Login"
  | "Password Reset"
  | "Account Created"
  | "Account Disabled"
  | "Account Enabled";

export type AlertSeverity = "high" | "medium" | "low";

export interface SecurityActivity {
  id: string;
  user: string;
  role: string;
  activity: ActivityEvent;
  ipAddress: string;
  vpnStatus: boolean;
  timestamp: string;
  details?: string;
}

export interface SecurityAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  user?: string;
  resolved: boolean;
}

export interface AuditEntry {
  id: string;
  user: string;
  event: string;
  timestamp: string;
  details: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

let activities: SecurityActivity[] = [
  { id: "s1", user: "Daniel Wong", role: "System Administrator", activity: "Login", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-15 08:30:00" },
  { id: "s2", user: "Wei Lin Tan", role: "Tech Department Staff", activity: "Login", ipAddress: "10.0.0.45", vpnStatus: true, timestamp: "2026-06-15 08:25:00" },
  { id: "s3", user: "Aisha Rahman", role: "Data Department Staff", activity: "Login", ipAddress: "203.0.113.50", vpnStatus: false, timestamp: "2026-06-15 08:20:00" },
  { id: "s4", user: "Kevin Tan", role: "System Administrator", activity: "Login", ipAddress: "192.168.1.102", vpnStatus: true, timestamp: "2026-06-15 08:15:00" },
  { id: "s5", user: "Marcus Lee", role: "Technical Lead", activity: "Role Change", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-14 16:00:00", details: "Promoted from Tech Department Staff to Technical Lead" },
  { id: "s6", user: "Unknown", role: "—", activity: "Failed Login", ipAddress: "45.33.32.156", vpnStatus: false, timestamp: "2026-06-14 15:45:00", details: "3 failed attempts for 'james.lim@et.com'" },
  { id: "s7", user: "Nurul Izzah", role: "Tech Department Staff", activity: "Logout", ipAddress: "10.0.0.78", vpnStatus: true, timestamp: "2026-06-14 15:30:00" },
  { id: "s8", user: "Arif Hassan", role: "Data Department Staff", activity: "Login", ipAddress: "10.0.0.92", vpnStatus: true, timestamp: "2026-06-14 14:00:00" },
  { id: "s9", user: "Priya Nair", role: "Data Department Staff", activity: "Account Disabled", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-14 13:30:00", details: "Account disabled by System Admin" },
  { id: "s10", user: "Unknown", role: "—", activity: "Failed Login", ipAddress: "185.220.101.42", vpnStatus: false, timestamp: "2026-06-14 12:00:00", details: "Brute force attempt detected - 15 failed attempts" },
  { id: "s11", user: "Suresh Kumar", role: "Data Department Staff", activity: "Login", ipAddress: "10.0.0.34", vpnStatus: true, timestamp: "2026-06-14 09:00:00" },
  { id: "s12", user: "Wei Lin Tan", role: "Tech Department Staff", activity: "Logout", ipAddress: "10.0.0.45", vpnStatus: true, timestamp: "2026-06-14 08:45:00" },
  { id: "s13", user: "Mei Ling Chong", role: "Tech Department Staff", activity: "Password Reset", ipAddress: "10.0.0.67", vpnStatus: true, timestamp: "2026-06-13 14:20:00", details: "Password reset by System Admin" },
  { id: "s14", user: "Unknown", role: "—", activity: "Failed Login", ipAddress: "198.51.100.23", vpnStatus: false, timestamp: "2026-06-13 10:30:00", details: "2 failed attempts for 'farah.diana@et.com'" },
  { id: "s15", user: "Daniel Wong", role: "System Administrator", activity: "Logout", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-13 09:00:00" },
  { id: "s16", user: "James Lim", role: "Technical Lead", activity: "Account Enabled", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-12 11:00:00", details: "Account re-enabled by System Admin" },
  { id: "s17", user: "Farah Diana", role: "Data Department Staff", activity: "Login", ipAddress: "10.0.0.15", vpnStatus: true, timestamp: "2026-06-12 09:15:00" },
  { id: "s18", user: "Aisha Rahman", role: "Data Department Staff", activity: "Logout", ipAddress: "203.0.113.50", vpnStatus: false, timestamp: "2026-06-12 08:30:00" },
  { id: "s19", user: "Daniel Wong", role: "System Administrator", activity: "Role Change", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2026-06-11 15:00:00", details: "Changed Nurul Izzah's role to Tech Department Staff" },
  { id: "s20", user: "Kevin Tan", role: "System Administrator", activity: "Login", ipAddress: "192.168.1.102", vpnStatus: true, timestamp: "2026-06-11 08:00:00" },
  { id: "s21", user: "Unknown", role: "—", activity: "Failed Login", ipAddress: "203.0.113.200", vpnStatus: false, timestamp: "2026-06-10 22:15:00", details: "10 failed attempts for 'admin@et.com' - possible brute force" },
  { id: "s22", user: "Nurul Izzah", role: "Tech Department Staff", activity: "Login", ipAddress: "10.0.0.78", vpnStatus: true, timestamp: "2026-06-10 09:00:00" },
  { id: "s23", user: "Priya Nair", role: "Data Department Staff", activity: "Account Created", ipAddress: "192.168.1.100", vpnStatus: true, timestamp: "2024-11-21 10:00:00", details: "Account created by System Admin" },
  { id: "s24", user: "Arif Hassan", role: "Data Department Staff", activity: "Logout", ipAddress: "10.0.0.92", vpnStatus: true, timestamp: "2026-06-14 17:00:00" },
];

let alerts: SecurityAlert[] = [
  { id: "al1", type: "Excessive Failed Logins", severity: "high", message: "15 failed login attempts from IP 185.220.101.42 targeting admin account", timestamp: "2026-06-14 12:05:00", resolved: false },
  { id: "al2", type: "Unauthorized Access Attempt", severity: "high", message: "Brute force pattern detected - 10 attempts on admin@et.com from 203.0.113.200", timestamp: "2026-06-10 22:30:00", resolved: false },
  { id: "al3", type: "Suspicious Activity", severity: "medium", message: "Non-VPN login from 203.0.113.50 for Aisha Rahman outside business hours", timestamp: "2026-06-12 08:20:00", user: "Aisha Rahman", resolved: false },
  { id: "al4", type: "Suspicious Activity", severity: "medium", message: "Multiple failed logins for james.lim@et.com from non-corporate IP", timestamp: "2026-06-14 15:50:00", user: "James Lim", resolved: false },
  { id: "al5", type: "Excessive Failed Logins", severity: "low", message: "3 failed login attempts for farah.diana@et.com", timestamp: "2026-06-13 10:35:00", user: "Farah Diana", resolved: true },
  { id: "al6", type: "Suspicious Activity", severity: "medium", message: "Non-VPN access detected for data entry operations", timestamp: "2026-06-12 09:20:00", user: "Aisha Rahman", resolved: false },
];

let auditTrail: AuditEntry[] = [
  { id: "at1", user: "System Admin", event: "Security Alert Resolved", timestamp: "2026-06-14 16:00:00", details: "Resolved alert: Excessive Failed Logins for farah.diana@et.com" },
  { id: "at2", user: "Daniel Wong", event: "User Role Changed", timestamp: "2026-06-14 16:00:00", details: "Changed Marcus Lee from Tech Staff to Technical Lead" },
  { id: "at3", user: "System Admin", event: "Account Disabled", timestamp: "2026-06-14 13:30:00", details: "Disabled Priya Nair's account" },
  { id: "at4", user: "System Admin", event: "Password Reset", timestamp: "2026-06-13 14:20:00", details: "Reset password for Mei Ling Chong" },
  { id: "at5", user: "System Admin", event: "Account Enabled", timestamp: "2026-06-12 11:00:00", details: "Re-enabled James Lim's account" },
  { id: "at6", user: "Daniel Wong", event: "User Role Changed", timestamp: "2026-06-11 15:00:00", details: "Changed Nurul Izzah's role" },
  { id: "at7", user: "Wei Lin Tan", event: "Login", timestamp: "2026-06-15 08:25:00", details: "VPN authenticated from IP 10.0.0.45" },
  { id: "at8", user: "System Admin", event: "Security Alert Triggered", timestamp: "2026-06-14 12:05:00", details: "High severity alert: Excessive failed logins detected" },
  { id: "at9", user: "Kevin Tan", event: "Login", timestamp: "2026-06-11 08:00:00", details: "VPN authenticated" },
  { id: "at10", user: "System Admin", event: "Account Created", timestamp: "2024-11-21 10:00:00", details: "Created Priya Nair's account" },
];

let blocklist: string[] = [];
let sessionCount = 8;
let vpnCount = 6;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const securityService = {
  async getActivities() {
    await delay();
    return [...activities];
  },

  async getAlerts() {
    await delay();
    return [...alerts];
  },

  async getAuditTrail() {
    await delay();
    return [...auditTrail];
  },

  async getDashboard() {
    await delay();
    const activeSessions = activities.filter((a) => a.activity === "Login").length - activities.filter((a) => a.activity === "Logout").length;
    const vpnUsers = activities.filter((a) => a.activity === "Login" && a.vpnStatus).length;
    const failedLogins = activities.filter((a) => a.activity === "Failed Login").length;
    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;
    return {
      activeSessions: Math.max(activeSessions, 4),
      vpnUsers: Math.max(vpnUsers, 4),
      failedLogins,
      securityAlerts: unresolvedAlerts,
    };
  },

  async blockUser(user: string, performedBy: string) {
    await delay();
    if (!blocklist.includes(user)) blocklist.push(user);
    activities.unshift({
      id: `s${Date.now()}`,
      user,
      role: "—",
      activity: "Account Disabled",
      ipAddress: "192.168.1.100",
      vpnStatus: true,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      details: `Blocked by ${performedBy}`,
    });
    alerts.unshift({
      id: `al${Date.now()}`,
      type: "Suspicious Activity",
      severity: "medium",
      message: `${user} was blocked by ${performedBy}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      user,
      resolved: false,
    });
    return { success: true };
  },

  async unblockUser(user: string, performedBy: string) {
    await delay();
    const idx = blocklist.indexOf(user);
    if (idx !== -1) blocklist.splice(idx, 1);
    activities.unshift({
      id: `s${Date.now()}`,
      user,
      role: "—",
      activity: "Account Enabled",
      ipAddress: "192.168.1.100",
      vpnStatus: true,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      details: `Unblocked by ${performedBy}`,
    });
    return { success: true };
  },

  async forceLogout(user: string, performedBy: string) {
    await delay();
    activities.unshift({
      id: `s${Date.now()}`,
      user,
      role: "—",
      activity: "Logout",
      ipAddress: "192.168.1.100",
      vpnStatus: true,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      details: `Force logged out by ${performedBy}`,
    });
    return { success: true };
  },

  async resolveAlert(alertId: string) {
    await delay();
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx !== -1) alerts[idx] = { ...alerts[idx], resolved: true };
    return { success: true };
  },

  isBlocked(user: string): boolean {
    return blocklist.includes(user);
  },
};