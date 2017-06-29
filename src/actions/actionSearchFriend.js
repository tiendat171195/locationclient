import {  SEARCHING_FRIENDS, SEARCHING_FRIENDS_SUCCESS, SEARCHING_FRIENDS_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
export function searchFriendStart() {
    return {
        type: SEARCHING_FRIENDS
    }
}

export function searchFriendSuccess(data) {
    return {
        type: SEARCHING_FRIENDS_SUCCESS,
        data,
}
}

export function searchFriendFailure() {
    return {
        type: SEARCHING_FRIENDS_FAILURE
    }
}

export function searchFriend(keyword) {
    return (dispatch) => {
        dispatch(searchFriendStart())
        apis.searchFriend(keyword)
          .then((data) => {
            dispatch(searchFriendSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(searchFriendFailure())})
      }
 }