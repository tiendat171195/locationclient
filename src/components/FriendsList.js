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
import { getUserInfo } from '../actions';
import {
	ACTIONBUTTON_COLOR,
	MAIN_COLOR_DARK
} from './type.js';
import {
	DEFAULT_AVATAR,
	CHATBOX,
} from './images.js';
class FriendsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false
		}
		this.onActionSelected = this.onActionSelected.bind(this);
	}
	componentWillMount() {

	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.getUserInfoResponse.fetched && nextProps.getUserInfoResponse.fetched) {
			
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
	async declineFriendRequest(friendID){
		try {
			let responseAPI = await apis.declineFriendRequest(friendID);
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
	async _onRefresh() {
		this.setState({ isRefreshing: true });
		await this.props.getUserInfo(this.props.userInfo.user_id);
		this.setState({ isRefreshing: false });
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
					{
						(this.props.getUserInfoResponse.data.friend_requests !== undefined && this.props.getUserInfoResponse.data.friend_requests.length > 0) &&
						<View>
							<View style={{padding: 16,flexDirection: 'row', alignItems:'center'}}>
							<Image
							style={{height:24, width:24, marginRight:8}}
							source={{uri:'https://d30y9cdsu7xlg0.cloudfront.net/png/38220-200.png'}} />
							<Text style={{fontSize: 20, color:'black', fontWeight:'bold'}}>Yêu cầu kết bạn</Text>
							</View>
							<Card containerStyle={{ margin: 0, padding: 0 }} >
								{
									this.props.getUserInfoResponse.data.friend_requests.map((request, i) => {
										return (
											<ListItem
												key={request._id}
												roundAvatar
												hideChevron={true}
												title={<Text style={{fontSize:16}} numberOfLines={1}>{request.username}</Text>}
												avatar={request.avatar_url}
												rightTitle={
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity
															style={{alignItems:'center', backgroundColor:MAIN_COLOR_DARK,padding: 5, margin: 3, height: 32, width: 70, borderRadius: 5,}}
															onPress={() => {
															this.props.getUserInfoResponse.data.friend_requests.splice(i, 1);
															this.acceptFriend(request._id);
															this.forceUpdate();
														}}>
															<Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 12,  color: 'white'}}>Xác nhận</Text>
														</TouchableOpacity>
														<TouchableOpacity 
															style={{backgroundColor:'grey',padding: 5, margin: 3, marginRight:0, height: 32, width: 70, borderRadius: 5,}}
															onPress={() => {
															this.props.getUserInfoResponse.data.friend_requests.splice(i, 1);
															this.declineFriendRequest(request._id);
															this.forceUpdate();
														}}>
															<Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 12, color: 'white'}}>Từ chối</Text>
														</TouchableOpacity>
													</View>
												}
											/>
										)
									})
								}
							</Card>
						</View>}
					<View>
						<View style={{padding: 16,flexDirection: 'row', alignItems:'center'}}>
							<Image
							style={{height:24, width:24, marginRight:8}}
							source={{uri:'https://d30y9cdsu7xlg0.cloudfront.net/png/38220-200.png'}} />
							<Text style={{fontSize: 20, color:'black', fontWeight:'bold'}}>Bạn bè</Text>
							</View>
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							(this.props.getUserInfoResponse.data.friends !== undefined && this.props.getUserInfoResponse.data.friends.length >0) ? this.props.getUserInfoResponse.data.friends.map((friend, i) => {
								return (
									<ListItem
										key={i}
										roundAvatar
										hideChevron={true}
										title={<Text style={{fontSize:16}} numberOfLines={1}>{friend.username}</Text>}
										
										rightTitle={
											<TouchableOpacity>
											<Image
												resizeMode='contain'
												style={{height:28, width:28}}
												source={CHATBOX} />
											</TouchableOpacity>
										}
										avatar={{ uri: friend.avatar_url }}
										onPress={() => console.log('Clicked')} />
								)
							}) : <Text style={{fontSize:25, textAlign:'center'}}>Danh sách bạn bè trống!</Text>
						}
					</Card>
					</View>
				</ScrollView>
				
			</View>
		);
	}


}


function mapStateToProps(state) {
	return {
		getUserInfoResponse: state.getUserInfoResponse
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserInfo: (UserID) => dispatch(getUserInfo(UserID))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FriendsList);