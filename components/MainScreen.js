'use strict'
import React, {Component} from 'react';
import {
	
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import NewsFeedPage from './NewsFeedPage.js';
import ChatRoomsPage from './ChatRoomsPage.js';
import MapPage from './MapPage.js';
import SettingPage from './SettingPage.js'

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
          locked={true}
          style={{backgroundColor:'orange'}}>
		        <NewsFeedPage tabLabel="Tin tức" navigator={this.props.navigator} {...{'userInfo':this.props.userInfo}} />
		        <ChatRoomsPage tabLabel="Trò chuyện" navigator={this.props.navigator} giobalThis={this} {...{'userInfo':this.props.userInfo}}/>
		        <MapPage tabLabel="Bản đồ" navigator={this.props.navigator} groupID={this.state._group_id} {...{'userInfo':this.props.userInfo}}/>
		        <SettingPage tabLabel="Thiết lập" navigator={this.props.navigator} {...{'userInfo':this.props.userInfo}}/>
		    </ScrollableTabView>
		);
	}
}

