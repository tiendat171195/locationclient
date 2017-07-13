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
	StyleSheet,
	CameraRoll,
	Modal,
	Share
} from 'react-native';
import { Actions } from "react-native-router-flux";
import FriendsList from './FriendsList.js';
import Login from './LogInScreen.js';
import { Avatar, Button, Card, ListItem } from 'react-native-elements';
import apis from '../apis/api.js';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const { width, height } = Dimensions.get('window');
import Communications from 'react-native-communications';
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
import {
	MAIN_COLOR
} from './type.js';
import { connect } from 'react-redux';
import {
	getUserInfo,
} from '../actions';
const ASPECT_RATIO = width / height;

var giobalThis;
class SettingPage extends Component {
	constructor(props) {
		super(props);
		giobalThis = this;
		this.state = {
			trueSwitchIsOn: true,
			falseSwitchIsOn: false,
			birthday_text: '',
			modalVisible: false,
			photos: [],
			avatar: null,
		};
		this.SignOut = this.SignOut.bind(this);
	}
	getPhotos = () => {
		console.log('get photo');
		CameraRoll.getPhotos({
			first: 100,
			assetType: 'All'
		})
			.then(r => this.setState({ photos: r.edges }));
	}
	toggleModal = () => {
		this.setState({ modalVisible: !this.state.modalVisible });
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
		this.convertBirthday(this.props.getUserInfoResponse.data.birthday);
	}
	convertBirthday(BD) {
		let birthday = new Date(BD);
		this.state.birthday_text = '';
		let tempText = '';
		tempText =
			+ birthday.getDate()
			+ '/'
			+ (1 + birthday.getMonth())
			+ '/'
			+ (1900 + birthday.getYear());
		this.setState({
			birthday_text: tempText
		})
	}
	componentWillReceiveProps(nextProps){
		console.log('Setting Screen');
		if(nextProps.getUserInfoResponse.fetched){
			this.setState({avatar: nextProps.getUserInfoResponse.data.avatar_url});
			giobalThis.convertBirthday(nextProps.getUserInfoResponse.data.birthday);
		}
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ParallaxScrollView
					parallaxHeaderHeight={width*9/16}
					backgroundColor='white'
					renderBackground={() => (
						<View style={{ backgroundColor: 'black', width: width, height: width*9/16 }}>
							<Image
								style={{ width: width, height: width*9/16-30 }}
								resizeMode="cover"
								source={BACKGROUND_COVER} />
						</View>
					)}
					renderForeground={() => (
						<View style={{ height: width*9/16, flexDirection: 'column', justifyContent: 'flex-end' }}>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity
									style={{ backgroundColor: 'white', height:width/4+6, width:width/4+6, padding: 3, margin:5, borderRadius: (width / 4) / 2, justifyContent:'center', alignItems:'center' }}
									onPress={() => {
										this.toggleModal();
										this.getPhotos();
									}}
									activeOpacity={0.6}>
									<Image
										style={{

											margin: 3,
											width: width / 4,
											height: width / 4,
											borderRadius: width / 8
										}}
										resizeMode="cover"
										source={{ uri: this.state.avatar }}
									/>
								</TouchableOpacity>
								<Text style={{ fontSize: 32, alignSelf: 'flex-end', color: 'white' }}>{this.props.getUserInfoResponse.data.username}</Text>
							</View>
						</View>
					)}>
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							<View>
								<ListItem
									
									title='Ngày sinh'
									titleStyle={{ fontSize: 14 }}
									subtitle={this.state.birthday_text}
									subtitleStyle={{ fontSize: 14 }}
									roundAvatar
									hideChevron={true}
									avatar={NGAYSINH_IMG}
									onPress={() => {
										Share.share({message: 'Message Share Facebook test', title: 'Title test'});
									}} />
								<ListItem
									
									title='Số điện thoại'
									titleStyle={{ fontSize: 14 }}
									subtitle={'0' + this.props.getUserInfoResponse.data.phone}
									subtitleStyle={{ fontSize: 14 }}
									
									roundAvatar
									hideChevron={true}
									avatar={DIENTHOAI_IMG}
									onPress={() => {
										Communications.phonecall('0' + this.props.getUserInfoResponse.data.phone, true);
									}} />
								<ListItem
									
									title='Email'
									titleStyle={{ fontSize: 14 }}
									subtitle={this.props.getUserInfoResponse.data.email}
									subtitleStyle={{ fontSize: 14 }}
									
									roundAvatar
									hideChevron={true}
									avatar={EMAIL_IMG}
									onPress={() => {

									}} />
								<ListItem
									
									title='Giới tính'
									titleStyle={{ fontSize: 14 }}
									subtitle={this.props.getUserInfoResponse.data.gender}
									subtitleStyle={{ fontSize: 14 }}
									
									roundAvatar
									hideChevron={true}
									avatar={GIOITINH_IMG}
									onPress={() => {

									}} />
								<ListItem
									
									title='Địa chỉ'
									titleStyle={{ fontSize: 14 }}
									subtitle={this.props.getUserInfoResponse.data.city}
									subtitleStyle={{ fontSize: 14 }}
									
									roundAvatar
									hideChevron={true}
									avatar={DIACHI_IMG}
									onPress={() => {

									}} />
								<ListItem
									
									title='Đăng xuất'
									titleStyle={{ fontSize: 14 }}
									
									roundAvatar
									hideChevron={true}
									avatar={LOGOUT_IMG}
									onPress={this.SignOut} />

							</View>
						}
					</Card>
					<Modal
						animationType={"slide"}
						transparent={false}
						visible={this.state.modalVisible}
						onRequestClose={() => console.log('closed')}
					>
						<View style={{ flex: 1 }}>
							<ToolbarAndroid
								style={{ height: 50, backgroundColor: MAIN_COLOR }}
								title='Chọn ảnh đại diện'
								titleColor='#6666ff'
								navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
								onIconClicked={this.toggleModal}
							>
							</ToolbarAndroid>
							<ScrollView
								contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}>
								{
									this.state.photos.map((p, i) => {
										return (
											<TouchableOpacity
												style={{ opacity: i === this.state.index ? 0.5 : 1 }}
												key={i}
												underlayColor='transparent'
												onPress={async () => {
													let url = await apis.uploadImage(p.node.image.uri);
													this.toggleModal();
													let response = await apis.updateUserImage(url);
													
													if(response.status_code == 200){
														this.setState({
															avatar: url
														})
													}
													
													}}
											>
												<Image
													style={{
														width: width / 3,
														height: width / 3
													}}
													source={{ uri: p.node.image.uri }}
												/>
											</TouchableOpacity>
										)
									})
								}
							</ScrollView>
						</View>
					</Modal>
				</ParallaxScrollView>

			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		getUserInfoResponse: state.getUserInfoResponse,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserInfo: (UserID) => dispatch(getUserInfo(UserID)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingPage);