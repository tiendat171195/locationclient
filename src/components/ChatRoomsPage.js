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
			openSearch: false,
			dataFriendsSource: ds.cloneWithRows([]),
		}
	}


	componentWillMount() {
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this.props.getFriends();
		this.props.getRooms();
	}
	componentWillReceiveProps(nextProps) {
		 if (!this.props.getRoomsResponse.fetched && nextProps.getRoomsResponse.fetched) {
			
		} 
		if (!this.props.getFriendsResponse.fetched && nextProps.getFriendsResponse.fetched) {
			console.log('componentWillReceiveProps chatroom');
			console.log(nextProps);
			this.setState({dataFriendsSource: ds.cloneWithRows(nextProps.friendsList)});
		}
		this.setState({ isRefreshing: false });
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
					{this.props.friendsList != undefined && this.props.friendsList.length >0 &&<View style={{}}>
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
							this.props.roomsList != undefined && this.props.roomsList.map((u, i) => {
								return (
									<ListItem
										containerStyle={{ height: 70 }}
										title={
											<Text style={{ height: 35, 
															paddingLeft: 10, 
															fontSize: 20, 
															color:'black', 
															textAlignVertical:'center',
															fontFamily: 'sans-serif', 
															fontWeight: 'bold' }}
															numberOfLines={1}>
												{u.name}
											</Text>}
										subtitle={
											<Text style={{ height: 35, 
															paddingLeft: 10, 
															fontSize: 15,
															textAlignVertical:'top',
															fontFamily: 'sans-serif' }}
															numberOfLines={1}>
												{u.messages.length > 0 ? u.messages[0].chatter.username + ': ' + u.messages[0].content
												: "Hãy gửi tin nhắn đầu tiên"}
											</Text>}
										avatarStyle={{ height: 60, width: 60, borderRadius:30 }}
										key={i}
										roundAvatar
										hideChevron={true}
										avatar={{uri: 'http://www.freeiconspng.com/uploads/live-chat-icon-19.png'}}
										onPress={() => {
											Actions.chatroom({
												"groupInfo": u,
												'userInfo': this.props.userInfo,
												'currentRegion': this.props.currentRegion
											})
										}} />
								)
							})
						}
					</Card>

				</ScrollView>
				<ActionButton buttonColor="rgba(231,76,60,1)">
					<ActionButton.Item buttonColor='#9b59b6' title="Tạo phòng" onPress={() => { Actions.createroom({ 'userInfo': this.props.userInfo, 'friendsList': this.props.friendsList }) }}>
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
		getFriendsResponse: state.getFriendsResponse
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