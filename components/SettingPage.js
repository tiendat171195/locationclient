'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import FriendsList from './FriendsList.js'
import {Avatar} from 'react-native-elements'
export default class SettingPage extends Component{
	constructor(props){
		super(props);
		console.log(props.userInfo);
		this.state = {
		    trueSwitchIsOn: true,
		    falseSwitchIsOn: false,
		  };
	}
	_navigate(nextScreen, props, type='normal'){
		this.props.navigator.push({
			component: nextScreen,
			passProps: props,
			type: type
		})
	}
	render(){
		return(
			<ScrollView style={{backgroundColor:'silver'}}>
				<View style={{height: 170, flexDirection:'row', backgroundColor:'white'}}>
				<Avatar
				containerStyle={{flex:2}}
				  xlarge
				  rounded
				  source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
				  onPress={() => console.log("Works!")}
				  activeOpacity={0.7}
				/>
				<View style={{flex:2, marginLeft: 10}}>
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
			</ScrollView>
		);
	}
}