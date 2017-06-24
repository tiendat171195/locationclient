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
import { getRooms, getFriends } from '../actions';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class ChatRoomsPage extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isRefreshing: false,
			_roomList: [],
			friends_list: [],
			openSearch: false,
			dataFriendsSource: ds.cloneWithRows([]),
		}
	}


	componentWillMount() {
		this.props.getRooms();
		this.props.getFriends();
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		setTimeout(() => {
			this.props.getRooms();
			this.setState({ isRefreshing: false });
		}, 2000);

	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.getRoomsResponse.fetched) {
			this.state._roomList = [];
			for (var index = 0; index < nextProps.getRoomsResponse.data.groups.length; index++) {
				this.state._roomList.push(nextProps.getRoomsResponse.data.groups[index]);
			}
			nextProps.getRoomsResponse.fetched = false;
		}
		if (nextProps.getFriendsRespose.fetched) {
			this.state.dataFriendsSource = [];
			for (var i = nextProps.getFriendsRespose.data.friends.length - 1; i >= 0; i--) {
				this.state.friends_list.push({
					'name': nextProps.getFriendsRespose.data.friends[i].username,
					'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'
				});
			};
			this.state.dataFriendsSource = ds.cloneWithRows(this.state.friends_list);
			nextProps.getFriendsRespose.fetched = false;
		}
	}
	render() {
		return (
			<View style={{ flex: 1 }}>

				<ScrollView style={{ backgroundColor: 'white', flex: 1 }}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						tintColor="#ff0000"
						title="Loading..."
						titleColor="#00ff00"
						colors={['#ff0000', '#00ff00', '#0000ff']}
						progressBackgroundColor="#ffff00"
					/>}>
					{this.state.friends_list.length >0 &&<View style={{}}>
<Text style={{ fontFamily: 'sans-serif', fontSize: 25 }}>Bạn bè đang trực tuyến</Text>
<ListView
	horizontal={true}
	showsHorizontalScrollIndicator={false}
	scrollEnabled={true}
	enableEmptySections={true}
	style={{}}
	dataSource={this.state.dataFriendsSource}
	renderRow={(data) =>
		<View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
			<Image
				style={{ width: 70, height: 70, alignSelf: "center", borderRadius: 70 / 2 }}
				resizeMode="cover"
				source={{ uri: data.avatar }}
			/>
			<Text style={{ fontSize: 20 }}>{data.name}</Text>
		</View>}
/>
</View>}
					
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							this.state._roomList.map((u, i) => {
								return (
									<ListItem
										containerStyle={{ height: 70 }}
										title={<Text style={{ height: 35, paddingLeft: 10, fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold' }}
											numberOfLines={1}>
											{u.name}
										</Text>}
										subtitle={<Text style={{ height: 35, paddingLeft: 10, fontSize: 15, fontFamily: 'sans-serif' }}
											numberOfLines={1}>{u.messages.length > 0 ? u.messages[0].chatter.username + ': ' + u.messages[0].content
												: "Hãy gửi tin nhắn đầu tiên"}
										</Text>}
										avatarStyle={{ height: 60, width: 60, }}

										key={i}
										roundAvatar
										hideChevron={true}
										avatar={require("../assets/image/chatroom.png")}
										onPress={() => {
											Actions.chatroom({
												"giobalThis": this.props.giobalThis,
												"groupInfo": {
													"group_id": u._id,
													"name": u.name
												},
												'userInfo': this.props.userInfo
											})
										}} />
								)
							})
						}
					</Card>

				</ScrollView>
				<ActionButton buttonColor="rgba(231,76,60,1)">
					<ActionButton.Item buttonColor='#9b59b6' title="Tạo phòng" onPress={() => { Actions.createroom({ 'userInfo': this.props.userInfo }) }}>
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
		getFriendsRespose: state.getFriendsRespose
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getRooms: () => dispatch(getRooms()),
		getFriends: () => dispatch(getFriends())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatRoomsPage);