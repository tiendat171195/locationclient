/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import io from 'socket.io-client/dist/socket.io.js';

import NewsFeedPage from './components/NewsFeedPage.js';
import ChatRoomPage from './components/ChatRoom.js';
import MapPage from './components/MapPage.js';
import SettingPage from './components/SettingPage.js';



export default class LocationClient extends Component {
  constructor(props){
    super(props);
    
  }
  render() {
    return (
      <ScrollableTabView locked={true}>
        <NewsFeedPage tabLabel="NewsFeed" />
        <ChatRoomPage tabLabel="Chat Room" />
        <MapPage tabLabel="Map" />
        <SettingPage tabLabel="Settings" />
      </ScrollableTabView>
    );
  }
}

AppRegistry.registerComponent('LocationClient', () => LocationClient);
