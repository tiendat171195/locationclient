import {combineReducers} from 'redux';
import registerResponse from './reducerRegister.js';
import getRoomsResponse from './reducerRooms.js';
import getFriendsResponse from './reducerFriends.js';
import searchingFriendResponse from './reducerSearchFriend.js';
import getUserInfoResponse from './reducerUserInfo.js';
import getNotificationsResponse from './reducerNotifications.js';
import getLocationResponse from './reducerGPS.js';
import getAppointmentsResponse from './reducerAppointments.js';
import getSocketResponse from './reducerSocket.js';
import getRoutesResponse from './reducerRoutes.js';
export default combineReducers({
    registerResponse,
    getRoomsResponse,
    getFriendsResponse,
    searchingFriendResponse,
    getUserInfoResponse,
    getNotificationsResponse,
    getLocationResponse,
    getAppointmentsResponse,
    getSocketResponse,
    getRoutesResponse,
})