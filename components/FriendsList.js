'use strict';
import React, { Component } from 'react';
import {
	ScrollView,
	View,
	Text,
	TouchableHighlight,
	Alert,
	ToolbarAndroid
} from 'react-native';

import DialogAndroid from 'react-native-dialogs';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

import apis from '../apis/api.js';
	
export default class FriendsList extends Component {
	constructor(props){
		super(props);
		this.state = {
			friends_list: [],
			friends_request_list: [],
		}
		this.onActionSelected = this.onActionSelected.bind(this);
	}
	componentWillMount(){
		this.getFriendsList();
		this.getFriendRequestList();

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
	      		(friendId)=>{
	      			this.addNewFriend(friendId);
	      		}
	      }),
	    });
	    dialog.show();
  	}
  	async getFriendsList(){
  		let responseAPI = await apis.getFriendsList();
			for (var i = responseAPI.friends.length - 1; i >= 0; i--) {
				this.state.friends_list.push({'name': responseAPI.friends[i].username, 
																			'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'});
			};
			this.forceUpdate();
  	}
  	async getFriendRequestList(){
  		let responseAPI = await apis.getFriendsRequestList();
			for (var i = responseAPI.friend_requests.length - 1; i >= 0; i--) {
				this.state.friends_request_list.push({'name': responseAPI.friend_requests[i].username, 
																							'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'});
			};
			this.forceUpdate();
  	}
  	async addNewFriend(friendId){
  		try{
				let responseAPI = await apis.addNewFriend(friendId);
				Alert.alert(
					"Thông báo",
					'Yêu cầu kết bạn đã được gửi đến: '+responseAPI.username);
			} catch(error){
				console.error(error);
			}
  	}
  	async acceptFriend(friendId){
  		try {
				let responseAPI = await apis.acceptFriend(friendId);
				console.log(responseAPI);
				Alert.alert(
					"Thông báo",
					'Bạn và '+responseAPI.username+' đã thành bạn bè!');
				}
			catch(error){
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
	render(){
		return(
			<ScrollView>
				<ToolbarAndroid
				style={{height:50, backgroundColor:'orange'}}
      navIcon={{uri:"http://semijb.com/iosemus/BACK.png", width:50, height:50}}
      title="Danh sách bạn bè"
      actions={[{title: 'Thêm người', icon: {uri:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-add-128.png"}, show: 'always'}]}
      onIconClicked={()=>{this.props.navigator.pop();
													return true }}
			onActionSelected={this.onActionSelected} />
				<Text>Bạn bè</Text>
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state.friends_list.map((friend, i) => {
				      return (
				        <ListItem
				          key={i}
				          roundAvatar
				          hideChevron={true}
				          title={friend.name}
				          avatar={{uri:friend.avatar}}
				          onPress={()=>console.log('Clicked')} />
				      )
				    })
				  }
				</Card>
				<Text>Yêu cầu kết bạn</Text>
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state.friends_request_list.map((request, i) => {
				      return (
				        <ListItem
				          key={i}
				          roundAvatar
				          hideChevron={true}
				          title={request.name}
				          avatar={{uri:request.avatar}}
				          subtitle={
					          <View style={{justifyContent:'flex-end', flexDirection:'row'}}>
					          	<Icon
					          	  containerStyle={{paddingRight:30}}
								  name='check'
								  color='#f50'
								  onPress={()=>{
								  	console.log('i=:' + i);
								  	this.state.friends_request_list.splice(i, 1);
								  	this.acceptFriend(request.name);
								  	this.forceUpdate();
								  }} />
					            <Icon
								  name='do-not-disturb'
								  color='#f50'
								  onPress={() => {

								  	this.state.friends_request_list.splice(i, 1);
								  	//Call remove friend request api here...
								  	this.forceUpdate();
								  }} />
					          </View>
					        }
				           />
				      )
				    })
				  }
				</Card>
	        </ScrollView>
		);
	}


}