import {  FETCHING_NOTIFICATIONS, FETCHING_NOTIFICATIONS_SUCCESS, FETCHING_NOTIFICATIONS_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
export function getNotificationsStart() {
    return {
        type: FETCHING_NOTIFICATIONS
    }
}

export function getNotificationsSuccess(data) {
    return {
        type: FETCHING_NOTIFICATIONS_SUCCESS,
        data,
}
}

export function getNotificationsFailure() {
    return {
        type: FETCHING_NOTIFICATIONS_FAILURE
    }
}

export function getNotifications() {
    return (dispatch) => {
        dispatch(getNotificationsStart())
        apis.getNotifications()
          .then((data) => {
            dispatch(getNotificationsSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(getNotificationsFailure())})
      }
 }