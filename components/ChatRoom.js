'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Input,
	Button,
	ToolbarAndroid
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client/dist/socket.io.js';
import DialogAndroid from 'react-native-dialogs';
import apis from '../apis/api.js';
import RoomSetting from './RoomSetting.js';
var myThis;
let id = 99999999;
export default class ChatRoom extends Component{
	constructor(props) {
	    super(props);
			myThis = this;
	    this.state = {messages: []};
	    this.onSend = this.onSend.bind(this);
			this.onActionSelected = this.onActionSelected.bind(this);
		}	
		_navigate(nextScreen, props, type='normal'){
			this.props.navigator.push({
				component: nextScreen,
				passProps: props,
				type: type
			})
		}
		startSocket(){
			this.socket = io('http://192.168.83.2:3000/chats/groups', {jsonp:false});
			this.socket.on('add_message_callback', function(data){
				if(data.chatter != myThis.props.userInfo.user_id && data.group_id == myThis.props.groupInfo.group_id){
					myThis.setState((previousState) => {
						return {
							messages: GiftedChat.append(previousState.messages, [{
								_id: `ID${id++}`,
	          					text: data.content,
	          					createdAt: new Date(data.date),
								user: {
									_id: data.chatter,
									name: data.chatter,
									avatar: 'https://facebook.github.io/react/img/logo_og.png',
								}}]),
								};
							});
				}
			});
			this.socket.emit('get_messages',  JSON.stringify({'token': this.props.userInfo.token, 
															'user_id': this.props.userInfo.user_id, 
															'group_id': this.props.groupInfo.group_id}));
			this.socket.on('get_messages_callback', function(data){
				console.log(data);
				if(myThis.props.groupInfo.group_id != data.group_id) return;
				for (var index = 0; index < data.chats.length ; index++) {
					myThis.setState((previousState) => {
						return {
							messages: GiftedChat.append(previousState.messages, [{
								_id: data.chats[index]._id,
								text: data.chats[index].content,
								createdAt: new Date(data.chats[index].date),
								user: {
									_id: data.chats[index].chatter._id,
									name: data.chats[index].chatter.username,
									avatar: 'https://facebook.github.io/react/img/logo_og.png',
								}
							}]),
							};
					});
				}
			});
		}
		componentWillMount() {
	    this.startSocket();
	  }
  onSend(messages = []) {
		this.socket.emit("add_message", JSON.stringify({'token': this.props.userInfo.token, 
														'user_id': this.props.userInfo.user_id, 
														"group_id": this.props.groupInfo.group_id, 
														"chatter_id":this.props.userInfo.user_id, 
														"content":messages[0].text, 
														"date":messages[0].createdAt.getTime() }));
   this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
	async AddNewMember(GroupID, NewMemberID){
		let responseAPI = await apis.addNewMember(GroupID, NewMemberID);
		if(responseAPI == null){
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
	      		(friendId)=>{
	      			this.AddNewMember(GroupID, friendId);
	      		}
	      }),
	    });
	    dialog.show();
  	}
		onActionSelected(position) {
			
			switch (position) {
				case 0:
					this.showAddMemberDialog(this.props.groupInfo.group_id);
					break;
				case 1:
					this.props.giobalThis.setState({
						_group_id: this.props.groupInfo.group_id
					})
					break;
				case 2:
					this._navigate(RoomSetting, {"userInfo":this.props.userInfo, "groupInfo":this.props.groupInfo});
					break;
				default:
					break;
			}
		}
				
  render() {
    return (
			<View style={{flex: 1}}>
				<ToolbarAndroid
				style={{height:50, backgroundColor:'orange'}}
      navIcon={{uri:"http://semijb.com/iosemus/BACK.png", width:50, height:50}}
      title={this.props.groupInfo.name}
      actions={[{title: 'Thêm người', 
								icon: {uri:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-add-128.png"}, 
								show: 'always'}, 
								{title: 'Bắt đầu phượt', 
								icon: {uri:"http://www.clipartpanda.com/clipart_images/gps-icon-png-check-in-at-the-38806012/download"}, 
								show: 'always'}, 
								{title: 'Thiết lập', 
								icon: {uri:"http://quran.ksu.edu.sa/images/resize3.png"}, 
								show: 'always'}]}
      onIconClicked={()=>{this.props.navigator.pop();
													return true }}
			onActionSelected={this.onActionSelected} />
				
				<GiftedChat
					style={{flex:1}}
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: this.props.userInfo.user_id,
					}}
				/>
			</View>
    );
  }
}
