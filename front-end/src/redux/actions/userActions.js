// ACTIONS EXPLICATIONS
// it is the triggers that is activeted by the types
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../reducers/types';
import axios from 'axios';

// LOGIN USER
// dispacth is use to get the asyncronous of this function
// so i can have acess more informations
export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post('/login', userData)
      .then(res => {
        // console.log(res.data);
        // this is to put the token locally becousa when
        // update the page the token is the same
        const FBIToken = `Bearer ${res.data.token}`;
        localStorage.setItem('FBIdToken', FBIToken);
        // this axios here is to put the Bearer inside the authorization header
        axios.defaults.headers.common['Authorization'] = FBIToken;
        dispatch(getUserData());
        // this type is only to clean any errors the code may have
        dispatch({ type: CLEAR_ERRORS });
        // this is to move into thata direction
        history.push('/');
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          // this the usual to user when put some err
          payload: err.response.data
        })
      })
};

// GET USER DATA
export const getUserData = () => (dispatch) => {
  axios.get('/user')
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      })
    })
    .catch(err => console.error(err));
};