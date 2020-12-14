import { combineReducers } from "redux"

//Reducers
import alert from "./alert"
import auth from "./auth"
import profile from "./profile"
import post from "./post"

const rootReducer = combineReducers({
    alert: alert,
    auth: auth,
    profile: profile,
    post: post
})

export default rootReducer