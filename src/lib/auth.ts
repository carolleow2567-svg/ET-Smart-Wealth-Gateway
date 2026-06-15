export const AUTH_KEY = "isAuthenticated";
export const AUTH_EMAIL = "admin@etsmart.com";
export const AUTH_PASSWORD = "password123";

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_KEY) === "true";
};

export const authenticate = (email: string, password: string) => {
  if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }
    return true;
  }

  return false;
};

export const clearAuthentication = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_KEY);
  }
};
