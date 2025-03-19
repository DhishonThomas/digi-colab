import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loadState,saveState } from "./cookieStorage";
import adminReducer from "./slices/adminSlice";
import userReducer from "./slices/userSlice";
import volunteerReducer from "./slices/volunteer";

const rootReducer=combineReducers({
admin:adminReducer,
user:userReducer,
volunteer:volunteerReducer,
})

const persistedState=loadState()//here we laod data from cookies.

const store=configureStore({
    reducer:rootReducer,
    preloadedState:persistedState,
})

store.subscribe(()=>{
saveState({
    admin:store.getState().admin,
    user:store.getState().user,
    volunteer:store.getState().volunteer,
})
})

export type RootState=ReturnType<typeof store.getState>;

export type AppDispatch=typeof store.dispatch

export default store;