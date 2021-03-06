import React,{useState} from "react"
import { connect } from "react-redux"
import { addExperience } from "../../actions/profile"
import { Link, withRouter } from "react-router-dom"

const AddExperience = ({addExperience, history}) => {

    const [ formData, setFormData ] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: '',
    })

    const [toDateDisabled, toggleDisable] = useState(false) // we want to disable the "to date" part of our form for user's current company

    const { company, title, location, from, to, current, description } = formData
     
    const onFormDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    return (
        <React.Fragment>
            <h1 class="large text-primary">Add An Experience</h1>
            <p class="lead">
                <i class="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form class="form" onSubmit={e => {
                e.preventDefault()
                addExperience(formData, history)
            }}>
                <div class="form-group">
                <input type="text" placeholder="* Job Title" name="title" value={title} onChange={e => onFormDataChange(e)} required />
                </div>
                <div class="form-group">
                <input type="text" placeholder="* Company" name="company" value={company} onChange={e => onFormDataChange(e)} required />
                </div>
                <div class="form-group">
                <input type="text" placeholder="Location" name="location" value={location} onChange={e => onFormDataChange(e)} />
                </div>
                <div class="form-group">
                <h4>From Date</h4>
                <input type="date" name="from"  value={from} onChange={e => onFormDataChange(e)}/>
                </div>
                <div class="form-group">
                <p><input type="checkbox" checked={current} name="current" value={current} onChange={e => {
                    setFormData({...formData, current: !current})
                    toggleDisable(!toDateDisabled )
                    }}/> Current Job</p>
                </div>
                <div class="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={e => onFormDataChange(e)} disabled={toDateDisabled? 'disabled': ''}/>
                </div>
                <div class="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Job Description"
                    value={description} onChange={e => onFormDataChange(e)}
                ></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <Link class="btn btn-light my-1" href="dashboard.html">Go to Home</Link>
            </form>
        </React.Fragment>
    )
}

export default connect(null, { addExperience } )(withRouter(AddExperience)) 