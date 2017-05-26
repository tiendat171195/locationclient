'use strict';
import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	Button,
	Alert,
	BackAndroid,
	Dimensions,
	Image,
	AsyncStorage
} from 'react-native';
import {Actions} from "react-native-router-flux";


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

import MainScreen from './MainScreen.js';
import TabBarExample from './MainScreen.js';
import apis from '../apis/api.js';
export default class Login extends Component{
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}
	componentWillMount(){
		//Handle Back Android
		/*BackAndroid.addEventListener("hardwareBackPress", () => {
			if (Actions.length > 1) {
				Actions.pop();
				return true // do not exit app
			} else {
				return false // exit app
			}
	    })*/

		this.checkLoggedIn();
	}

	async SignIn(Username, Password){
		let responseAPI = await apis.SignIn(Username, Password);
		if(responseAPI == null){
			return;
		}
		//console.log(responseAPI);
		
		if(!responseAPI.hasOwnProperty('success')){
			try {
				await AsyncStorage.setItem('LOGGED_IN', 'true');
				await AsyncStorage.setItem('USER_INFO', JSON.stringify({'user_id': responseAPI.user_id, 
																		"username": responseAPI.username, 
																		"password": Password, 
																		"token":responseAPI.user_token}));
			} catch (error) {
				console.error(error);
			}
			apis.updateUserInfo(responseAPI.user_token, responseAPI.user_id);
			Actions.mainscreen({'userInfo': {
									'token': responseAPI.user_token, 
									'user_id': responseAPI.user_id,
									'username': responseAPI.username}});
		}
		else{
			Alert.alert(
				'Lỗi đăng nhập',
				responseAPI.status_message
			);
		}
	}
	async SignUp(){
		let responseAPI = await apis.SignUp(this.state.username, this.state.password);
		
		if(!responseAPI.hasOwnProperty('success')){
			Alert.alert(
				'Đăng ký thành công',
				'Chúc mừng bạn đã đăng ký thành công'
			)
		}
		else{
			Alert.alert(
				'Đăng ký thất bại',
				responseAPI.status_message
			)
		}
	}
	checkUserInput(){
		if(this.state.username.length < 6){
			return {status: 'error', message: 'Tên đăng nhập phải trên 6 ký tự'};
		}
		else if (this.state.password.length < 6) {
			return {status: 'error', message: 'Mật khẩu phải trên 6 ký tự'};
		}
		return {status:'success'};
	}
	async checkLoggedIn(){
		try {
			const isLoggedIn = await AsyncStorage.getItem('LOGGED_IN');
			if (isLoggedIn == 'true'){
				var userInfo = await AsyncStorage.getItem('USER_INFO');
				userInfo = JSON.parse(userInfo);
				if(userInfo != null){
					this.SignIn(userInfo.username, userInfo.password);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	render(){
		return(
			<View style={{backgroundColor:'#fffacd', flex:1}}>
				<Image
					style={{height: height/2.5}}
					resizeMode='center'
					source={{uri: 'http://bikersaigon.net/wp-content/uploads/2016/08/logo.png'}} />
				<Text style={{marginLeft: 20, fontWeight:'bold', fontSize: 25}}>Tên đăng nhập:</Text>
				<TextInput 
					style={{fontSize: 20, paddingLeft: 20}}
					onChangeText={(userName) => this.setState({username: userName})}
					value={this.state.username}
					placeholder="Nhập tên đăng nhập">
				</TextInput>
				<Text style={{marginLeft: 20, fontWeight:'bold', fontSize: 25}}>Mật khẩu:</Text>
				<TextInput 
					style={{fontSize: 20, paddingLeft: 20}}
					onChangeText={(passWord) => this.setState({password: passWord})}
					value={this.state.password}
					placeholder="Nhập mật khẩu"
					secureTextEntry={true} >
				</TextInput>
				<Button
					style={{width: 50}}
					onPress={() => {
						var checkInfo = this.checkUserInput();
						if(checkInfo.status == 'error'){
							Alert.alert(
								'Lỗi đăng nhập',
								checkInfo.message
							);
						}else{
							this.SignIn(this.state.username, this.state.password);
						}
						}}
					title="Đăng nhập"
					color="#841584" />
				<Button
					onPress={() => this.SignUp()}
					title="Đăng ký"
					color="#848384" />
			</View>
		);
	}
}
