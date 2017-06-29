import {combineReducers} from 'redux';
import registerResponse from './reducerRegister.js';
import getRoomsResponse from './reducerRooms.js';
import getFriendsResponse from './reducerFriends.js';
import searchingFriendResponse from './reducerSearchFriend.js';
export default combineReducers({
    registerResponse,
    getRoomsResponse,
    getFriendsResponse,
    searchingFriendResponse
})