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
  AsyncStorage,
  ToolbarAndroid,
  StyleSheet
} from 'react-native';
import {Actions} from "react-native-router-flux";
import FriendsList from './FriendsList.js';
import Login from './LogInScreen.js';
import {Avatar, Button} from 'react-native-elements';
import apis from '../apis/api.js';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
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
		Actions.pop();
	}
	render(){
		return(
			<View style={{flex:1}}>
				
				<ParallaxScrollView 
					parallaxHeaderHeight={height/2}
					backgroundColor='white'
					renderBackground={()=>(
						<View style={{backgroundColor:'white'}}>
						<Image 
							style={{width:width/2, height:width/2, alignSelf:"center", borderRadius:width/4}}
							resizeMode="cover"
							
							source={{ uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7" }}
							/>
						</View>
					)}
					renderForeground={()=>(
						<View style={{height:height/2}}>
							<TouchableOpacity style={{opacity:0, width:width/2, height:width/2, alignSelf:"center", borderRadius:width/4, backgroundColor:"silver"}}
								onPress={()=>{console.log('Onpress')}}
								activeOpacity={0.15} />
						<View style={{height:height/2 -width/2, alignItems:'center', justifyContent:'flex-start'}}>
							<Text style={{fontFamily:'sans-serif', fontSize: 30, fontWeight:'bold'}}>{this.props.userInfo.username}</Text>
							<Text style={{ fontFamily: 'sans-serif', fontSize: 20 }}>17/11/1995</Text>
						</View>
						</View>
					)}>




					<Text style={{ fontSize: 20 }}>----Thiết lập----</Text>
					<View style={{ padding: 5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 20 }}>Chia sẻ GPS:</Text>
						<Switch
							onValueChange={(value) => this.setState({ trueSwitchIsOn: value })}
							style={{ marginBottom: 10 }}
							value={this.state.trueSwitchIsOn} />
					</View>
					<TouchableOpacity onPress={() => {
						Actions.friendslist({ 'userInfo': this.props.userInfo });
					}}>
						<View style={{ padding: 5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 20 }}>Danh sách bạn bè</Text>
							<Image
								style={{ height: 20, width: 20, alignItems: 'flex-end' }}
								source={{ uri: 'https://image.flaticon.com/icons/png/128/60/60758.png' }}
								resizeMethod="resize"
							/>
						</View>
					</TouchableOpacity>



					<Button
						buttonStyle={{ margin: 0 }}
						onPress={this.SignOut}
						backgroundColor="red"
						title="Đăng xuất"
						color="white" />
				</ParallaxScrollView>
				
			</View>
		);
	}
}