import {  FETCHING_USERINFO, FETCHING_USERINFO_SUCCESS, FETCHING_USERINFO_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
export function getUserInfoStart() {
    return {
        type: FETCHING_USERINFO
    }
}

export function getUserInfoSuccess(data) {
    return {
        type: FETCHING_USERINFO_SUCCESS,
        data,
}
}

export function getUserInfoFailure() {
    return {
        type: FETCHING_USERINFO_FAILURE
    }
}

export function getUserInfo(UserID) {
    return (dispatch) => {
        dispatch(getUserInfoStart())
        apis.getUserInfo(UserID)
          .then((data) => {
            dispatch(getUserInfoSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(getUserInfoFailure())})
      }
 }