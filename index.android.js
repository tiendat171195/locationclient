'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  AsyncStorage
} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

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

import apis from './apis/api.js';
import SplashScreen from 'react-native-splash-screen';

export default class LocationClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false
    }
  }
  componentWillMount(){
      this.checkLoggedIn();
    
  }
  componentDidMount(){
    
  }
  async SignIn(Username, Password) {
    let responseAPI = await apis.SignIn(Username, Password);
    if (responseAPI == null) {
      return;
    }
    //console.log(responseAPI);

    if (!responseAPI.hasOwnProperty('success')) {
      this.state.logged = true;
      try {
        await AsyncStorage.setItem('LOGGED_IN', 'true');
        await AsyncStorage.setItem('USER_INFO', JSON.stringify({
          'user_id': responseAPI.user_id,
          "username": responseAPI.username,
          "password": Password,
          "token": responseAPI.user_token
        }));
      } catch (error) {
        console.error(error);
      }
      apis.updateUserInfo(responseAPI.user_token, responseAPI.user_id);
      setTimeout(()=>{
        SplashScreen.hide();
      }, 500);
      Actions.mainscreen({
        'userInfo': {
          'token': responseAPI.user_token,
          'user_id': responseAPI.user_id,
          'username': responseAPI.username
        }
      });
      
    }
    else {
      SplashScreen.hide();
      Alert.alert(
        'Lỗi đăng nhập',
        responseAPI.status_message
      );
    }
  }
  async checkLoggedIn() {
    try {
      const isLoggedIn = await AsyncStorage.getItem('LOGGED_IN');
      if (isLoggedIn == 'true') {
        var userInfo = await AsyncStorage.getItem('USER_INFO');
        userInfo = JSON.parse(userInfo);
        if (userInfo != null) {
          await this.SignIn(userInfo.username, userInfo.password);
        }
      }
      else{
        SplashScreen.hide();
      }
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    return (
      <Router
        >
        <Scene key="root" hideNavBar={true}>
          <Scene key="login" component={Login} initial={!this.state.logged} />
          <Scene key="register" component={Register} />
          <Scene key="mainscreen" component={MainScreen} initial={this.state.logged} />
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
