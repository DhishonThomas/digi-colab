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
        loginVolunteer:(state,action:PayloadAction<{volunteer:any; token:string}>)=>{
            state.isAuthenticated=true;
            state.volunteer=action.payload.volunteer;
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

export const {loginVolunteer,logout}=authSlice.actions

export default volunteerReducer;