import React, {useState} from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { login } from "../../actions/auth"

const Login = (props) => {
    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
    })
     
    const { email, password } = formData

    const onFormDataChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const onFormSubmit = async (e) => {
        e.preventDefault()
        props.login(email, password)
    }

    // Redirect to Dashboard if logged in 
    if(props.isAuthenticated){
        return <Redirect to="/dashboard"/>
    }   

    return (
        <React.Fragment>
        <h1 className="large text-primary">Sign In</h1>
		  <p className="lead"><i className="fas fa-user"></i> Sign In to Your Account</p>
		  <form className="form" onSubmit={e => onFormSubmit(e) }>
			<div className="form-group">
			  <input type="email" placeholder="Email Address" value = {email} onChange={(e) => onFormDataChange(e)} name="email" />
			</div>
			<div className="form-group">
			  <input
				type="password"
				placeholder="Password"
                name="password"
                value = {password}
                onChange={(e) => onFormDataChange(e)}
				minLength="6"
			  />
			</div>
			<input type="submit" className="btn btn-primary" value="Login" />
		  </form>
		  <p className="my-1">
			Don't have an account? <Link to="/register">Sign Up</Link>
		  </p>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return { isAuthenticated: state.auth.isAuthenticated }   
}

export default connect(mapStateToProps, { login: login })(Login)