'use strict';
import React, { Component } from 'react';
import {
	View,
	TextInput,
	Button,
	Alert,
	BackAndroid
} from 'react-native';

import MainScreen from './MainScreen.js';

export default class Login extends Component{
	constructor(props){
		super(props);
		//Handle Back Android
		BackAndroid.addEventListener("hardwareBackPress", () => {
			if (this.props.navigator.getCurrentRoutes().length > 1) {
				console.log("back pressed");
				this.props.navigator.pop();
				return true // do not exit app
			} else {
				return false // exit app
			}
	    })

		//For test
		//this._navigate(MainScreen);
		////////////////////
		this.state = {
			userName: '',
			passWord: ''
		};
	}
	_navigate(nextScreen, props, type='normal'){
		this.props.navigator.push({
			component: nextScreen,
			passProps: props,

		})
	}
	SignIn(){
		fetch('http://192.168.73.2:3000/auth/login', 
			{"method": "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			    username: this.state.userName,
			    password: this.state.passWord,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			Alert.alert(
				responseData.status,
				responseData.message
			);
			if(responseData.status === "success"){
				this._navigate(MainScreen, {'userInfo': responseData.userInfo});
			}
		})
		.catch((error) => {
			console.error(error);
			return null;
		})
		.done();
	}
	SignUp(){
		fetch('http://192.168.73.2:3000/auth/register', 
			{method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			    username: this.state.userName,
			    password: this.state.passWord,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			Alert.alert(
				responseData.status,
				responseData.message
			);
		})
		.catch((error) => {
	        console.error(error);
	        return null;
	    })
		.done();
	}
	render(){
		return(
			<View>
			<TextInput 
				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
				onChangeText={(userName) => this.setState({userName})}
				value={this.state.text}
				placeholder="Nhập tên đăng nhập">
			</TextInput>
			<TextInput 
				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
				onChangeText={(passWord) => this.setState({passWord})}
				value={this.state.text}
				placeholder="Nhập mật khẩu" >
			</TextInput>
			<Button
				onPress={() => this.SignIn()}
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
