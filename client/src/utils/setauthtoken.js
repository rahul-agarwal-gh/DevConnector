//this function just takes a token as input, if the token does not exist(if null was passed to this function), we will remove the
//'x-auth-token' property from our request header that we'll make from axios. If a token was passed to this function, then we will set 
//an 'x-auth-token' property to our axios request header, and its value will be token passed to this function

import axios from "axios"

const setAuthToken = (token) => {
    if(token)
        axios.defaults.headers.common['x-auth-token'] = token
    else  
        delete axios.defaults.headers.common['x-auth-token']
}

export default setAuthToken