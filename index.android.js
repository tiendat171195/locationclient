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
import ChatRoomsPage from './components/ChatRoomsPage.js';
import MapPage from './components/MapPage.js';
import SettingPage from './components/SettingPage.js';


import Login from './components/LogInScreen.js'
export default class LocationClient extends Component {
  
  render() {
    return (
      
      /*<ScrollableTabView locked={true}>
        <NewsFeedPage tabLabel="NewsFeed" />
        <ChatRoomsPage tabLabel="Chat Room" />
        <MapPage tabLabel="Map" />
        <SettingPage tabLabel="Settings" />
      </ScrollableTabView>*/
      <Login />
    );
  }
}

AppRegistry.registerComponent('LocationClient', () => LocationClient);
