import {  UPDATE_APPOINTMENTS, START_UPDATE_APPOINTMENTS  } from "../actions/actionTypes.js";

const initialState = {
    data: [],
    uptodate: true,
}


export default function dataReducer(state = initialState, action) {
    switch (action.type) {
            case UPDATE_APPOINTMENTS:
            return {
                ...state,
                uptodate: true,
                data: action.data
            }
            case START_UPDATE_APPOINTMENTS:
            return{
                ...state,
                uptodate: false
            }
        default:
            return state;
    }
}