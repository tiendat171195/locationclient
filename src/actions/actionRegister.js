import {  REGISTERING, REGISTER_SUCCESS, REGISTER_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
export function registerStart() {
    return {
        type: REGISTERING
    }
}

export function registerSuccess(data) {
    return {
        type: REGISTER_SUCCESS,
        data,
}
}

export function registerFailure() {
    return {
        type: REGISTER_FAILURE
    }
}

export function register(username, password, phone, email, gender, birthday, city) {
    return (dispatch) => {
        dispatch(registerStart())
        apis.Register(username, password, phone, email, gender, birthday, city)
          .then((data) => {
            dispatch(registerSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(registerFailure())})
      }
 }