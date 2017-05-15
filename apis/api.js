import {
	Alert,
	AsyncStorage
} from 'react-native';
const API_path = 'http://192.168.83.2:3000/';
var token = '';
var user_id = '';
var apis = {
	updateUserInfo(_token, _id){
			token = _token;
			user_id = _id;
	},
	async SignUp(username, password){
		try{
			let response = await fetch(API_path + 'auth/register', 
			{"method": "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						username: username,
						password: password,
				})
			});
      let responseJson = await response.json();
      return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async SignIn(username, password){
		try{
			let response = await fetch(API_path + 'auth/login', 
			{"method": "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						username: username,
						password: password,
				})
			});
			let responseJson = await response.json();
			return responseJson;
				}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getNewsFeed(){
		try{
			let response = await fetch(API_path + 'newsfeeds',
			{'method': 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async SignOut(){
		try{
			let response = await fetch(API_path + 'auth/logout',
			{method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
			}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getNewsDetail(newsId){
		try{
			let response = await fetch(API_path + 'newsfeeds/'+newsId,
			{'method': 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async postNewsComment(newsId, comment){
		try{
			let response = await fetch(API_path + 'comment/?newfeed_id=' + newsId, 
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				},
				body: JSON.stringify({
						description: comment,
				})
			});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getFriendsList(){
		try{
			let response = await fetch(API_path + 'friends/',
			{'method': 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getFriendsRequestList(){
		try{
			let response = await fetch(API_path + 'friends/requests/',
			{'method': 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async addNewFriend(friendId){
		try{
			let response = await fetch(API_path + 'friends/' + friendId +'/add', 
			{'method': 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async acceptFriend(friendId){
		try{
			let response = await fetch(API_path + 'friends/' + friendId + '/accept', 
			{'method': 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async createNewRoom(RoomName){
		try{
			let response = await fetch(API_path + 'groups/', 
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				},
				body: JSON.stringify({
						group_name: RoomName,
				})
			});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getRoomList(){
		try{
			let response = await fetch(API_path + 'groups/',
			{method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
			}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async addNewMember(GroupID, NewMemberID){
		try{
			let response = await fetch(API_path + 'groups/' + GroupID + '/members?friend_id=' + NewMemberID,
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					'user_id': user_id,
				},
				body: JSON.stringify({
						group_id: GroupID,
						friend_id: NewMemberID
				})
			});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
};
module.exports = apis;