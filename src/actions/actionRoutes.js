import { UPDATE_ROUTES, START_UPDATE_ROUTES} from "./actionTypes.js";

export function updateRoutes(data) {
    return (dispatch) => {
        dispatch(startUpdateNewRoutes());
        dispatch(updateNewRoutes(data));
        
    }
}

function updateNewRoutes(data){
    return{
        type: UPDATE_ROUTES,
        data
    }
}
function  startUpdateNewRoutes(){
    return{
        type: START_UPDATE_ROUTES
    }
}