'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  AsyncStorage,
  View
} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import store from "./configStore.js";

const RouterWithRedux = connect()(Router);

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
import NewAppointment from './components/NewAppointment.js';
import NewRoute from './components/NewRoute.js';
import apis from './apis/api.js';
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {
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
        'userInfo': responseAPI
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
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="root" hideNavBar={true}>
            <Scene key="login" component={Login} initial={!this.state.logged} />
            <Scene key="register" component={Register} />
            <Scene key="mainscreen" component={MainScreen} initial={this.state.logged} />
            <Scene key="chatroomspage" component={ChatRoomsPage} />
            <Scene key="chatroom" component={ChatRoom} />
            <Scene key="roomsetting" component={RoomSetting} />
            <Scene key='newappointment' component={NewAppointment} />
            <Scene key='newroute' component={NewRoute} />
            <Scene key="createroom" component={CreateRoom} />
            <Scene key="map" component={MapPage} />
            <Scene key="info" component={SettingPage} />
            <Scene key="friendslist" component={FriendsList} />
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

