import {  FETCHING_FRIENDS, FETCHING_FRIENDS_SUCCESS, FETCHING_FRIENDS_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
export function getFriendsStart() {
    return {
        type: FETCHING_FRIENDS
    }
}

export function getFriendsSuccess(data) {
    return {
        type: FETCHING_FRIENDS_SUCCESS,
        data,
}
}

export function getFriendsFailure() {
    return {
        type: FETCHING_FRIENDS_FAILURE
    }
}

export function getFriends() {
    return (dispatch) => {
        dispatch(getFriendsStart())
        apis.getFriendsList()
          .then((data) => {
            dispatch(getFriendsSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(getFriendsFailure())})
      }
 }