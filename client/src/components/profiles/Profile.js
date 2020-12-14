import React, {useEffect} from "react"
import { connect } from "react-redux"

import Spinner from "../layout/Spinner"
import ProfileItem from "./ProfileItem"

// Actions
import { getAllProfiles } from "../../actions/profile"

const Profiles = ({ profile: {profiles, loading}, getAllProfiles }) => {
    
    useEffect(() => {
        getAllProfiles()
    }, [getAllProfiles])

    return (
        <React.Fragment>
            { loading ? <Spinner /> : <React.Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i>Browse and connect with Developers
                </p>
                <div className="profiles">
                    { profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileItem key={profile._id} profile={profile} />
                        ))
                    ) : <h4>No Profile found</h4> }
                </div>
            </React.Fragment> }
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {  profile: state.profile }
}
export default connect(mapStateToProps, { getAllProfiles })(Profiles)