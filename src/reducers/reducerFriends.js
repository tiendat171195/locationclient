import {  FETCHING_FRIENDS, FETCHING_FRIENDS_SUCCESS, FETCHING_FRIENDS_FAILURE  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    fetched: false,
    isFetching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING_FRIENDS:
            return {
                ...state,
                data:{},
                isFetching: true
            }
            case FETCHING_FRIENDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
            case FETCHING_FRIENDS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return state;
    }
}