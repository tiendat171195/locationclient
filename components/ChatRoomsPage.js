'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Navigator,
	StyleSheet,
	RefreshControl
} from 'react-native';

import apis from '../apis/api.js';

import ChatRoom from './ChatRoom';
import CreateRoom from './CreateRoom';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ListItem, Button} from 'react-native-elements';

export default class ChatRoomsPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			isRefreshing: false,
			_roomList: [],
		}
	}
	_navigate(nextScreen, props, type='normal'){
		this.props.navigator.push({
			component: nextScreen,
			passProps: props,
			type: type
		})
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
		this.GetRoomList(this.props.userInfo._id);
		
	}
	_onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(()=>{
			this.GetRoomList(this.props.userInfo._id);
    	this.setState({isRefreshing: false});
		}, 2000);
    
  }
	componentWillReceiveProps(){
    console.log("componentWillReceiveProps");
  }
	render(){
		return(
			<View style={{flex:1}}>
			<ScrollView style={{backgroundColor: 'silver', flex: 1}}
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
				          key={i}
				          roundAvatar
				          title={u.name}
				          avatar={{uri:"https://d30y9cdsu7xlg0.cloudfront.net/png/546908-200.png"}}
				          onPress={()=>{this._navigate(ChatRoom, {"giobalThis": this.props.giobalThis, "groupInfo":{"group_id":u._id, "name": u.name}, 'userInfo': this.props.userInfo})}} />
				      )
				    })
				  }
				</Card>
			</ScrollView>
			<ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Tạo phòng" onPress={()=>{this._navigate(CreateRoom, {'userInfo': this.props.userInfo})}}>
                  <Icon name="md-create"/>
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Tìm địa điểm" onPress={() => {}}>
                  <Icon name="md-notifications-off"/>
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="Tìm bạn" onPress={() => {}}>
                  <Icon name="md-done-all"/>
                </ActionButton.Item>
              </ActionButton>
			</View>
		);
	}
}
