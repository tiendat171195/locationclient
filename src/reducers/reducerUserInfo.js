import {  FETCHING_USERINFO, FETCHING_USERINFO_SUCCESS, FETCHING_USERINFO_FAILURE  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    fetched: false,
    isFetching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING_USERINFO:
            return {
                ...state,
                data:{},
                isFetching: true,
                fetched: false
            }
            case FETCHING_USERINFO_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            }
            case FETCHING_USERINFO_FAILURE:
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