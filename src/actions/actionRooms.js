import {  FETCHING_ROOMS, FETCHING_ROOMS_SUCCESS, FETCHING_ROOMS_FAILURE  } from "./actionTypes.js";
import apis from '../apis/api.js';
function getRoomsStart() {
    return {
        type: FETCHING_ROOMS
    }
}

function getRoomsSuccess(data) {
    return {
        type: FETCHING_ROOMS_SUCCESS,
        data,
}
}

function getRoomsFailure() {
    return {
        type: FETCHING_ROOMS_FAILURE
    }
}

export function getRooms() {
    return (dispatch) => {
        dispatch(getRoomsStart())
        apis.getRoomList()
          .then((data) => {
            dispatch(getRoomsSuccess(data))
          })
          .catch((err) => {console.log('err:', err);
          dispatch(getRoomsFailure())})
      }
 }