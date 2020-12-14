import axios from "axios"
import {setAlert} from "./alert"
import { DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from "./types"

// Get Posts
export const getPosts = () => {
    return async function (dispatch, getState) {
        try {
            const res = await axios.get('/api/posts')
            dispatch({ 
                type: GET_POSTS,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Add like
export const addLike = (postId) => {
    return async function (dispatch, getState) {
        try {
            const res = await axios.put(`/api/posts/like/${postId}`)
            dispatch({ 
                type: UPDATE_LIKES,
                payload: { postId, likes: res.data} //id is post id
            })
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Remove like
export const removeLike = (postId) => {
    return async function (dispatch, getState) {
        try {
            const res = await axios.put(`/api/posts/unlike/${postId}`)
            dispatch({ 
                type: UPDATE_LIKES,
                payload: { postId, likes: res.data} //id is post id
            })
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}


// Delete Post
export const deletePost = (postId) => {
    return async function (dispatch, getState) {
        try {
            await axios.delete(`/api/posts/${postId}`)
            dispatch({ 
                type: DELETE_POST,
                payload: postId //id is post id
            })
            dispatch(setAlert('Post Removed','success'))
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Add Post
export const addPost = (formData) => {
    return async function (dispatch, getState) {
        const config = {
            headers : {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post(`/api/post/`, formData, config)
            dispatch({ 
                type: ADD_POST,
                payload: res.data
            })
            dispatch(setAlert('Post Created','success'))
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Get a Post
export const getPost = (postId) => {
    return async function (dispatch, getState) {
        try {
            const res = await axios.get(`/api/posts/${postId}`)
            dispatch({ 
                type: GET_POST,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}


// Add comment
export const addComment = (postId, formData) => async dispatch => {
    try {
      const res = await axios.post(`/api/posts/comments/${postId}`, formData);
  
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });
  
      dispatch(setAlert('Comment Added', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Delete comment
  export const deleteComment = (postId, commentId) => async dispatch => {
    try {
      await axios.delete(`/api/posts/comments/${postId}/${commentId}`);
  
      dispatch({
        type: REMOVE_COMMENT,
        payload: commentId
      });
  
      dispatch(setAlert('Comment Removed', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };