'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Navigator,
	StyleSheet,
	RefreshControl,
	ToolbarAndroid,
	ListView,
	Dimensions,
	Image
} from 'react-native';
import { Actions } from "react-native-router-flux";
import apis from '../apis/api.js';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
import ChatRoom from './ChatRoom';
import CreateRoom from './CreateRoom';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ListItem, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { getRooms, getFriends, getUserInfo } from '../actions';
import {
	DEFAULT_ROOM_AVATAR
} from './images.js';
import {
	MAIN_COLOR
} from './type.js';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class ChatRoomsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isRefreshing: false,
			openSearch: false,
			dataFriendsSource: ds.cloneWithRows([]),
			rooms_request: []
		}
	}


	componentWillMount() {
		this.props.getRooms();
		this.getRoomsRequest();
	}

	_onRefresh() {

		this.props.getUserInfo(this.props.userInfo.user_id);
		this.props.getRooms();
		this.setState({ isRefreshing: true });
	}
	async getRoomsRequest() {
		let responseAPI = await apis.getRoomsRequest();
		this.state.rooms_request = [];
		for (var i = responseAPI.group_requests.length - 1; i >= 0; i--) {
			this.state.rooms_request.push({
				"_id": responseAPI.group_requests[i]._id,
				'name': responseAPI.group_requests[i].name,
				'avatar': DEFAULT_ROOM_AVATAR
			});
		};
		this.forceUpdate();
	}
	async acceptRoomRequest(groupID) {
		try {
			let responseAPI = await apis.acceptRoom(groupID);
			this.props.getRooms();
		}
		catch (error) {
			console.error(error);
		}
	}
	async declineRoomRequest(groupID) {
		try {
			let responseAPI = await apis.declineRoomRequest(groupID);

		}
		catch (error) {
			console.error(error);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.getRoomsResponse.fetched && nextProps.getRoomsResponse.fetched) {

		}
		if(!this.props.getUserInfoResponse.fetched && nextProps.getUserInfoResponse.fetched){
			this.setState({
				dataFriendsSource: ds.cloneWithRows(nextProps.getUserInfoResponse.data.friends)
			})
		}
		if (nextProps.getUserInfoResponse.fetched && nextProps.getRoomsResponse.fetched) {
			this.setState({ isRefreshing: false });
		}

	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ScrollView style={{ backgroundColor: 'white', flex: 1 }}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						tintColor={MAIN_COLOR}
						title="Loading..."
						titleColor="#00ff00"
						colors={['#ff0000', '#00ff00', '#0000ff']}
						progressBackgroundColor={MAIN_COLOR}
					/>}>
					{ this.props.getUserInfoResponse.data.friends != undefined && this.props.getUserInfoResponse.data.friends.length > 0 && <View style={{}}>
						<View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
							<Image
								style={{ height: 30, width: 30 }}
								source={DEFAULT_ROOM_AVATAR} />
							<Text style={{ fontSize: 20, paddingLeft: 3, color: 'black', fontWeight: 'bold' }}>Bạn bè trực tuyến</Text>
						</View>
						<ListView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							scrollEnabled={true}
							enableEmptySections={true}
							style={{}}
							dataSource={this.state.dataFriendsSource}
							renderRow={(data) =>
								<View style={{width:70, flexDirection: 'column', alignItems: 'center', margin: 5 }}>
									<Image
										style={{ width: 50, height: 50, alignSelf: "center", borderRadius: 70 / 2 }}
										resizeMode="cover"
										source={{ uri: data.avatar_url }}
									/>
									<Text style={{ fontSize: 20, color:'black' }} numberOfLines={1}>{data.username}</Text>
								</View>}
						/>
					</View>}

					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							this.props.roomsList != undefined && this.props.roomsList.map((u, i) => {
								return (
									<ListItem
										title={
											<Text style={{
												
												fontSize: 18,
												color: 'black',
												textAlignVertical: 'center',
												fontFamily: 'sans-serif',
												fontWeight: 'bold'
											}}
												numberOfLines={1}>
												{u.name}
											</Text>}
										subtitle={
											<Text style={{
												fontSize: 14,
												fontFamily: 'sans-serif'
											}}
												numberOfLines={1}>
												{u.messages.length > 0 ? u.messages[0].chatter.username + ': ' + u.messages[0].content
													: "Hãy gửi tin nhắn đầu tiên"}
											</Text>}
										key={i}
										roundAvatar
										hideChevron={true}
										avatar={u.avatar_url == undefined || u.avatar_url == '' ? DEFAULT_ROOM_AVATAR : { uri: u.avatar_url }}
										onPress={() => {

											Actions.chatroom({
												"groupInfo": u,
												'userInfo': this.props.userInfo,
											})
										}} />
								)
							})
						}
					</Card>
					{
						this.state.rooms_request.length > 0 &&
						<View>
							<View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
								<Image
									style={{ height: 40, width: 40 }}
									source={{ uri: 'https://www.shareicon.net/download/2017/06/21/887365_add_512x512.png' }} />
								<Text style={{ fontSize: 20, paddingLeft: 3, color: 'black', fontWeight: 'bold' }}>Phòng đang chờ</Text>
							</View>
							<Card containerStyle={{ margin: 0, padding: 0 }} >
								{
									this.state.rooms_request.map((request, i) => {
										return (
											<ListItem
												key={request._id}
												roundAvatar
												hideChevron={true}
												title={request.name}
												titleStyle={{ fontSize: 18 }}
												avatar={request.avatar}
												avatarStyle={{ height: 48, width: 48, borderRadius: 24 }}
												rightTitle={
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity onPress={() => {
															this.state.rooms_request.splice(i, 1);
															this.acceptRoomRequest(request._id);
															this.forceUpdate();
														}}>
															<Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 15, padding: 5, margin: 3, height: 35, width: 90, borderRadius: 5, color: 'white', backgroundColor: 'blue' }}>Xác nhận</Text>
														</TouchableOpacity>
														<TouchableOpacity onPress={() => {
															this.state.rooms_request.splice(i, 1);
															this.declineRoomRequest(request._id);
															this.forceUpdate();
														}}>
															<Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 15, padding: 5, margin: 3, height: 35, width: 90, borderRadius: 5, color: 'white', backgroundColor: 'grey' }}>Từ chối</Text>
														</TouchableOpacity>
													</View>
												}
											/>
										)
									})
								}
							</Card>
						</View>}
				</ScrollView>
				<ActionButton buttonColor="rgba(231,76,60,1)">
					<ActionButton.Item buttonColor='#9b59b6' title="Tạo phòng" onPress={() => { Actions.createroom({ 'userInfo': this.props.userInfo, 'friendsList': this.props.getUserInfoResponse.data.friends }) }}>
						<Icon name="md-create" />
					</ActionButton.Item>

				</ActionButton>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		getRoomsResponse: state.getRoomsResponse,
		getUserInfoResponse: state.getUserInfoResponse
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getRooms: () => dispatch(getRooms()),
		getUserInfo: (UserID) => dispatch(getUserInfo(UserID))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatRoomsPage);