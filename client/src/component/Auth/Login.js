import React, {useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const formOnChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const formOnSubmit = async (e) => {
      e.preventDefault()
      console.log("Success", formData);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.post("/api/users/login", formData, config);
        //Here config is not needed. Beacase this is a public route.
        console.log("Server: ", res.data);
        setFormData({
          email: "",
          password: ""
        });
      } catch (error) {
        console.error(error.response.data);
      }
  };
  console.log(formData);
  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={(e) => formOnSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={(e) => formOnChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input type="password" 
          placeholder="Password" 
          name="password" 
          value={formData.password}
          onChange={(e) => formOnChange(e)}
          required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
};

export default Login;
