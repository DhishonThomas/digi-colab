import Cookies from "js-cookie";

// Load state from cookies
export const loadState = () => {
  try {
    const serializedState = Cookies.get("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load the state", error);
    return undefined;
  }
};

// Save state to cookies
export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set("reduxState", serializedState, { expires: 7 }); // Cookie expires in 7 days
  } catch (error) {
    console.error("Could not save the state", error);
  }
};
