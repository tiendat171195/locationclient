import { UPDATE_APPOINTMENTS, START_UPDATE_APPOINTMENTS} from "./actionTypes.js";

export function updateAppointments(data) {
    return (dispatch) => {
        dispatch(startUpdateNewAppointments());
        dispatch(updateNewAppointments(data));
        
    }
}

function updateNewAppointments(data){
    return{
        type: UPDATE_APPOINTMENTS,
        data
    }
}
function  startUpdateNewAppointments(){
    return{
        type: START_UPDATE_APPOINTMENTS
    }
}