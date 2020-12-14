import React, {useEffect} from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
 
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard"
import CreateProfile from "./components/profile-forms/CreateProfile"
import EditProfile from "./components/profile-forms/EditProfile"
import AddExperience from "./components/profile-forms/AddExperience"
import AddEducation from "./components/profile-forms/AddEducation"
import Profiles from "./components/profiles/Profile"
import Profile from "./components/profile/Profile"
import Posts from "./components/posts/Posts"
import Post from "./components/post/Post"
import PrivateRoute from "./components/routing/PrivateRoute"
import { loadUser } from "./actions/auth"
import setAuthToken from "./utils/setauthtoken"

import store from "./store"
import "./App.css"

if(localStorage.token){
    setAuthToken(localStorage.token)
}

const App = () => { 
    useEffect( () => {
        store.dispatch(loadUser())
      }, [])

    return (
        <BrowserRouter>
            <React.Fragment>
                <Navbar />
                <Route path="/" exact component = {Landing} />
                <section className="container">
                    <Alert />
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        <Route path="/profiles" exact component={Profiles} />
                        <Route path="/profile/:id" exact component={Profile} /> 
                        <PrivateRoute path="/dashboard" exact component={Dashboard} />
                        <PrivateRoute path="/create-profile" exact component={CreateProfile} />
                        <PrivateRoute path="/edit-profile" exact component={EditProfile} />
                        <PrivateRoute path="/add-experience" exact component={AddExperience} />
                        <PrivateRoute path="/add-education" exact component={AddEducation} />
                        <PrivateRoute path="/posts" exact component={Posts} />
                        <PrivateRoute path="/posts/:id" exact component={Post} />
                    </Switch>
                </section>
            </React.Fragment >
        </BrowserRouter>
    )
}

export default App