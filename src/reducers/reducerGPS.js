import {  UPDATE_LOCATION, START_UPDATE_LOCATION  } from "../actions/actionTypes.js";

const initialState = {
    data: null,
    uptodate: true,
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
            case UPDATE_LOCATION:
            return {
                ...state,
                uptodate: true,
                data: action.data
            }
            case START_UPDATE_LOCATION:
            return{
                ...state,
                uptodate: false
            }
        default:
            return state;
    }
}