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
	getFriends
} from '../actions';
import {
	DEFAULT_AVATAR
} from './images.js';
import {
	SERVER_PATH,
	MAIN_COLOR
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
			rooms_list: [],
			friends_list: [],
			//Socket
			appointments: [],
			routes: [],
			searchtext: ''
		};
		this.startNewSocket = this.startNewSocket.bind(this);
		this.addSocketCallback = this.addSocketCallback.bind(this);
		this.getSocketData = this.getSocketData.bind(this);
	}
	componentWillMount() {
		
	}
	componentDidMount() {
		this.configFCM();
		console.log(this.props.userInfo);
		this.startGeolocation();
		this.props.getRooms();
		this.props.getFriends();
		setTimeout(function() {
			SplashScreen.hide();
		}, 1500);
		
	}
	configFCM(){
		//FCM
		FCM.getFCMToken().then(async (token) => {
			console.log(token);
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
			this.state.rooms_list = [];
			for (var index = 0; index < nextProps.getRoomsResponse.data.groups.length; index++) {
				this.state.rooms_list
					.push(nextProps.getRoomsResponse.data.groups[index]);
			}
			this.startNewSocket();
		}
		if (!this.props.getFriendsResponse.fetched && nextProps.getFriendsResponse.fetched) {
			this.state.friends_list = [];
			console.log('getFriends');
			console.log(nextProps.getFriendsResponse);
			for (var i = nextProps.getFriendsResponse.data.friends.length - 1; i >= 0; i--) {
				this.state.friends_list.push({
					'name': nextProps.getFriendsResponse.data.friends[i].username,
					"_id": nextProps.getFriendsResponse.data.friends[i]._id,
					'avatar': 'https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png'
				});
			};
			this.forceUpdate();
		}
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
		console.log('startGeolocation');
		if (this.state.watchID !== null) navigator.geolocation.clearWatch(this.state.watchID);
		await navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log('Mainscreen catch position');
				this.setState({
					currentRegion: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA,
					}
				});


			},
			(error) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						console.log('Mainscreen catch position');
						this.setState({
							currentRegion: {
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LONGITUDE_DELTA,
							}
						});

					},
					(error) => {
						console.log("fail to get position");
						this.startGeolocation();
					},
					{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
				);
			},
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
		this.state.watchID = navigator.geolocation.watchPosition((position) => {
			this.setState({
				currentRegion: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA,
				}
			});

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
		for (var index = 0; index < this.state.rooms_list.length; index++) {
			this.socket.emit('get_appointments', JSON.stringify({
				"group_id": this.state.rooms_list[index]._id
			}));
			this.socket.emit('get_route', JSON.stringify({
				"group_id": this.state.rooms_list[index]._id
			}));
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

			if(giobalThis.state.appointments.find(obj => obj.group_id == data.group_id) !== undefined){
				giobalThis.state.appointments.find(obj => obj.group_id == data.group_id).appointments = tempArr;
				return;
			}
			giobalThis.state.appointments.push({
				group_id: data.group_id,
				appointments: tempArr
			});
		});

		////GET ROUTE
		this.socket.on("get_route_callback", function (data) {
			if(giobalThis.state.routes.find(obj => obj.group_id == data.group_id) !== undefined){
				let index = giobalThis.state.routes.findIndex(obj => obj.group_id == data.group_id);
				giobalThis.state.routes[index] = data;
				return;
			}
			giobalThis.state.routes.push(data);
		});
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
					onChangeText={(text) =>{
						this.state.searchtext = text;
						setTimeout(function() {
							if(giobalThis.state.searchtext == text){
								giobalThis.props.searchFriend(text);
							}
						}, 400);
						
						}} />
				<View style={{ flex: 1, backgroundColor: 'pink' }}>


					<ScrollableTabView
						renderTabBar={() => <CustomTabBar />}
						style={{ backgroundColor: MAIN_COLOR }}
						tabBarPosition="bottom"
						initialPage={0}
						locked={true}
						prerenderingSiblingsNumber={Infinity}
						onChangeTab={this.onChangeTab}>
						<ChatRoomsPage tabLabel='md-chatboxes' {...{
							userInfo: this.props.userInfo,
							currentRegion: this.state.currentRegion,
							roomsList: this.state.rooms_list,
							friendsList: this.state.friends_list,
							appointments: this.state.appointments,
							routes: this.state.routes
						}} />
						<FriendsList tabLabel='ios-people'{...{
							friendsList: this.state.friends_list
						}} />
						<MapPage tabLabel="md-locate" {...{
							userInfo: this.props.userInfo,
							roomsList: this.state.rooms_list,
							currentRegion: this.state.currentRegion,
							appointments: this.state.appointments,
							routes: this.state.routes,
						}} />
						<SettingPage tabLabel="ios-settings" {...{ 'userInfo': this.props.userInfo }} />
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
		getFriendsResponse: state.getFriendsResponse,
		getRoomsResponse: state.getRoomsResponse,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		searchFriend: (keyword) => dispatch(searchFriend(keyword)),
		getFriends: () => dispatch(getFriends()),
		getRooms: () => dispatch(getRooms()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainScreen);