'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Input,
	Button,
	ToolbarAndroid,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import {Actions} from "react-native-router-flux";
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client/dist/socket.io.js';
import DialogAndroid from 'react-native-dialogs';
import apis from '../apis/api.js';
import RoomSetting from './RoomSetting.js';
import {
	SERVER_PATH,
	MAIN_COLOR,
	TOOLBAR_HEIGHT
} from './type.js';
var giobalThis;
let id = 99999999;
var done = false;
export default class ChatRoom extends Component {
	constructor(props) {
		super(props);
		giobalThis = this;
		this.state = { messages: [] };

		this.bindThis();
	}
	bindThis() {
		this.onSend = this.onSend.bind(this);
		this.onActionSelected = this.onActionSelected.bind(this);
		this.addSocketCallback = this.addSocketCallback.bind(this);
		this.getSocketData = this.getSocketData.bind(this);
	}
	getSocketData() {
		console.log('getSocketData');
		console.log(this.props.userInfo.user_id);
		this.socket.emit('get_messages', JSON.stringify({
			'user_id': this.props.userInfo.user_id,
			'group_id': this.props.groupInfo._id
		}));
	}
	addSocketCallback() {
		this.socket.on('add_message_callback', function (data) {
			console.log('add_message_callback');
			if (data.chatter._id != giobalThis.props.userInfo.user_id && data.group._id == giobalThis.props.groupInfo._id) {
				giobalThis.setState((previousState) => {
					return {
						messages: GiftedChat.append(previousState.messages, [{
							_id: data.chat_id,
							text: data.content,
							createdAt: new Date(data.date),
							user: {
								_id: data.chatter._id,
								name: data.chatter.username,
								avatar: data.chatter.avatar_url,
							}
						}]),
					};
				});
			}
		});

		this.socket.on('get_messages_callback', function (data) {
			console.log('get_messages_callback');
			if (giobalThis.props.groupInfo._id != data.group_id) return;
			for (var index = 0; index < data.messages.length; index++) {
				giobalThis.setState((previousState) => {
					return {
						messages: GiftedChat.append(previousState.messages, [{
							_id: data.messages[index]._id,
							text: data.messages[index].content,
							createdAt: new Date(data.messages[index].date),
							user: {
								_id: data.messages[index].chatter._id,
								name: data.messages[index].chatter.username,
								avatar: data.messages[index].chatter.avatar_url,
							}
						}]),
					};
				});
			}
			done=true;
			giobalThis.forceUpdate();
		});
	}
	startSocket() {
		console.log(SERVER_PATH + 'chats?group_id=' + this.props.groupInfo._id + '/');
		this.socket = io(SERVER_PATH + 'chats?group_id=' + this.props.groupInfo._id + '/', { jsonp: false });
		this.socket.emit('authenticate', { "token": this.props.userInfo.user_token });
		this.socket.on('authenticated', function () {
			giobalThis.addSocketCallback();
			giobalThis.getSocketData();
			console.log('authenticated');
		});
		this.socket.on('unauthorized', function (msg) {
			console.log("unauthorized: " + JSON.stringify(msg.data));
		});

	}
	componentWillMount() {
		this.startSocket();
	}
	componentDidMount(){
		setTimeout(function(){
			done=true;
			giobalThis.forceUpdate();
		}, 5000);
	}
	onSend(messages = []) {
		this.socket.emit("add_message", JSON.stringify({
			'user_id': this.props.userInfo.user_id,
			"group_id": this.props.groupInfo._id,
			"content": messages[0].text
		}));
		this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			};
		});
	}
	async AddNewMember(GroupID, NewMemberID) {
		let responseAPI = await apis.addNewMember(GroupID, NewMemberID);
		if (responseAPI == null) {
			return;
		}
	}
	showAddMemberDialog = function (GroupID) {
		var dialog = new DialogAndroid();
		dialog.set({
			title: 'Thêm thành viên mới',
			content: 'Nhập ID của người muốn thêm:',
			positiveText: 'Thêm',
			negativeText: 'Hủy',
			input: ({
				hint: 'ID của người muốn kết bạn',
				callback:
				(friendId) => {
					this.AddNewMember(GroupID, friendId);
				}
			}),
		});
		dialog.show();
	}
	onActionSelected(position) {

		switch (position) {
			
			case 0:
				Actions.roomsetting({ "userInfo": this.props.userInfo, 
				"groupInfo": this.props.groupInfo,
				});
				break;
			default:
				break;
		}
	}
	componentWillReceiveProps(nextProps) {
		console.log('chat room received props');
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ToolbarAndroid
					style={{ height: TOOLBAR_HEIGHT, backgroundColor: MAIN_COLOR }}
					navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
					title={this.props.groupInfo.name}
					actions={[
					{
						title: 'Thiết lập',
						icon: { uri: "http://quran.ksu.edu.sa/images/resize3.png" },
						show: 'always'
					}]}
					onIconClicked={() => {
						Actions.pop();
						return true
					}}
					onActionSelected={this.onActionSelected} />
				{done?<GiftedChat
					style={{ flex: 1 }}
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: this.props.userInfo.user_id,
					}}
				/>: <View style={{...StyleSheet.absoluteFillObject, backgroundColor:'black', opacity:0.8, justifyContent:'center'}}>
				<ActivityIndicator
					size='large'
					color={MAIN_COLOR}
					 />
				<Text style={{color:MAIN_COLOR, fontSize:25, textAlign:'center'}}>Vui lòng chờ...</Text>
				</View>}
				
			</View>
		);
	}
}
