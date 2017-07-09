import {  FETCHING_NOTIFICATIONS, FETCHING_NOTIFICATIONS_SUCCESS, FETCHING_NOTIFICATIONS_FAILURE  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    fetched: false,
    isFetching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING_NOTIFICATIONS:
            return {
                ...state,
                data:{},
                isFetching: true,
                fetched: false
            }
            case FETCHING_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
            case FETCHING_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched:false,
                error: true
            }
        default:
            return state;
    }
}