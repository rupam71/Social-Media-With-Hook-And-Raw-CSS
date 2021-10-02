import React from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
    const alerts = useSelector(state=>state.alert)
    console.log(alerts)

    if(alerts !== null && alerts.length > 0) return alerts.map(alert=>( 
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.message}
        </div>
     ))
    else return(<div></div>)
}
 
export default Alert;