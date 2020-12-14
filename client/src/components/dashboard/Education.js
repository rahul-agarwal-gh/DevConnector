import React from "react"
import { connect } from "react-redux"
import Moment from 'react-moment' 
import {deleteEducation} from "../../actions/profile"

const Education = ({deleteEducation, education}) => {   //education prop  is passsed from parent component Dashboard 
    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{edu.from}</Moment> - {
                    edu.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{edu.to}</Moment>)
                }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteEducation(edu._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <React.Fragment>
            <h2 className="my-2">Education</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default connect(null, {deleteEducation})(Education)