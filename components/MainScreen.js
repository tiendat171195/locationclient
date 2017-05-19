'use strict'
import React, {Component} from 'react';
import {
	
} from 'react-native';

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
	render(){
		return (
			<ScrollableTabView
				renderTabBar={()=><CustomTabBar />}
         		style={{backgroundColor:'sandybrown'}}
				tabBarPosition="bottom">
		        <ChatRoomsPage tabLabel="ios-chatboxes" navigator={this.props.navigator} giobalThis={this} {...{'userInfo':this.props.userInfo}}/>
		        <MapPage tabLabel="md-locate" navigator={this.props.navigator} groupID={this.state._group_id} {...{'userInfo':this.props.userInfo}}/>
		        <SettingPage tabLabel="ios-settings" navigator={this.props.navigator} {...{'userInfo':this.props.userInfo}}/>
		    </ScrollableTabView>
		);
	}
}

