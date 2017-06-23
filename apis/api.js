import {
	Alert,
	AsyncStorage
} from 'react-native';
//const API_path = 'http://192.168.83.2:3000/';
const API_path = ' https://stormy-woodland-18039.herokuapp.com/';
const googleAPI_key = "AIzaSyB2jkGH3HlHuXQ4OQx7wtp96mjjXIHC0rU";
var token = '';
var user_id = '';
var apis = {
	updateUserInfo(_token, _id){
			token = _token;
			user_id = _id;
	},
	async Subscribe(fcmToken) {
		try {
			let response = await fetch(API_path + 'notification/subscribe/',
				{
					"method": "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token
					},
					body: JSON.stringify({
						fcm_token: fcmToken
					})
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async Unsubscribe(fcmToken) {
		try {
			let response = await fetch(API_path + 'notification/subscribe/',
				{
					"method": "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token
					},
					body: JSON.stringify({
						fcm_token: fcmToken
					})
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async SignUp(username, password, phone, email, gender, birthday, city){
		try{
			let response = await fetch(API_path + 'auth/register/', 
			{"method": "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						username: username,
						password: password,
						phone: phone,
						email: email,
						gender: gender,
						birthday: birthday,
						city: city
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
			let response = await fetch(API_path + 'auth/login/', 
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
					//'user_id': user_id,
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
			let response = await fetch(API_path + 'auth/logout/',
			{method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					//'user_id': user_id,
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
					//'user_id': user_id,
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
					//'user_id': user_id,
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
					//'user_id': user_id,
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
					//'user_id': user_id,
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
			let response = await fetch(API_path + 'friends/' + friendId +'/add/', 
			{'method': 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					//'user_id': user_id,
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
			let response = await fetch(API_path + 'friends/' + friendId + '/accept/', 
			{'method': 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					//'user_id': user_id,
				}});
			let responseJson = await response.json();
			return responseJson;
		}
		catch(error){
			console.error(error);
			return null;
		}
	},
	async deleteFriendRequest(friendId){
		try{
			let response = await fetch(API_path + 'friends/' + friendId + '/delete/', 
			{'method': 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': token,
					//'user_id': user_id,
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
					//'user_id': user_id,
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
					//'user_id': user_id,
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
					//'user_id': user_id,
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
	async findDirection_googleAPI(origin, destination, waypoints = []){
		try{
			const directionAPI_path = "https://maps.googleapis.com/maps/api/directions/json?";
			console.log(directionAPI_path + 
										"origin=" + origin.latitude + ',' + origin.longitude + 
										"&destination=" + destination.latitude + ',' + destination.longitude + 
										"&key=" + googleAPI_key);
			let response = await fetch(directionAPI_path + 
										"origin=" + origin.latitude + ',' + origin.longitude + 
										"&destination=" + destination.latitude + ',' + destination.longitude + 
										"&key=" + googleAPI_key);
			let responseJson = await response.json();
			return responseJson;
		} catch(error){
			console.error(error);
			return null;
		}
	},
	async distance_googleAPI(origin, destination){
		try{
			const distanceAPI_path = "https://maps.googleapis.com/maps/api/distancematrix/json?";
			console.log(distanceAPI_path +
				"origins=" + origin.latitude + ',' + origin.longitude +
				"&destinations=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let response = await fetch(distanceAPI_path + 
										"origins=" + origin.latitude + ',' + origin.longitude + 
										"&destinations=" + destination.latitude + ',' + destination.longitude + 
										"&key=" + googleAPI_key);
			let responseJson = await response.json();
			if (responseJson.rows[0].elements[0].hasOwnProperty("status") && responseJson.rows[0].elements[0].status === "ZERO_RESULTS"){
				return -1;
			}
			return responseJson.rows[0].elements[0].distance.value;
		} catch(error){
			console.error(error);
			return null;
		}
	},
	async distanceMatrix_googleAPI(origin, destination) {
		try {
			const distanceAPI_path = "https://maps.googleapis.com/maps/api/distancematrix/json?";
			console.log(distanceAPI_path +
				"origins=" + origin.latitude + ',' + origin.longitude +
				"&destinations=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let response = await fetch(distanceAPI_path +
				"origins=" + origin.latitude + ',' + origin.longitude +
				"&destinations=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let responseJson = await response.json();
			if (responseJson.rows[0].elements[0].hasOwnProperty("status") && responseJson.rows[0].elements[0].status === "ZERO_RESULTS") {
				return -1;
			}
			return responseJson.rows[0].elements[0].distance.value;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async getInfoLocation_googleAPI(location){
		try{
			const geocodingAPI_path = 'https://maps.googleapis.com/maps/api/geocode/json?';
			var address;
			if(typeof location === "object" && typeof location !== null){
				address = '' + location.latitude + ',' + location.longitude;
			}else if(typeof location === 'string'){
				address = encodeURIComponent(location);
			}
			let response = await fetch(geocodingAPI_path +
										'address='+ address +
										'&key='+ googleAPI_key);
			let responseJson = response.json();
			return responseJson;
		}catch(error){
			console.error(error);
			return null;
		}
	},
};
module.exports = apis;