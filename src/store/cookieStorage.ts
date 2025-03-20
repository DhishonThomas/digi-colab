import Cookies from "js-cookie";

export const loadState = () => {
  try {
    const serializedState = Cookies.get("reduxState");
    if (!serializedState) return {}; 
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load the state", error);
    return {};
  }
};


export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set("reduxState", serializedState, { 
      expires: 7, 
      secure: true,
      sameSite: "Lax",
      path: "/",
    }); 
  } catch (error) {
    console.error("Could not save the state", error);
  }
};

