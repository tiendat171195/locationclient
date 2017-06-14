'use strict'
import React, {Component} from 'react';
import {
	View,
	ToolbarAndroid
} from 'react-native';
import {Actions} from "react-native-router-flux";
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomTabBar from './CustomTabBar';

import NewsFeedPage from './NewsFeedPage.js';
import ChatRoomsPage from './ChatRoomsPage.js';
import MapPage from './MapPage.js';
import SettingPage from './SettingPage.js';
export default class MainScreen extends Component{
	constructor(props){
		super(props);
		this.state = {
			_group_id: '',
		};
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
				
				<ScrollableTabView
					renderTabBar={()=><CustomTabBar />}
					style={{backgroundColor:'sandybrown'}}
					tabBarPosition="bottom"
					initialPage={0}
					onChangeTab = {this.onChangeTab}>
					<ChatRoomsPage tabLabel="ios-chatboxes" {...{'userInfo':this.props.userInfo}}/>
					<MapPage tabLabel="md-locate" groupID={this.state._group_id} {...{'userInfo':this.props.userInfo}}/>
					<SettingPage tabLabel="ios-settings" {...{'userInfo':this.props.userInfo}}/>
				</ScrollableTabView>
			</View>
		);
	}
}

