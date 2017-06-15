'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Alert
} from 'react-native';
import { Scene, Router } from 'react-native-router-flux';

//Import screens
import Register from "./components/Register.js";
import Login from "./components/LogInScreen.js";
import MainScreen from "./components/MainScreen.js";
import ChatRoomsPage from './components/ChatRoomsPage.js';
import MapPage from './components/MapPage.js';
import SettingPage from './components/SettingPage.js';
import ChatRoom from './components/ChatRoom';
import CreateRoom from './components/CreateRoom'
import RoomSetting from './components/RoomSetting.js';
import FriendsList from './components/FriendsList.js';

import SplashScreen from 'react-native-splash-screen';

export default class LocationClient extends Component {
  constructor(props) {
    super(props);

    


  }
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar={true}>
          <Scene key="login" component={Login} initial={true} />
          <Scene key="register" component={Register} />
          <Scene key="mainscreen" component={MainScreen} />
          <Scene key="chatroomspage" component={ChatRoomsPage}/>
          <Scene key="chatroom" component={ChatRoom} />
          <Scene key="roomsetting" component={RoomSetting} />
          <Scene key="createroom" component={CreateRoom} />
          <Scene key="map" component={MapPage} />
          <Scene key="info" component={SettingPage} />
          <Scene key="friendslist" component={FriendsList} />
        </Scene>
      </Router>

    );
  }
}

AppRegistry.registerComponent('LocationClient', () => LocationClient);
