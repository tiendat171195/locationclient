'use strict'
import React, { Component } from 'react';
import {
	View,
	ToolbarAndroid,
	Alert,
	Text,
	ScrollView,
	StyleSheet,
	Dimensions,
	Image,
} from 'react-native';
import { Actions, ActionConst } from "react-native-router-flux";
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import CustomTabBar from './CustomTabBar';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import ChatRoomsPage from './ChatRoomsPage.js';
import FriendsList from './FriendsList.js';
import MapPage from './MapPage.js';
import SettingPage from './SettingPage.js';
import Notifications from './Notifications.js';
import io from 'socket.io-client/dist/socket.io.js';
import { Card, ListItem } from 'react-native-elements';
import Search from 'react-native-search-box';
import apis from '../apis/api.js';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import {
	searchFriend,
	getRooms,
	getUserInfo,
	updateGPS,
	updateAppointments,
	updateRoutes,
	updateSocket,
} from '../actions';
import {
	DEFAULT_AVATAR
} from './images.js';
import {
	SERVER_PATH,
	MAIN_COLOR,
	TOOLBAR_HEIGHT,
} from './type.js';
var giobalThis;
class MainScreen extends Component {
	constructor(props) {
		super(props);
		giobalThis = this;
		this.state = {
			isSearching: false,
			currentRegion: null,
			watchID: null,
			//Socket
			appointments: [],
			routes: [],
			searchtext: '',
		};
		this.startNewSocket = this.startNewSocket.bind(this);
		this.addSocketCallback = this.addSocketCallback.bind(this);
		this.getSocketData = this.getSocketData.bind(this);
	}
	componentWillMount() {
		console.log('mainscreen');
	}
	async componentDidMount() {
		SplashScreen.hide()
		this.configFCM();
		//this.props.startGeolocation();
		await this.props.getRooms();
		await this.props.getUserInfo(this.props.userInfo.user_id);
		this.startGeolocation();
		setTimeout(function () {
			SplashScreen.hide();
		}, 1500);

	}
	configFCM() {
		//FCM
		FCM.getFCMToken().then(async (token) => {

			let UnsubscribeAPI = await apis.Unsubscribe(token);
			/* let responseAPI = await apis.Subscribe(token);
			console.log(responseAPI);
			if (responseAPI.status_code === 200) {
				console.log('Subscribe thanh cong');

			} */
			// store fcm token in your server
		});
		this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
			// there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
			if (notif.local_notification) {
				//this is a local notification
				console.log("local_notification");
			}
			if (notif.opened_from_tray) {
				//app is open/resumed because user clicked banner
				console.log("opened_from_tray");
			}
			//await someAsyncCall();
		});
		this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, async (token) => {
			console.log('first');
			console.log(token);
			let responseAPI = await apis.Subscribe(token);
			// fcm token may not be available on first load, catch it here
		});
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.getRoomsResponse.fetched && nextProps.getRoomsResponse.fetched) {
			this.startNewSocket();
		}
		/* if (!this.props.getFriendsResponse.fetched && nextProps.getFriendsResponse.fetched) {
			this.forceUpdate();
		} */
	}
	onActionSelected(position) {
		switch (position) {
			case 0:

				break;
			case 1:

				break;
			case 2:

				break;
			default:
				break;
		}
	}
	onChangeTab(index, ref) {
		switch (index) {
			case 0:
				//Actions.chatroomspage({ type: ActionConst.REFRESH });
				break;
			case 1:
				//Actions.map({ type: ActionConst.RESET });
				break;
			case 2:
				//Actions.info({ type: ActionConst.FOCUS });
				break;
		}
	}
	async addNewFriend(friendId) {
		try {
			let responseAPI = await apis.addNewFriend(friendId);
			Alert.alert(
				"Thông báo",
				'Yêu cầu kết bạn đã được gửi đến: ' + responseAPI.username);
		} catch (error) {
			console.error(error);
		}
	}
	async startGeolocation() {
		if (this.state.watchID !== null) navigator.geolocation.clearWatch(this.state.watchID);
		await navigator.geolocation.getCurrentPosition(
			(position) => {
				this.props.updateGPS(position.coords);
				if (this.props.getSocketResponse.data !== null && this.props.getRoomsResponse.data.groups !== undefined && this.props.getRoomsResponse.data.groups.length > 0) {

					this.props.getSocketResponse.data.emit('update_latlng', JSON.stringify({
						"user_id": this.props.userInfo.user_id,
						"group_id": this.props.getRoomsResponse.data.groups[0]._id,
						"latlng": {
							"lat": position.coords.latitude,
							"lng": position.coords.longitude
						}
					}));
					this.calculateDistance();

				}
			},
			(error) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						this.props.updateGPS(position.coords);
						if (this.props.getSocketResponse.data !== null && this.props.getRoomsResponse.data.groups !== undefined && this.props.getRoomsResponse.data.groups.length > 0) {

							this.props.getSocketResponse.data.emit('update_latlng', JSON.stringify({
								"user_id": this.props.userInfo.user_id,
								"group_id": this.props.getRoomsResponse.data.groups[0]._id,
								"latlng": {
									"lat": position.coords.latitude,
									"lng": position.coords.longitude
								}
							}));
							this.calculateDistance();

						}
					},
					(error) => {
						console.log("fail to get position");
						this.startGeolocation();
					},
					{ enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
				);
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
		);
		this.state.watchID = navigator.geolocation.watchPosition((position) => {
			this.props.updateGPS(position.coords);
			if (this.props.getSocketResponse.data !== null && this.props.getRoomsResponse.data.groups !== undefined && this.props.getRoomsResponse.data.groups.length > 0) {
				this.props.getSocketResponse.data.emit('update_latlng', JSON.stringify({
					"user_id": this.props.userInfo.user_id,
					"group_id": this.props.getRoomsResponse.data.groups[0]._id,
					"latlng": {
						"lat": position.coords.latitude,
						"lng": position.coords.longitude
					}
				}));
				this.calculateDistance();

			}
		})
	}

	//Socket ---------------------------------------------------------------

	startNewSocket() {
		console.log('start socket main');
		if (this.socket !== undefined) this.socket.disconnect();
		this.socket = io(SERVER_PATH + 'maps?group_id=', { jsonp: false });
		this.socket.emit('authenticate', { "token": this.props.userInfo.user_token });
		this.socket.on('authenticated', function () {
			console.log('ket noi toi socket main');
			giobalThis.props.updateSocket(giobalThis.socket);
			giobalThis.addSocketCallback();
			giobalThis.getSocketData();
		});
		this.socket.on('unauthorized', function (msg) {
			console.log('khong the ket noi toi socket main');
			console.log("unauthorized: " + JSON.stringify(msg.data));
		});

	}
	getSocketData() {
		this.state.appointments = [];
		this.state.routes = [];
		for (var index = 0; index < this.props.getRoomsResponse.data.groups.length; index++) {
			console.log('test---------------');
			console.log(JSON.stringify({
				"group_id": this.props.getRoomsResponse.data.groups[index]._id
			}))
			this.socket.emit('get_appointments', JSON.stringify({
				"group_id": this.props.getRoomsResponse.data.groups[index]._id
			}));

			/* 	this.socket.emit('get_starting_point', JSON.stringify({
					"group_id": this.props.getRoomsResponse.data.groups[index]._id
				}));
				this.socket.emit('get_route', JSON.stringify({
					"group_id": this.props.getRoomsResponse.data.groups[index]._id
				})); */
		}
		this.forceUpdate();
	}
	addSocketCallback() {
		//GET APPOINTMENTS
		this.socket.on("get_appointments_callback", function (data) {
			let tempArr = [];
			data.appointments.map(u => {
				tempArr.push({
					"_id": u._id,
					"address": u.address,
					"start_time": u.start_time,
					"end_time": u.end_time,
					"users": u.users,
					"coordinate":
					{
						"latitude": u.latlng.lat,
						"longitude": u.latlng.lng
					}
				})
			});

			if (giobalThis.state.appointments.find(obj => obj.group_id == data.group_id) !== undefined) {
				giobalThis.state.appointments.find(obj => obj.group_id == data.group_id).appointments = tempArr;
				return;
			}
			giobalThis.state.appointments.push({
				group_id: data.group_id,
				appointments: tempArr
			});
			giobalThis.props.updateAppointments(giobalThis.state.appointments)
		});

		////ADD APPOINTMENT
		this.socket.on("add_appointment_callback", function (data) {
			console.log("add_appointment");
			let appointment = {
				"_id": data.appointment_id,
				"address": data.address,
				"start_time": data.start_time,
				"end_time": data.end_time,
				"users": [],
				"coordinate":
				{
					"latitude": data.latlng.lat,
					"longitude": data.latlng.lng
				}
			}


			if (giobalThis.state.appointments.find(obj => obj.group_id == data.group_id) !== undefined) {
				giobalThis.state.appointments.find(obj => obj.group_id == data.group_id).appointments.push(appointment);
				giobalThis.props.updateAppointments(giobalThis.state.appointments);
				return;
			}
			giobalThis.state.appointments.push({
				group_id: data.group_id,
				appointments: [appointment]
			});
			giobalThis.props.updateAppointments(giobalThis.state.appointments)
		});




		////GET ROUTE
		this.socket.on("get_route_callback", function (data) {
			if (giobalThis.state.routes.find(obj => obj.group_id == data.group_id) !== undefined) {
				let index = giobalThis.state.routes.findIndex(obj => obj.group_id == data.group_id);
				giobalThis.state.routes[index].start_latlng = data.start_latlng;
				giobalThis.state.routes[index].end_latlng = data.end_latlng;
				giobalThis.state.routes[index].start_radius = data.start_radius;
				giobalThis.state.routes[index].end_radius = data.end_radius;
				giobalThis.state.routes[index].arriving_users = data.arriving_users;
				giobalThis.state.routes[index].destination_users = data.destination_users;
				giobalThis.state.routes[index].stopovers = data.stopovers;
				return;
			}
			giobalThis.state.routes.push(data);
			giobalThis.props.updateRoutes(giobalThis.state.routes);
		});
		/* 
				this.socket.on('get_starting_point_callback', function (data) {
					console.log('get_starting_point_callback');
					console.log(data);
					if (giobalThis.state.routes.find(obj => obj.group_id == data.group_id) !== undefined) {
						let index = giobalThis.state.routes.findIndex(obj => obj.group_id == data.group_id);
						giobalThis.state.routes[index].start_date = data.start_time;
						return;
					}
					giobalThis.state.routes.push(data);
		
					giobalThis.props.updateRoutes(giobalThis.state.routes);
				});
		
				this.socket.on('get_ending_point_callback', function (data) {
					if (giobalThis.state.routes.find(obj => obj.group_id == data.group_id) !== undefined) {
						let index = giobalThis.state.routes.findIndex(obj => obj.group_id == data.group_id);
						giobalThis.state.routes[index] = data;
						return;
					}
					giobalThis.state.routes.push(data);
					giobalThis.props.updateRoutes(giobalThis.state.routes);
				});
		 */
	}

	calculateDistance() {
		console.log('--------calculateDistance');
		let currentLocation = this.props.getLocationResponse.data;
		let appointments = this.props.getAppointmentsResponse.data;
		console.log(currentLocation);
		console.log(appointments);
	}





	render() {
		return (
			<View style={{ flex: 1 }}>
				<Search
					ref="searchbox"
					placeholder="Tìm kiếm"
					cancelTitle="Hủy"
					backgroundColor={MAIN_COLOR}
					contentWidth={30}
					onFocus={() => { this.setState({ isSearching: true }); console.log('onFocus') }}
					onCancel={() => { this.setState({ isSearching: false }); console.log('onCancel') }}
					onChangeText={(text) => {
						this.state.searchtext = text;
						setTimeout(function () {
							if (giobalThis.state.searchtext == text) {
								giobalThis.props.searchFriend(text);
							}
						}, 400);

					}} />
				<View style={{ flex: 1 }}>


					<ScrollableTabView
						renderTabBar={() => <CustomTabBar />}
						style={{ backgroundColor: 'white' }}
						tabBarPosition="bottom"
						initialPage={0}
						locked={true}
						prerenderingSiblingsNumber={Infinity}
						onChangeTab={this.onChangeTab}>
						<ChatRoomsPage tabLabel='md-chatboxes' {...{
							userInfo: this.props.userInfo,
							//currentRegion: this.state.currentRegion,
							roomsList: this.props.getRoomsResponse.data.groups,
							appointments: this.state.appointments,
							routes: this.state.routes
						}} />
						<FriendsList tabLabel='ios-people' {...{
							userInfo: this.props.userInfo
						}} />
						<MapPage tabLabel="md-locate" {...{
							userInfo: this.props.userInfo,
						}} />
						<Notifications tabLabel="md-notifications" />
						<SettingPage tabLabel="ios-settings" />
					</ScrollableTabView>

					{this.state.isSearching &&
						<ScrollView showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							style={{ flex: 1, backgroundColor: 'white', ...StyleSheet.absoluteFillObject }}>
							{this.props.searchingFriendResponse.data.hasOwnProperty('friends') ?
								<Card containerStyle={{ margin: 0, padding: 0 }} >
									{
										this.props.searchingFriendResponse.data.friends.map((friend, i) => {
											return (
												<ListItem
													key={i}
													roundAvatar
													rightIcon={{ name: 'person-add' }}
													rightIconOnPress={() => { this.addNewFriend(friend._id) }}
													title={friend.username}
													//avatar={{ uri: friend.avatar }}
													avatar={{ uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/16388040_1019171961520719_4744401854953494000_n.jpg?oh=7537148cd1b41a9cf3019f78433fdad4&oe=5A0FA5CC" }}
													onPress={() => console.log('Clicked')} />
											)
										})
									}
								</Card>
								: <Text style={{ alignSelf: 'center' }}>Không có kết quả tìm kiếm</Text>}
						</ScrollView>}
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		searchingFriendResponse: state.searchingFriendResponse,
		getRoomsResponse: state.getRoomsResponse,
		getUserInfoResponse: state.getUserInfoResponse,
		getLocationResponse: state.getLocationResponse,
		getAppointmentsResponse: state.getAppointmentsResponse,
		getSocketResponse: state.getSocketResponse,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		searchFriend: (keyword) => dispatch(searchFriend(keyword)),
		getRooms: () => dispatch(getRooms()),
		getUserInfo: (UserID) => dispatch(getUserInfo(UserID)),
		updateGPS: (location) => dispatch(updateGPS(location)),
		updateAppointments: (appointments) => dispatch(updateAppointments(appointments)),
		updateRoutes: (routes) => dispatch(updateRoutes(routes)),
		updateSocket: (socket) => dispatch(updateSocket(socket)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainScreen);