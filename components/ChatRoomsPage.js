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
	ToolbarAndroid
} from 'react-native';
import {Actions} from "react-native-router-flux";
import apis from '../apis/api.js';

import ChatRoom from './ChatRoom';
import CreateRoom from './CreateRoom';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ListItem, Button} from 'react-native-elements';
import Search from 'react-native-search-box';
export default class ChatRoomsPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			isRefreshing: false,
			_roomList: [],
			openSearch: false,
		}
	}

	async GetRoomList(UserID){
		let responseAPI = await apis.getRoomList(UserID);
		if(responseAPI == null){
			return;
		}
		//console.log(responseAPI);
		this.setState({
			_roomList: []
		});
		for (var index = 0; index < responseAPI.groups.length; index++) {
			this.state._roomList.push(responseAPI.groups[index]);
		}
		this.forceUpdate();
	}
	
	componentWillMount(){
		this.GetRoomList(this.props.userInfo.user_id);
		
	}
	_onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(()=>{
			this.GetRoomList(this.props.userInfo.user_id);
    	this.setState({isRefreshing: false});
		}, 2000);
    
  }
	componentWillReceiveProps(){
    console.log("componentWillReceiveProps");
  }
	render(){
		return(
			<View style={{flex:1}}>
			<Search
				ref="searchbox"
				placeholder="Tìm kiếm"
				cancelTitle="Hủy"
				backgroundColor="sandybrown"
				contentWidth={30}
				/**
				* There many props that can customizable
				* Please scroll down to Props section
				*//>
			<ScrollView style={{backgroundColor: 'white', flex: 1}}
				refreshControl={<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />}>
				
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state._roomList.map((u, i) => {
				      return (
				        <ListItem
								containerStyle={{height:70}}
								subtitle='Tin nhắn gần nhất'
								titleStyle={{fontSize: 20, fontFamily: 'fantasy'}}
								avatarStyle={{height:60, width: 60, padding:10}}
								
				          key={i}
				          roundAvatar
				          title={u.name}
				          avatar={{uri:"https://d30y9cdsu7xlg0.cloudfront.net/png/546908-200.png"}}
				          onPress={()=>{Actions.chatroom({"giobalThis": this.props.giobalThis,
																									"groupInfo":{
																										"group_id":u._id, 
																										"name": u.name},
																									'userInfo': this.props.userInfo})}} />
				      )
				    })
				  }
				</Card>
			</ScrollView>
			<ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Tạo phòng" onPress={()=>{Actions.createroom({'userInfo': this.props.userInfo})}}>
                  <Icon name="md-create"/>
                </ActionButton.Item>
                
			</ActionButton>
			</View>
		);
	}
}
