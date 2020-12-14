import React, {useState} from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { setAlert } from "../../actions/alert"
import { register } from "../../actions/auth"

const Register = (props) => {

    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })
     
    const { name, email, password, password2 } = formData

    const onFormDataChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const onFormSubmit = async (e) => {
        e.preventDefault()
        if(password !== password2)
            props.setAlert("Passwords do not match!", 'danger')
        else  {
            props.register(name, email, password)
        }
    }

    // Redirect to Dashboard if logged in 
    if(props.isAuthenticated){
        return <Redirect to="/dashboard"/>
    } 

    return (
        <React.Fragment>
        <h1 className="large text-primary">Sign Up</h1>
		  <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
		  <form className="form" onSubmit={e => onFormSubmit(e) }>
			<div className="form-group">
			  <input type="text" placeholder="Name" name="name" value = {name} onChange={(e) => onFormDataChange(e)} />
			</div>
			<div className="form-group">
			  <input type="email" placeholder="Email" name="email" value = {email} onChange={(e) => onFormDataChange(e)}/>
			  <small className="form-text"
				>This site uses Gravatar so if you want a profile image, use a
				Gravatar email</small>
			</div>
			<div className="form-group">
			  <input
				type="password"
				placeholder="Password"
                name="password"
                value = {password}
                onChange={(e) => onFormDataChange(e)}
			  />
			</div>
			<div className="form-group">
			  <input
				type="password"
				placeholder="Confirm Password"
                name="password2"
                value = {password2}
                onChange={(e) => onFormDataChange(e)}
			  />
			</div>
			<input type="submit" className="btn btn-primary" value="Register" />
		  </form>
		  <p className="my-1">
			Already have an account?<Link to="/login">Sign In</Link>
		  </p>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return { isAuthenticated: state.auth.isAuthenticated }   
}

export default connect(mapStateToProps, {setAlert: setAlert, register: register})(Register)