'use strict';
import React, { Component } from 'react';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	Alert,
	ToolbarAndroid,
	RefreshControl,
	Image
} from 'react-native';
import { Actions } from "react-native-router-flux";
import DialogAndroid from 'react-native-dialogs';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ListItem } from 'react-native-elements';

import apis from '../apis/api.js';

import { connect } from 'react-redux';
import { getFriends } from '../actions';
import {
	ACTIONBUTTON_COLOR
} from './type.js';
import {
	DEFAULT_AVATAR,
	CHATBOX,
} from './images.js';
class FriendsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			friends_list: [],
			friends_request_list: [],
			isRefreshing: false
		}
		this.onActionSelected = this.onActionSelected.bind(this);
	}
	componentWillMount() {
		this.getFriendRequestList();

	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.getFriendsResponse.fetched && nextProps.getFriendsResponse.fetched) {
		}
	}
	chatWithFriend(userID){
		
	}
	showAddFriendDialog = function () {
		var dialog = new DialogAndroid();
		dialog.set({

			title: 'Thêm bạn mới',
			content: 'Nhập ID của người muốn kết bạn:',
			positiveText: 'Gửi lời mời kết bạn',
			negativeText: 'Hủy',
			input: ({
				hint: 'ID của người muốn kết bạn',
				callback:
				(friendId) => {
					this.addNewFriend(friendId);
				}
			}),
		});
		dialog.show();
	}
	async getFriendRequestList() {
		let responseAPI = await apis.getFriendsRequestList();
		this.state.friends_request_list = [];
		console.log('responseAPI.friend_requests');
		console.log(responseAPI.friend_requests);
		for (var i = responseAPI.friend_requests.length - 1; i >= 0; i--) {
			this.state.friends_request_list.push({
				"_id": responseAPI.friend_requests[i]._id,
				'name': responseAPI.friend_requests[i].username,
				'avatar': DEFAULT_AVATAR
			});
		};
		this.forceUpdate();
	}
	async addNewFriend(friendId) {
		try {
			let responseAPI = await apis.addNewFriend(friendId);
			Alert.alert(
				"Thông báo",
				'Yêu cầu kết bạn đã được gửi đến: ' + responseAPI.username);
		} catch (error) {
			console.error(error);
		}
	}
	async acceptFriend(friendId) {
		try {
			let responseAPI = await apis.acceptFriend(friendId);

			Alert.alert(
				"Thông báo",
				'Bạn và ' + responseAPI.username + ' đã thành bạn bè!');
		}
		catch (error) {
			console.error(error);
		}
	}
	async declineFriendRequest(groupID){
		try {
			let responseAPI = await apis.declineFriendRequest(groupID);
		}
		catch (error) {
			console.error(error);
		}
	}
	onActionSelected(position) {

		switch (position) {
			case 0:
				this.showAddFriendDialog();
				break;
			case 1:
				break;
			default:
				break;
		}
	}
	_onRefresh() {
		this.setState({ isRefreshing: true });
		setTimeout(() => {
			this.props.getFriends();
			this.setState({ isRefreshing: false });
		}, 2000);

	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ScrollView style={{ flex: 1, backgroundColor: 'white' }}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						tintColor="#ff0000"
						title="Loading..."
						titleColor="#00ff00"
						colors={['#ff0000', '#00ff00', '#0000ff']}
						progressBackgroundColor="#ffff00"
					/>}>
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							this.props.friendsList != undefined && this.props.friendsList.map((friend, i) => {
								return (
									<ListItem
										key={i}
										roundAvatar
										hideChevron={true}
										title={friend.name}
										titleStyle={{ fontSize: 25 }}
										rightTitle={
											<TouchableOpacity>
											<Image
												resizeMode='contain'
												style={{height:40, width:40}}
												source={CHATBOX} />
											</TouchableOpacity>
										}
										avatarStyle={{ height: 48, width: 48, borderRadius: 24 }}
										avatar={{ uri: friend.avatar }}
										onPress={() => console.log('Clicked')} />
								)
							})
						}
					</Card>
					{
						this.state.friends_request_list.length > 0 &&
						<View>
							<View style={{paddingLeft: 10,flexDirection: 'row', alignItems:'center'}}>
							<Image
							style={{height:40, width:40}}
							source={{uri:'https://d30y9cdsu7xlg0.cloudfront.net/png/38220-200.png'}} />
							<Text style={{fontSize: 20, paddingLeft: 3, color:'black', fontWeight:'bold'}}>Yêu cầu kết bạn</Text>
							</View>
							<Card containerStyle={{ margin: 0, padding: 0 }} >
								{
									this.state.friends_request_list.map((request, i) => {
										return (
											<ListItem
												key={request._id}
												roundAvatar
												hideChevron={true}
												title={request.name}
												titleStyle={{ fontSize: 25 }}
												avatar={request.avatar}
												avatarStyle={{ height: 48, width: 48, borderRadius: 24 }}
												rightTitle={
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity onPress={() => {
															this.state.friends_request_list.splice(i, 1);
															this.acceptFriend(request._id);
															this.forceUpdate();
														}}>
															<Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 15, padding: 5, margin: 3, height: 35, width: 90, borderRadius: 5, color: 'white', backgroundColor: 'blue' }}>Xác nhận</Text>
														</TouchableOpacity>
														<TouchableOpacity onPress={() => {
															this.state.friends_request_list.splice(i, 1);
															//Call remove friend request api here...
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
				<ActionButton buttonColor={ACTIONBUTTON_COLOR}>
					<ActionButton.Item buttonColor='#9b59b6' title="Thêm bạn" onPress={this.showAddFriendDialog.bind(this)}>
						<Icon name="md-create" />
					</ActionButton.Item>

				</ActionButton>
			</View>
		);
	}


}


function mapStateToProps(state) {
	return {
		getFriendsResponse: state.getFriendsResponse
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getFriends: () => dispatch(getFriends())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FriendsList);