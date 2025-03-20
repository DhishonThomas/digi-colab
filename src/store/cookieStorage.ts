import Cookies from "js-cookie";

// Check if running in a browser
const isClient = typeof window !== "undefined";

// Load state from storage
export const loadState = () => {
  try {
    if (!isClient) return {}; // Prevent SSR errors

    // Try loading from cookies first
    const serializedState = Cookies.get("reduxState");

    if (serializedState) {
      return JSON.parse(serializedState);
    }

    // Fallback: Try loading from localStorage
    const localState = localStorage.getItem("reduxState");
    return localState ? JSON.parse(localState) : {};
  } catch (error) {
    console.error("Could not load the state", error);
    return {};
  }
};

// Save state to storage
export const saveState = (state: any) => {
  try {
    if (!isClient) return; // Prevent SSR errors

    const serializedState = JSON.stringify(state);

    // Save to Cookies
    Cookies.set("reduxState", serializedState, {
      expires: 7, // 7-day persistence
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Lax", // More cross-browser compatibility
      path: "/",
    });

    // Also save to localStorage as a fallback
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.error("Could not save the state", error);
  }
};
