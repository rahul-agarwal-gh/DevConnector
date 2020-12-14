import React from "react"
import { connect } from "react-redux"

const Alert = (props) => 
    props.alert !== null && props.alert.length > 0 && props.alert.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ))

const mapStateToProps = (state) => {
    return {
        alert : state.alert  
    }
}

export default connect(mapStateToProps)(Alert)