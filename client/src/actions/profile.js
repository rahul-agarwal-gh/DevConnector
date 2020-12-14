import axios from "axios"
import { setAlert } from "./alert"

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILES
} from "./types"

// GET Current users profile

export const getCurrentProfile = () => {

    return async function (dispatch, getState) {

        try{
            const res = await axios.get('/api/profile/me')
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }

    }
}

// Get all Profiles
export const getAllProfiles = () => {

    return async function (dispatch, getState) {
        try{
            const res = await axios.get('/api/profile')
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }

    }
}

// Get Profile by user id
export const getProfileByUserId = (id) => {

    return async function (dispatch, getState) {
        try{
            const res = await axios.get(`/api/profile/user/${id}`) 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }

    }
}

// action creator to get github repos

/* Create or Update a Profile. formdata = data passed to create/update the profile. After creating/updating the profile, we want to redirect,
so we use a history object that has a method named push that will redirect us to a client side route. edit = to know if this is for creating
the profile or updating it */
export const createProfile = (formdata, history, edit = false) => {
    return async function (dispatch) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.post('/api/profile', formdata, config)
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
            dispatch(setAlert( edit ? 'Profile Updated': 'Profile Created', 'success'))

            if(!edit)   //if we are creating the profile, then we want to redirect to dashboard
                history.push('/dashboard')  //Redirecting in an action is different, we can't use Redirect from react-router-dom, so we have to do using history object
             
        } catch (err) {
            const errors = err.response.data.errors
            if(errors){
                errors.forEach( error => dispatch(setAlert(error.msg, 'danger')))
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Add experience
export const addExperience = ( formData, history) => {
    return async function(dispatch){
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.put('/api/profile/experience', formData, config)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })
            dispatch(setAlert( 'Experience Added', 'success'))

            history.push('/dashboard')  //Redirecting in an action is different, we can't use Redirect from react-router-dom, so we have to do using history object
             
        } catch (err) {
            const errors = err.response.data.errors
            if(errors){
                errors.forEach( error => dispatch(setAlert(error.msg, 'danger')))
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        } 
    }
}


// Add Education
export const addEducation = ( formData, history) => {
    return async function(dispatch){
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.put('/api/profile/education', formData, config)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })
            dispatch(setAlert( 'Education Added', 'success'))

            history.push('/dashboard')  //Redirecting in an action is different, we can't use Redirect from react-router-dom, so we have to do using history object
             
        } catch (err) {
            const errors = err.response.data.errors
            if(errors){
                errors.forEach( error => dispatch(setAlert(error.msg, 'danger')))
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        } 
    }
}

// Delete Experience
export const deleteExperience = (id) => {
    return async function(dispatch) {
        try {
            const res = await axios.delete(`/api/profile/experience/${id}`)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert( 'Experience Removed', 'success'))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Delete Education
export const deleteEducation = (id) => {
    return async function(dispatch) {
        try {
            const res = await axios.delete(`/api/profile/education/${id}`)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert( 'Education Removed', 'success'))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Delete account & then Clear Profile
export const deleteAccount = () => {

    return async function(dispatch) {
        if(window.confirm('Are you sure you want to delete your account? Account once deleted cannot be recovered')) {
            try {
                await axios.delete(`/api/profile`)
                dispatch({
                    type: CLEAR_PROFILE
                })
                dispatch({
                    type: DELETE_ACCOUNT
                })
    
                dispatch(setAlert( 'Your account has been deleted'))
            } catch (err) {
                dispatch({
                    type: PROFILE_ERROR,
                    payload: { msg: err.response.statusText, status: err.response.status }
                })
            }
        }
    }
}
