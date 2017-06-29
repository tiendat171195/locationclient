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
	AsyncStorage,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	findNodeHandle,
	KeyboardAvoidingView 
} from 'react-native';
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

import MainScreen from './MainScreen.js';
import TabBarExample from './MainScreen.js';
import apis from '../apis/api.js';
import {
	MAIN_COLOR,
	MAIN_FONT,
	MAIN_TEXT_COLOR,
	PLACEHOLDER_TEXT_COLOR,
	MAIN_COLOR_DARK
} from './type.js';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			viewRef: null,
		};
	}
	componentWillMount() {
		//Handle Back Android
		/*BackAndroid.addEventListener("hardwareBackPress", () => {
			if (Actions.length > 1) {
				Actions.pop();
				return true // do not exit app
			} else {
				return false // exit app
			}
	    })*/
	}

	async SignIn(Username, Password) {
		let responseAPI = await apis.SignIn(Username, Password);
		if (responseAPI == null) {
			return;
		}
		console.log(responseAPI);

		if (!responseAPI.hasOwnProperty('success')) {
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
			console.log(responseAPI);
			Actions.mainscreen({
				'userInfo': responseAPI
			});
		}
		else {
			Alert.alert(
				'Lỗi đăng nhập',
				responseAPI.status_message
			);
		}
	}

	checkUserInput() {
		if (this.state.username.length < 6) {
			return { status: 'error', message: 'Tên đăng nhập phải trên 6 ký tự' };
		}
		else if (this.state.password.length < 6) {
			return { status: 'error', message: 'Mật khẩu phải trên 6 ký tự' };
		}
		return { status: 'success' };
	}
	render() {
		return (
			<KeyboardAvoidingView
			  style={{
				flex: 1,
				backgroundColor: MAIN_COLOR,
				justifyContent: 'space-between'
			}}>
				<Image
				source={require('../assets/logo/logo_togo.png')}
					resizeMode='contain'
					style={{
						height: 200,
						width: 200,
						alignSelf: 'center'
					}} />

				<View>
					<View style={{
						width: width / 1.5,
						flexDirection: 'row',
						alignSelf: 'center',
						marginBottom: 1
					}}>
						<View style={{
							borderTopLeftRadius: 15,
							borderTopRightRadius: 15,
							flex: 1,
							opacity: 1,
							backgroundColor: 'white',
							...StyleSheet.absoluteFillObject
						}} />

						<Image
							source={require('../assets/image/tendangnhap.png')}
							resizeMode='contain'
							style={{ height: 30, width: 30, alignSelf: 'center' }} />
						<TextInput
							style={{
								flex: 1,
								fontSize: 25,
								color: MAIN_TEXT_COLOR,
								fontFamily: MAIN_FONT,
								fontWeight: 'bold',
								marginTop: 6
							}}
							onChangeText={(userName) => this.setState({ username: userName })}
							value={this.state.username}
							placeholder="Tên đăng nhập"
							placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
							underlineColorAndroid="transparent" />
					</View>

					<View style={{
						width: width / 1.5,
						flexDirection: 'row',
						alignSelf: 'center',
						alignItems: 'center'
					}}>
						<View style={{
							borderBottomLeftRadius: 15,
							borderBottomRightRadius: 15,
							flex: 1,
							opacity: 1,
							backgroundColor: 'white',
							...StyleSheet.absoluteFillObject
						}} />

						<Image
							source={require('../assets/image/matkhau.png')}
							resizeMode='contain'
							style={{ height: 30, width: 30 }} />
						<TextInput
							style={{
								flex: 1,
								fontSize: 25,
								color: MAIN_TEXT_COLOR,
								fontFamily: MAIN_FONT,
								fontWeight: 'bold'
							}}
							onChangeText={(passWord) => this.setState({ password: passWord })}
							value={this.state.password}
							placeholder="Mật khẩu"
							secureTextEntry={true}
							placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
							underlineColorAndroid="transparent" />
					</View>

					<TouchableOpacity
						style={{alignSelf:'center', 
							marginTop: 10, 
							padding:5, 
							borderRadius:10}}
						onPress={() => {
							var checkInfo = this.checkUserInput();
							if (checkInfo.status == 'error') {
								Alert.alert(
									'Lỗi đăng nhập',
									checkInfo.message
								);
							} else {
								this.SignIn(this.state.username, this.state.password);
							}
						}}>
						<Text style={{fontFamily:MAIN_FONT, fontWeight:'bold', fontSize: 30, color:'white'}}>Đăng nhập</Text>
					</TouchableOpacity>
				</View>
				<View style={{ alignSelf: 'center', marginBottom: 50 }}>
					<TouchableOpacity
						onPress={() => Actions.register()}>
						<Text style={{ color: MAIN_TEXT_COLOR, fontWeight: 'bold', fontSize: 15, fontFamily: MAIN_FONT }}>Chưa có tài khoản? Tạo tài khoản mới</Text>
					</TouchableOpacity>
				</View>
				</KeyboardAvoidingView >
		);
	}
}
