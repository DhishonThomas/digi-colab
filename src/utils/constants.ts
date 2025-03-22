const MAIN_URL=process.env.NEXT_PUBLIC_SERVER_URL

//Main
export const ADMIN_URL=`${MAIN_URL}/admin`;
export const USER_URL=`${MAIN_URL}/user`;
export const VOLUNTEER_URL=`${MAIN_URL}/volunteer`;

//Login 
export const USER_LOGIN=`${USER_URL}/login`;
export const ADMIN_LOGIN=`${ADMIN_URL}/login`;
export const VOLUNTEER_LOGIN=`${VOLUNTEER_URL}/login`;

//Send-Email-Otp
export const USER_SEND_OTP=`${USER_URL}/send-email-otp`;
export const VOLUNTEER_SEND_OTP=`${VOLUNTEER_URL}/send-email-otp`;

//Verify-Otp
export const USER_VERIFY_OTP=`${USER_URL}/verify-email-otp`
export const VOLUNTEER_VERIFY_OTP=`${VOLUNTEER_URL}/verify-email-otp`

//Register
export const USER_REGISTER=`${USER_URL}/register`
export const VOLUNTEER_REGISTER=`${VOLUNTEER_URL}/register`
export const GET_VOLUNTEERS=`${USER_URL}/volunteers`