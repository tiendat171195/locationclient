import {  FETCHING_ROOMS, FETCHING_ROOMS_SUCCESS, FETCHING_ROOMS_FAILURE  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    fetched: false,
    isFetching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING_ROOMS:
            return {
                ...state,
                data:{},
                fetched:false,
                isFetching: true
            }
            case FETCHING_ROOMS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
            case FETCHING_ROOMS_FAILURE:
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