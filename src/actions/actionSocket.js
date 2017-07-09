import { UPDATE_SOCKET, START_UPDATE_SOCKET} from "./actionTypes.js";

export function updateSocket(data) {
    return (dispatch) => {
        dispatch(startUpdateNewSocketDone());
        dispatch(updateNewSocket(data));
        
    }
}

function updateNewSocket(data){
    return{
        type: UPDATE_SOCKET,
        data
    }
}
function  startUpdateNewSocketDone(){
    return{
        type: START_UPDATE_SOCKET
    }
}