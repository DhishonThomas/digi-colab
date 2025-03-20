import Cookies from "js-cookie";

// Load state from cookies
export const loadState = () => {
  try {
    const serializedState = Cookies.get("reduxState");
    if (!serializedState) return {}; // Return an empty object instead of undefined
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load the state", error);
    return {};
  }
};


// Save state to cookies
export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set("reduxState", serializedState, { 
      expires: 7, 
      secure: true, // Ensure cookies are only sent over HTTPS
      sameSite: "None", // Required for cross-origin requests
      path: "/", // Ensure the cookie is available for all requests
    }); 
  } catch (error) {
    console.error("Could not save the state", error);
  }
};

