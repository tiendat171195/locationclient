import { UPDATE_LOCATION, START_UPDATE_LOCATION} from "./actionTypes.js";

export function updateGPS(data) {
    return (dispatch) => {
        dispatch(startUpdateNewLocationDone());
        dispatch(updateNewLocation(data));
        
    }
}

function updateNewLocation(data){
    return{
        type: UPDATE_LOCATION,
        data
    }
}
function  startUpdateNewLocationDone(){
    return{
        type: START_UPDATE_LOCATION
    }
}