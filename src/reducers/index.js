import {combineReducers} from 'redux';
import appData from './reducerDemo.js';
import appData2 from './reducerDemo2.js';
import registerResponse from './reducerRegister.js';
import getRoomsResponse from './reducerRooms.js';
import getFriendsRespose from './reducerFriends.js';

export default combineReducers({
    appData,
    appData2,
    registerResponse,
    getRoomsResponse,
    getFriendsRespose,
})