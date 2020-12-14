import React from "react"
import { connect } from "react-redux"
import Moment from 'react-moment' 
import {deleteExperience} from "../../actions/profile"

const Experience = ({deleteExperience, experience}) => { //experience props is passed from Parent Dashbaord component
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {
                    exp.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)
                }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <React.Fragment>
            <h2 className="my-2">Experience</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {experiences}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default connect(null, { deleteExperience })(Experience)