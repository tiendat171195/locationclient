import {  SEARCHING_FRIENDS, SEARCHING_FRIENDS_SUCCESS, SEARCHING_FRIENDS_FAILURE  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    searched: false,
    isSearching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCHING_FRIENDS:
            return {
                ...state,
                data:{},
                searched: false,
                isSearching: true
            }
            case SEARCHING_FRIENDS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searched: true,
                data: action.data
            }
            case SEARCHING_FRIENDS_FAILURE:
            return {
                ...state,
                searched: false,
                isSearching: false,
                error: true
            }
        default:
            return state;
    }
}