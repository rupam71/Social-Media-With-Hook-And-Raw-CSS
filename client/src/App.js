import React, { Fragment } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import "./App.css";
import Landing from "./component/layout/Landing";
import Navbar from "./component/layout/Navbar";
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register } />
        </Switch>
      </section>  
    </Fragment>
  </Router>
);

export default App;
