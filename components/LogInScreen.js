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
	Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

import MainScreen from './MainScreen.js';
import apis from '../apis/api.js';
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
			type: type
		})
	}
	async SignIn(){
		let responseAPI = await apis.SignIn(this.state.userName, this.state.passWord);
		console.log(responseAPI);
		if(responseAPI == null){
			return;
		} 
		if(responseAPI.status == "success"){
			this._navigate(MainScreen, {'userInfo': responseAPI.userInfo});
		}
		else{
			Alert.alert(
				'Lỗi đăng nhập',
				responseAPI.message
			);
		}
	}
	async SignUp(){
		let responseAPI = await apis.SignUp(this.state.userName, this.state.passWord);
		if(responseAPI == null){
			return;
		} 
		if(responseAPI.status == 'success'){
			Alert.alert(
				'Đăng ký thành công',
				'Chúc mừng bạn đã đăng ký thành công'
			)
		}
		else{
			Alert.alert(
				'Đăng ký thất bại',
				'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng đăng ký lại'
			)
		}
	}
	checkUserInput(){
		if(this.state.userName.length < 6){
			return {status: 'error', message: 'Tên đăng nhập phải trên 6 ký tự'};
		}
		else if (this.state.passWord.length < 6) {
			return {status: 'error', message: 'Mật khẩu phải trên 6 ký tự'};
		}
		return {status:'success'};
	}
	render(){
		return(
			<View style={{backgroundColor:'#fffacd'}}>
				<Image
					style={{height: height/2.5}}
					resizeMode='center'
					source={{uri: 'http://bikersaigon.net/wp-content/uploads/2016/08/logo.png'}} />
				<Text style={{marginLeft: 20, fontWeight:'bold', fontSize: 25, color: '#00ffff'}}>Tên đăng nhập:</Text>
				<TextInput 
					style={{fontSize: 20, paddingLeft: 20}}
					onChangeText={(userName) => this.setState({userName})}
					value={this.state.text}
					placeholder="Nhập tên đăng nhập">
				</TextInput>
				<Text style={{marginLeft: 20, fontWeight:'bold', fontSize: 25}}>Mật khẩu:</Text>
				<TextInput 
					style={{fontSize: 20, paddingLeft: 20}}
					onChangeText={(passWord) => this.setState({passWord})}
					value={this.state.text}
					placeholder="Nhập mật khẩu"
					secureTextEntry={true} >
				</TextInput>
				<Button
					onPress={() => {
						var checkInfo = this.checkUserInput();
						if(checkInfo.status == 'error'){
							Alert.alert(
								'Lỗi đăng nhập',
								checkInfo.message
							);
						}else{
							this.SignIn()
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
