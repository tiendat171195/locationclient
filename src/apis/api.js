import {
	Alert,
	AsyncStorage
} from 'react-native';
import {
	SERVER_PATH
} from '../components/type.js';
const googleAPI_key = "AIzaSyB2jkGH3HlHuXQ4OQx7wtp96mjjXIHC0rU";
var token = '';
var user_id = '';
var apis = {
	updateUserInfo(_token, _id) {
		token = _token;
		user_id = _id;
	},
	async Subscribe(fcmToken) {
		try {
			let response = await fetch(SERVER_PATH + 'notification/subscribe/',
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
			let response = await fetch(SERVER_PATH + 'notification/subscribe/',
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
	async Register(username, password, phone, email, gender, birthday, city) {
		return new Promise(async (resolve, reject) => {
			try {
				let response = await fetch(SERVER_PATH + 'auth/register/',
					{
						"method": "POST",
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
				return resolve(responseJson);

			}
			catch (error) {
				return reject(error);
			}
		})
	},
	async SignIn(username, password) {
		try {
			let response = await fetch(SERVER_PATH + 'auth/login/',
				{
					"method": "POST",
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
		catch (error) {
			console.error(error);
		}
	},
	async SignOut() {
		try {
			let response = await fetch(SERVER_PATH + 'auth/logout/',
				{
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token,
						//'user_id': user_id,
					}
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			return console.error(error);
		}
	},
	async searchFriend(keyword) { 
		
				return new Promise(async (resolve, reject) => {
					try {
						let response = await fetch(SERVER_PATH + 'search/friends?keyword='+keyword,
							{
								'method': 'GET',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'token': token,
									//'user_id': user_id,
								}
							});
						let responseJson = await response.json();
						return resolve(responseJson);
					}
					catch (error) {
						return reject(error);
					}
				})
		
		
				
			},
	async getFriendsList() { //done redux

		return new Promise(async (resolve, reject) => {
			try {
				let response = await fetch(SERVER_PATH + 'friends/',
					{
						'method': 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'token': token,
							//'user_id': user_id,
						}
					});
				let responseJson = await response.json();
				return resolve(responseJson);
			}
			catch (error) {
				return reject(error);
			}
		})


		
	},
	async getFriendsRequestList() {
		try {
			let response = await fetch(SERVER_PATH + 'friends/requests/',
				{
					'method': 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token,
						//'user_id': user_id,
					}
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async addNewFriend(friendId) {
		try {
			let response = await fetch(SERVER_PATH + 'friends/' + friendId + '/add/',
				{
					'method': 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token,
						//'user_id': user_id,
					}
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async acceptFriend(friendId) {
		try {
			let response = await fetch(SERVER_PATH + 'friends/' + friendId + '/accept/',
				{
					'method': 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token,
						//'user_id': user_id,
					}
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async deleteFriendRequest(friendId) {
		try {
			let response = await fetch(SERVER_PATH + 'friends/' + friendId + '/delete/',
				{
					'method': 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'token': token,
						//'user_id': user_id,
					}
				});
			let responseJson = await response.json();
			return responseJson;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async createNewRoom(RoomName) {
		try {
			let response = await fetch(SERVER_PATH + 'groups/',
				{
					method: "POST",
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
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async getRoomList() { //Done redux
		return new Promise(async (resolve, reject) => {
			try {
				let response = await fetch(SERVER_PATH + 'groups/',
					{
						method: "GET",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'token': token,
							//'user_id': user_id,
						}
					});
				let responseJson = await response.json();
				return resolve(responseJson);
			}
			catch (error) {
				console.error(error);
				return null;
			}
		})

		
	},
	async getRoomInfo(groupID) { //Done redux
		return new Promise(async (resolve, reject) => {
			try {
				let response = await fetch(SERVER_PATH + 'groups/',
					{
						method: "GET",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'token': token,
							//'user_id': user_id,
						}
					});
				let responseJson = await response.json();
				return resolve(responseJson);
			}
			catch (error) {
				console.error(error);
				return null;
			}
		})

		
	},
	async addNewMember(GroupID, NewMemberID) {
		try {
			let response = await fetch(SERVER_PATH + 'groups/' + GroupID + '/members?friend_id=' + NewMemberID,
				{
					method: "POST",
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
		catch (error) {
			console.error(error);
			return null;
		}
	},
	async findDirection_googleAPI(origin, destination, waypoints = []) {
		try {
			const directionSERVER_PATH = "https://maps.googleapis.com/maps/api/directions/json?";
			console.log(directionSERVER_PATH +
				"origin=" + origin.latitude + ',' + origin.longitude +
				"&destination=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let response = await fetch(directionSERVER_PATH +
				"origin=" + origin.latitude + ',' + origin.longitude +
				"&destination=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let responseJson = await response.json();
			return responseJson;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async distance_googleAPI(origin, destination) {
		try {
			const distanceSERVER_PATH = "https://maps.googleapis.com/maps/api/distancematrix/json?";
			console.log(distanceSERVER_PATH +
				"origins=" + origin.latitude + ',' + origin.longitude +
				"&destinations=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let response = await fetch(distanceSERVER_PATH +
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
	async distanceMatrix_googleAPI(origin, destination) {
		try {
			const distanceSERVER_PATH = "https://maps.googleapis.com/maps/api/distancematrix/json?";
			console.log(distanceSERVER_PATH +
				"origins=" + origin.latitude + ',' + origin.longitude +
				"&destinations=" + destination.latitude + ',' + destination.longitude +
				"&key=" + googleAPI_key);
			let response = await fetch(distanceSERVER_PATH +
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
	async getInfoLocation_googleAPI(location) {
		try {
			const geocodingSERVER_PATH = 'https://maps.googleapis.com/maps/api/geocode/json?';
			var address;
			if (typeof location === "object" && typeof location !== null) {
				address = '' + location.latitude + ',' + location.longitude;
			} else if (typeof location === 'string') {
				address = encodeURIComponent(location);
			}
			let response = await fetch(geocodingSERVER_PATH +
				'address=' + address +
				'&key=' + googleAPI_key);
			let responseJson = response.json();
			return responseJson;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
};
module.exports = apis;