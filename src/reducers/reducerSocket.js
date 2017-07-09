import {  UPDATE_SOCKET, START_UPDATE_SOCKET  } from "../actions/actionTypes.js";

const initialState = {
    data: null,
    uptodate: true,
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
            case UPDATE_SOCKET:
            return {
                ...state,
                uptodate: true,
                data: action.data
            }
            case START_UPDATE_SOCKET:
            return{
                ...state,
                uptodate: false
            }
        default:
            return state;
    }
}