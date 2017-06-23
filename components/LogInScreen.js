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
	findNodeHandle
} from 'react-native';
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

import MainScreen from './MainScreen.js';
import TabBarExample from './MainScreen.js';
import apis from '../apis/api.js';
import { BlurView, VibrancyView } from 'react-native-blur';

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
		//console.log(responseAPI);

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
				'userInfo': {
					'token': responseAPI.user_token,
					'user_id': responseAPI.user_id,
					'username': responseAPI.username
				}
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
			<View>
			
			<Image
				source={require('../assets/screen.jpg')}
				resizeMode='cover'
				style={{ width: width, height: height }}
				 >
				
				<ScrollView style={{ flex: 1 }}>
					<View style={{width:width, height:height, flexDirection:'column', flex:1, justifyContent:'space-between'}}>
						<View style={{margin: 20}}>

							<Image
								source={require('../assets/image/logo.png')}
								resizeMode='contain'
								style={{ height: 200, width: 200, alignSelf:'center' }} />
						</View>
						<View>
							<View style={{ paddingHorizontal: 5,margin: 5, height: 50, width: width - 100, flexDirection: 'row', alignSelf: 'center',  }}>
								<View style={{ borderRadius: 15, flex: 1, opacity: 0.65, backgroundColor: 'orange', ...StyleSheet.absoluteFillObject }} />
								
								<Image
									source={require('../assets/image/tendangnhap.png')}
									resizeMode='contain'
									style={{ height: 50, width: 50 }} />
								<TextInput
										style={{ flex: 1, fontSize: 25, color: "black", fontFamily: 'sans-serif', fontWeight:'bold' }}
									onChangeText={(userName) => this.setState({ username: userName })}
									value={this.state.username}
									placeholder="Tên đăng nhập"
									placeholderTextColor="black"
									underlineColorAndroid = 'black' />
							</View>
							<View style={{ paddingHorizontal:5, margin: 5, height: 50, width: width - 100, flexDirection: 'row', alignSelf: 'center' }}>
								<View style={{ borderRadius: 15, flex: 1, opacity: 0.65, backgroundColor: 'orange', ...StyleSheet.absoluteFillObject }} />
								<Image
									source={require('../assets/image/matkhau.png')}
									resizeMode='contain'
									style={{ height: 50, width: 50 }} />
								<TextInput
										style={{ flex: 1, fontSize: 25, color: "black", fontFamily: 'sans-serif', fontWeight: 'bold' }}
									onChangeText={(passWord) => this.setState({ password: passWord })}
									value={this.state.password}
									placeholder="Mật khẩu"
									placeholderTextColor="black"
									underlineColorAndroid='black'
									secureTextEntry={true} />
							</View>
							<View
								style={{ width: width - 100, alignSelf: 'center' }}>
								<Button

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
									}}
									title="Đăng nhập"
									color="#841584" />
							</View>
						</View>
						<View style={{ alignSelf: 'center', marginBottom: 50 }}>
						<TouchableOpacity
									onPress={() => Actions.register()}>
								<Text style={{ color: 'darkslategrey', fontWeight: 'bold', fontSize: 15, fontFamily: 'sans-serif' }}>Chưa có tài khoản? Tạo tài khoản mới</Text>
						</TouchableOpacity>
						</View>
					</View>
					
				</ScrollView>
			</Image>
			
			</View>
		);
	}
}
