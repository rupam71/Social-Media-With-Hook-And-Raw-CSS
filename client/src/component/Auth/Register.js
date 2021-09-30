import axios from "axios";
import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const formOnChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const formOnSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2)
      console.log("Password Do Not Match");
    else {
      console.log("Success", formData);
      const body = Object.assign({}, formData);
      delete body.password2;
      console.log(body);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          }
        }
        const res = await axios.post('/api/users/signup',body,config);
        //Here config is not needed. Beacase this is a public route. 
        console.log('Server: ',res.data)
        setFormData({
          name: "",
          email: "",
          password: "",
          password2: "",
        })
      } catch (error) {
        console.error(error.response.data)
      }
    }
  };
  console.log(formData);
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => formOnSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={(e) => formOnChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) => formOnChange(e)}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={formData.password2}
            onChange={(e) => formOnChange(e)}
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
