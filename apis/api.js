import {
	Alert
} from 'react-native';
const API_path = 'http://192.168.83.2:3000/';
var apis = {
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
			let response = await fetch(API_path + 'newfeed');
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
			let response = await fetch(API_path + 'auth/logout');
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
			let response = await fetch(API_path + 'newfeed/'+newsId);
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
	async getFriendsList(userId){
		try{
			let response = await fetch(API_path + 'friend/friend_list/' + userId);
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async getFriendsRequestList(userId){
		try{
			let response = await fetch(API_path + 'friend/friend_requests/' + userId);
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async addNewFriend(userId, friendId){
		try{
			let response = await fetch(API_path + 'friend/add_friend/' + userId +'?user_id='+ friendId, {'method': 'POST'});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async acceptFriend(userId, friendId){
		try{
			let response = await fetch(API_path + 'friend/accept_friend/' + userId +'?user_id='+ friendId, {'method': 'POST'});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	}
};
module.exports = apis;