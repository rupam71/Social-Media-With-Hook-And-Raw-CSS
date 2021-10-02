import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "./types";
import { setAlert } from "./alert";
import setAuthToken from './../utils/setAuthToken';

//Load User
export const loadUser = () => async dispatch => {
  if(localStorage.token) {
    setAuthToken(localStorage.token)
  }
  
  try {
    const res = await axios.get('/api/users/');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    })
  }
}

//Register User
export const register = (user) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/users/signup", user, config);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser())

  } catch (err) {
      console.log('Err:: ',err.response.data)
      const error = err.response.data;
      if (error) {dispatch(setAlert(error, "danger"));}
    
      dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (user) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/users/login", user, config);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser())

  } catch (err) {
      console.log('Err:: ',err.response.data)
      const error = err.response.data;
      if (error) {dispatch(setAlert(error, "danger"));}
    
      dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//LOGOUT //Clear Profile
export const logout = () => dispatch => {
  dispatch({ type:LOGOUT })
}