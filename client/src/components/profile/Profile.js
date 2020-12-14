import React, {useEffect} from "react"
import {connect} from "react-redux"
import Spinner from "../layout/Spinner"
import { getProfileByUserId } from "../../actions/profile"
import { Link } from "react-router-dom"

import ProfileTop from "./ProfileTop"
import ProfileAbout from "./ProfileAbout"
import ProfileExperience from "./ProfileExperience"
import ProfileEducation from "./ProfileEducation"
// import ProfileGithub from "./ProfileGithub"

const Profile = ({getProfileByUserId, profile: {profile, loading}, auth, match}) => {

    useEffect(() => {
        getProfileByUserId(match.params.id) //user id will be passed as parameter to url. 
    //You can get it using props.match.params.parameter (here parameter is id) and we already destructured props.match, so we just used match
   
    }, [getProfileByUserId, match.params.id])
    return (
        <React.Fragment>
            {profile === null || loading ? <Spinner /> : <React.Fragment>
                <Link to="/profiles" className="btn btn-light"> Go back to Profiles </Link>
                <div class="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />
                    <div className="profile-exp bg-white p-2">
                    <h2 className="text-primary">Experience</h2>
                    {profile.experience.length > 0 ? (
                        <React.Fragment>
                        {profile.experience.map((experience) => (
                            <ProfileExperience
                            key={experience._id}
                            experience={experience}
                            />
                        ))}
                        </React.Fragment>
                    ) : (
                        <h4>No experience credentials</h4>
                    )}
                </div>
                <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <React.Fragment>
                  {profile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </React.Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {/* {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )} */}
            </div>
            </React.Fragment>}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return { profile: state.profile, auth: state.auth }
}
export default connect(mapStateToProps, {getProfileByUserId})(Profile)
