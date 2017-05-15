'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage
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
	async SignOut(){
		let responseAPI = await apis.SignOut();
		if(responseAPI.success){
			try {
				await AsyncStorage.setItem('LOGGED_IN', 'false');
				await AsyncStorage.removeItem('USER_INFO');
				apis.updateUserInfo('', '');
			} catch (error) {
				console.error(error);
			}
		}
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
						source={{uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7"}}
						onPress={() => {}}
						activeOpacity={0.7}/>
					<View style={{flex:3, marginLeft: 10}}>
						<Text style={{fontWeight:'bold', fontSize: 20	}}>Tên đăng nhập:</Text>
						<Text>{this.props.userInfo.username}</Text>
						<Text style={{fontWeight:'bold', fontSize: 20	}}>ID:</Text>
						<Text>{this.props.userInfo.user_id}</Text>
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
					this._navigate(FriendsList, {'userInfo': this.props.userInfo});
				}}>
				<View style={{padding:5, backgroundColor:'white', flexDirection:'row', justifyContent: 'space-between'}}>
					<Text style={{fontSize: 20}}>Danh sách bạn bè</Text>
					<Image
						style={{height:20, width:20, alignItems: 'flex-end'}}
						source={{uri: 'https://image.flaticon.com/icons/png/128/60/60758.png'}}
						resizeMethod="resize"
						/>
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