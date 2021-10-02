import React, { Fragment,useEffect } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import "./App.css";
import Landing from "./component/layout/Landing";
import Navbar from "./component/layout/Navbar";
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import Alert from "./component/layout/Alert";
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store';

if(localStorage.token) setAuthToken(localStorage.token)

const App = () => {
useEffect(() => {
  store.dispatch(loadUser())
}, []);

return(
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register } />
        </Switch>
      </section>  
    </Fragment>
  </Router>
)};

export default App;
