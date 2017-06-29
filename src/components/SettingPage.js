'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	Switch,
	TouchableOpacity,
	Dimensions,
	Image,
	AsyncStorage,
	ToolbarAndroid,
	StyleSheet
} from 'react-native';
import { Actions } from "react-native-router-flux";
import FriendsList from './FriendsList.js';
import Login from './LogInScreen.js';
import { Avatar, Button, Card, ListItem } from 'react-native-elements';
import apis from '../apis/api.js';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const { width, height } = Dimensions.get('window');
import {
	DIENTHOAI_IMG,
	DIACHI_IMG,
	CHATROOM_IMG,
	EMAIL_IMG,
	GIOITINH_IMG,
	NGAYSINH_IMG,
	LOGOUT_IMG,
	BACKGROUND_COVER,
	
} from './images.js';


const ASPECT_RATIO = width / height;
export default class SettingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trueSwitchIsOn: true,
			falseSwitchIsOn: false,
			birthday_text:'',
		};
		this.SignOut = this.SignOut.bind(this);
	}
	async SignOut() {
		let responseAPI = await apis.SignOut();
		if (responseAPI.success) {
			try {
				await AsyncStorage.setItem('LOGGED_IN', 'false');
				await AsyncStorage.removeItem('USER_INFO');
				apis.updateUserInfo('', '');
			} catch (error) {
				console.error(error);
			}
		}
		Actions.pop();
	}
	componentWillMount() {
		this.convertBirthday();
	}
	convertBirthday() {
		if(this.props.userInfo == undefined) return;
        let birthday = new Date(this.props.userInfo.birthday);
        this.state.birthday_text = '';
        let tempText = '';
        tempText =
            + birthday.getDate()
            + '/'
            + (1+birthday.getMonth())
            + '/'
            + (1900 + birthday.getYear());
        this.setState({
            birthday_text: tempText
        })
    }
	render() {
		return (
			<View style={{ flex: 1 }}>

				<ParallaxScrollView
					parallaxHeaderHeight={height / 3}
					backgroundColor='white'
					renderBackground={() => (
						<View style={{backgroundColor: 'orange', width: width, height: height / 3 }}>
							<Image
							style={{width: width, height: height / 3}}
								resizeMode="stretch"
								source={BACKGROUND_COVER} />
						</View>
					)}
					renderForeground={() => (
						<View style={{height:height/3, flexDirection:'column', justifyContent:'flex-end'}}>
						<View style={{flexDirection:'row'}}>
							<TouchableOpacity
								style={{}}
								onPress={() => { console.log('Onpress') }}
								activeOpacity={0.6}>
								<Image
									style={{
										margin: 5,
										width: width / 4,
										height: width / 4,
										borderRadius: width / 8
									}}
									resizeMode="cover"
									source={{ uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7" }}
								/>
							</TouchableOpacity>
							<Text style={{fontSize: 30, alignSelf:'flex-end', color:'white'}}>{this.props.userInfo.username}</Text>
						</View>
						</View>
					)}>
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							<View>
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Ngày sinh'
									titleStyle={{ fontSize: 20 }}
									subtitle={this.state.birthday_text}
									subtitleStyle={{ fontSize: 20, paddingLeft: 10 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={NGAYSINH_IMG}
									onPress={() => {

									}} />
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Số điện thoại'
									titleStyle={{ fontSize: 20 }}
									subtitle={this.props.userInfo.phone}
									subtitleStyle={{ fontSize: 20, paddingLeft: 10 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={DIENTHOAI_IMG}
									onPress={() => {

									}} />
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Email'
									titleStyle={{ fontSize: 20 }}
									subtitle={this.props.userInfo.email}
									subtitleStyle={{ fontSize: 20, paddingLeft: 10 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={EMAIL_IMG}
									onPress={() => {

									}} />
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Giới tính'
									titleStyle={{ fontSize: 20 }}
									subtitle={this.props.userInfo.gender}
									subtitleStyle={{ fontSize: 20, paddingLeft: 10 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={GIOITINH_IMG}
									onPress={() => {

									}} />
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Địa chỉ'
									titleStyle={{ fontSize: 20 }}
									subtitle={this.props.userInfo.city}
									subtitleStyle={{ fontSize: 20, paddingLeft: 10 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={DIACHI_IMG}
									onPress={() => {

									}} />
								<ListItem
									containerStyle={{ height: 60, padding: 5, alignItems: 'center' }}
									title='Đăng xuất'
									titleStyle={{ fontSize: 20 }}
									avatarStyle={{ height: 40, width: 40, borderRadius: 20 }}
									roundAvatar
									hideChevron={true}
									avatar={LOGOUT_IMG}
									onPress={this.SignOut} />
							</View>
						}
					</Card>
				</ParallaxScrollView>

			</View>
		);
	}
}