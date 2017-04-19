'use strict';
import React, { Component } from 'react';
import {
	ScrollView,
	View,
	Text,
	TouchableHighlight,
	Alert
} from 'react-native';

import DialogAndroid from 'react-native-dialogs';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

import apis from '../apis/api.js';
	
export default class FriendsList extends Component {
	constructor(props){
		super(props);
		console.log('FriendList: ', props.userInfo);
		this.state = {
			_friendsList: [],
			_friendsRequestList: [],
		}

	}
	componentWillMount(){
		this.getFriendsList();
		this.getFriendRequestList();

	}
	showDialog = function () {
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
	      })
	    });
	    dialog.show();
  	}
  	async getFriendsList(){
  		let responseAPI = await apis.getFriendsList(this.props.userInfo._id);
			for (var i = responseAPI.friend_list.length - 1; i >= 0; i--) {
				this.state._friendsList.push({'name': responseAPI.friend_list[i], 'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'});
			};
			this.forceUpdate();
  	}
  	async getFriendRequestList(){
  		let responseAPI = await apis.getFriendsRequestList(this.props.userInfo._id);
			for (var i = responseAPI.friend_requests.length - 1; i >= 0; i--) {
				this.state._friendsRequestList.push({'name': responseAPI.friend_requests[i], 'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'});
			};
			this.forceUpdate();
  	}
  	addNewFriend(friendId){
  		let responseAPI = apis.addNewFriend(this.props.userInfo._id, friendId);
			Alert.alert(
				"Thông báo",
				'Yêu cầu kết bạn đã được gửi đến: '+responseAPI.username);
  	}
  	acceptFriend(friendId){
  		let responseAPI = apis.acceptFriend(this.props.userInfo._id, friendId);
			Alert.alert(
				"Thông báo",
				'Bạn và '+responseAPI.username+' đã thành bạn bè!');
  	}
	_navbar = <View style={{height:50, backgroundColor:'orange', flexDirection: 'row', justifyContent: 'space-between'}}>
					<Button title='Trở về' onPress={()=>{
					if (this.props.navigator.getCurrentRoutes().length > 1) {
						this.props.navigator.pop();
						return true // do not exit app
					} else {
						return false // exit app
					}
				}} />
				
				<View ><Text style={{fontSize:20}}>Friends List</Text></View>
				<Button title='Thêm bạn' onPress={this.showDialog.bind(this)} />
				</View>;
		
	render(){
		return(
			<ScrollView>
				{this._navbar}
				<Text>Friend List</Text>
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state._friendsList.map((u, i) => {
				      return (
				        <ListItem
				          key={i}
				          roundAvatar
				          hideChevron={true}
				          title={u.name}
				          avatar={{uri:u.avatar}}
				          onPress={()=>console.log('Clicked')} />
				      )
				    })
				  }
				</Card>
				<Text>Friends Request</Text>
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state._friendsRequestList.map((u, i) => {
				      return (
				        <ListItem
				          key={i}
				          roundAvatar
				          hideChevron={true}
				          title={u.name}
				          avatar={{uri:u.avatar}}
				          subtitle={
					          <View style={{justifyContent:'flex-end', flexDirection:'row'}}>
					          	<Icon
					          	  containerStyle={{paddingRight:30}}
								  name='check'
								  color='#f50'
								  onPress={()=>{
								  	console.log('i=:' + i);
								  	this.state._friendsRequestList.splice(i, 1);
								  	this.acceptFriend(u.name);
								  	this.forceUpdate();
								  }} />
					            <Icon
								  name='do-not-disturb'
								  color='#f50'
								  onPress={() => {

								  	this.state._friendsRequestList.splice(i, 1);
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