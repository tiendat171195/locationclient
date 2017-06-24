import { GET_DATA, FETCHING_DATA2, FETCHING_DATA_SUCCESS2, FETCHING_DATA_FAILURE2 } from '../actions/actionTypes.js';

const initialState = {
    data: [],
    dataFetched: false,
    isFetching: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING_DATA2:
            return {
                ...state,
                data: [],
                isFetching: true
            }
        case FETCHING_DATA_SUCCESS2:
            return {
                ...state,
                isFetching: false,
                data: action.data
            }
        case FETCHING_DATA_FAILURE2:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return state;
    }
}