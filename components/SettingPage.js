'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import FriendsList from './FriendsList.js';
import Login from './LogInScreen.js';
import {Avatar, Button} from 'react-native-elements';
import apis from '../apis/api.js';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default class SettingPage extends Component{
	constructor(props){
		super(props);
		this.state = {
		    trueSwitchIsOn: true,
		    falseSwitchIsOn: false,
		  };
		this.SignOut = this.SignOut.bind(this);
	}
	_navigate(nextScreen, props, type='normal'){
		this.props.navigator.push({
			component: nextScreen,
			passProps: props,
			type: type
		})
	}
	SignOut(){
		apis.SignOut();
		for (var index = 0; index < this.props.navigator.getCurrentRoutes().length-1; index++) {
			this.props.navigator.pop();
		}
	}
	render(){
		return(
			<ScrollView style={{backgroundColor:'silver'}}>
				<View style={{height: height/3.5, flexDirection:'row', backgroundColor:'white'}}>
					<Avatar
						containerStyle={{flex:2}}
						xlarge
						rounded
						source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
						onPress={() => {}}
						activeOpacity={0.7}/>
					<View style={{flex:3, marginLeft: 10}}>
						<Text style={{fontWeight:'bold', fontSize: 20	}}>Tên đăng nhập:</Text>
						<Text>{this.props.userInfo.username}</Text>
						<Text style={{fontWeight:'bold', fontSize: 20	}}>ID:</Text>
						<Text>{this.props.userInfo._id}</Text>
					</View>
				</View>
				<Text style={{fontSize:20}}>----Thiết lập----</Text>
				<View style={{padding:5, backgroundColor:'white', flexDirection:'row', justifyContent: 'space-between'}}>
				<Text style={{fontSize: 20}}>Chia sẻ GPS:</Text>
				<Switch
		          onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
		          style={{marginBottom: 10}}
		          value={this.state.trueSwitchIsOn} />
				</View>
				<TouchableOpacity onPress={()=>{
					this._navigate(FriendsList, {'userInfo': this.props.userInfo}, 'Modal');
				}}>
				<View style={{padding:5, backgroundColor:'white', flexDirection:'row', justifyContent: 'space-between'}}>
					<Text style={{fontSize: 20}}>Danh sách bạn bè</Text>
					<Text style={{padding: 5, fontSize: 20}}>></Text>
				</View>
				</TouchableOpacity>
				<Button
					buttonStyle={{margin: 15}}
					onPress={this.SignOut}
					backgroundColor="red"
					title="Đăng xuất"
					color="white" />
			</ScrollView>
		);
	}
}