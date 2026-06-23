// Centralized backend base URLs for local environment
const origin = typeof window !== "undefined" ? window.location.origin : "";

// Development: XAMPP is running on localhost:80 (Apache)
// Production: Use the homepage prefix
const xamppBase = "http://localhost";
const xamppWithProject = "http://localhost/Capstone--Development";
const devBase = process.env.REACT_APP_API_BASE || xamppWithProject;
const homepage = process.env.PUBLIC_URL || "/Capstone--Development/customer";
const prodBase = `${origin}${homepage}`.replace(/\/$/, "");
const prodRootBase = `${origin}${homepage.replace(/\/customer$/, "")}`.replace(/\/$/, "");

export const BASE = process.env.NODE_ENV === "development" ? xamppWithProject : prodBase;
// Use full XAMPP URLs for API calls
export const CUSTOMER_BASE = process.env.REACT_APP_CUSTOMER_BASE || (
  process.env.NODE_ENV === "development" 
    ? `${xamppBase}/Capstone--Development/customer`
    : `${prodBase}`
);
export const ROOT_BASE = process.env.NODE_ENV === "development"
  ? xamppWithProject
  : prodRootBase;
export const STAFF_BASE = process.env.REACT_APP_STAFF_BASE || (
  process.env.NODE_ENV === "development"
    ? `${xamppBase}/Capstone--Development/staff`
    : `${prodBase}/staff`
);
