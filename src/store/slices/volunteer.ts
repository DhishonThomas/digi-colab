import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    isAuthenticated:boolean;
    volunteer:object|null
    token:string|null
}

const initialState:AuthState={
    isAuthenticated:false,
    volunteer:null,
    token:null,
}

const authSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<{user:any; token:string}>)=>{
            state.isAuthenticated=true;
            state.volunteer=action.payload.user;
            state.token=action.payload.token;
        },
        logout:(state)=>{
            state.isAuthenticated=false;
            state.volunteer=null;
            state.token=null
        }
    }
})

const volunteerReducer=authSlice.reducer

export const {loginSuccess,logout}=authSlice.actions

export default volunteerReducer;