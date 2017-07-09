import {  UPDATE_ROUTES, START_UPDATE_ROUTES  } from "../actions/actionTypes.js";

const initialState = {
    data: {},
    uptodate: true,
}


export default function dataReducer(state = initialState, action) {
    switch (action.type) {
            case UPDATE_ROUTES:
            return {
                ...state,
                uptodate: true,
                data: action.data
            }
            case START_UPDATE_ROUTES:
            return{
                ...state,
                uptodate: false
            }
        default:
            return state;
    }
}