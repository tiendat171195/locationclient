import { REGISTERING, REGISTER_SUCCESS, REGISTER_FAILURE } from '../actions/actionTypes.js';

const initialState = {
    data: {},
    registered: false,
    isRegistering: false,
    error: false
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case REGISTERING:
            return {
                ...state,
                data:{},
                isRegistering: true
            }
            case REGISTER_SUCCESS:
            return {
                ...state,
                isRegistering: false,
                registered: true,
                data: action.data
            }
            case REGISTER_FAILURE:
            return {
                ...state,
                isRegistering: false,
                error: true
            }
        default:
            return state;
    }
}