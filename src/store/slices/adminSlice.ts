import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    isAuthenticated:boolean;
    admin:object|null
    token:string|null
}

const initialState:AuthState={
    isAuthenticated:false,
    admin:null,
    token:null,
}

const authSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<{user:any; token:string}>)=>{
            state.isAuthenticated=true;
            state.admin=action.payload.user;
            state.token=action.payload.token;
        },
        logout:(state)=>{
            state.isAuthenticated=false;
            state.admin=null;
            state.token=null
        }
    }
})

const adminReducer=authSlice.reducer

export const {loginSuccess,logout}=authSlice.actions

export default adminReducer;