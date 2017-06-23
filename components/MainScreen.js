'use strict'
import React, {Component} from 'react';
import {
	View,
	ToolbarAndroid,
	Alert
} from 'react-native';
import {Actions} from "react-native-router-flux";
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomTabBar from './CustomTabBar';

import NewsFeedPage from './NewsFeedPage.js';
import ChatRoomsPage from './ChatRoomsPage.js';
import MapPage from './MapPage.js';
import SettingPage from './SettingPage.js';

import Search from 'react-native-search-box';
import apis from '../apis/api.js';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

export default class MainScreen extends Component{
	constructor(props){
		super(props);
		this.state = {
			_group_id: '',
		};
	}
	componentWillMount(){
		//FCM
		FCM.requestPermissions(); // for iOS
		FCM.getFCMToken().then(async (token) => {
			console.log(token);
			let UnsubscribeAPI = await apis.Unsubscribe(token);
			let responseAPI = await apis.Subscribe(token);
			console.log(responseAPI);
			if (responseAPI.status_code === 200) {
				console.log('Subscribe thanh cong');
				
			}
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
	onChangeTab(index, ref){
		switch(index){
			case 0:
				Actions.chatroomspage({type: ActionConst.REFRESH});
				break;
			case 1:
				Actions.map({type: ActionConst.REFRESH});
				break;
			case 2:
				Actions.info({type: ActionConst.REFRESH});
				break;
		}
	}
	render(){
		return (
			<View style={{flex:1}}>
				<Search
					ref="searchbox"
					placeholder="Tìm kiếm"
					cancelTitle="Hủy"
					backgroundColor="sandybrown"
					contentWidth={30} />
				<ScrollableTabView
					renderTabBar={()=><CustomTabBar />}
					style={{backgroundColor:'sandybrown'}}
					tabBarPosition="bottom"
					initialPage={0}
					locked ={true}
					onChangeTab = {this.onChangeTab}>
					<ChatRoomsPage tabLabel="ios-chatboxes" {...{'userInfo':this.props.userInfo}}/>
					<MapPage tabLabel="md-locate" groupID={this.state._group_id} {...{'userInfo':this.props.userInfo}}/>
					<SettingPage tabLabel="ios-settings" {...{'userInfo':this.props.userInfo}}/>
				</ScrollableTabView>
			</View>
		);
	}
}

