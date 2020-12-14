import React, {useEffect} from "react"  
import { connect } from "react-redux"
import { getCurrentProfile, deleteAccount } from "../../actions/profile"
import { Link } from 'react-router-dom'

import DashboardActions from "./DashboardActions"
import Spinner from "../layout/Spinner"
import Experience from "./Experience"
import Education from "./Education"


const Dashboard = ( {auth: {user}, profile: {profile, loading}, getCurrentProfile, deleteAccount} ) => {

    //we are using useEffect because we want to call getCurrentProfile action (to fetch and load user's profile) as soon as User Logs in
    useEffect(()=> {
        getCurrentProfile()
    }, [getCurrentProfile])

    return (
        loading && profile === null ? <Spinner /> : <React.Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                {/* If user, exists, then show it(user comes from auth state that we destructured) */}
                <i className="fas fa-user"></i> Welcome { user && user.name} 
            </p>
            {profile !== null ? (
            <React.Fragment>
                <DashboardActions />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />

                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus"> Delete my Account</i>
                    </button>
                </div>
            </React.Fragment>
            ) : (
            <React.Fragment>
                <p>You have not Set-up your Profile. Please add some info.</p>
                <Link to="/create-profile"  className="btn btn-primary my-1">
                    Create Profile
                </Link>
            </React.Fragment>
            ) }
        </React.Fragment> 
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {
    getCurrentProfile: getCurrentProfile,
    deleteAccount: deleteAccount
})(Dashboard)