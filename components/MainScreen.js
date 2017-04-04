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
	render(){
		return (
			<ScrollableTabView>
		        <NewsFeedPage tabLabel="NewsFeed" navigator={this.props.navigator} />
		        <ChatRoomsPage tabLabel="Chat Room" navigator={this.props.navigator}/>
		        <MapPage tabLabel="Map" navigator={this.props.navigator}/>
		        <SettingPage tabLabel="Settings" navigator={this.props.navigator}/>
		    </ScrollableTabView>
		);
	}
}
