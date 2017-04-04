'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';

export default class SettingPage extends Component{
	constructor(props){
		super(props);
		this.state = {
		    trueSwitchIsOn: true,
		    falseSwitchIsOn: false,
		  };
	}
	_navigate(nextScreen){
		this.props.navigator.push({
			component: nextScreen,
		})
	}
	showFriendsList(){

	}
	render(){
		return(
			<ScrollView style={{backgroundColor:'gray'}}>
				<View style={{margin:2, height: 170, flexDirection:'row', backgroundColor:'white'}}>
				<View style={{backgroundColor:'red', flex:1, height: 100, borderRadius:50, marginRight: 20}}>
					<Text style={{flex:1, textAlign:'center', textAlignVertical:'center', fontSize:30}}>Avatar</Text>
				</View>
				<View style={{flex:2, marginLeft: 10}}>
					<Text style={{fontWeight:'bold', fontSize: 20	}}>User Name:</Text>
					<Text>Doan Tien Dat</Text>
					<Text style={{fontWeight:'bold', fontSize: 20	}}>Contact:</Text>
					<Text>0927987417</Text>
					<Text style={{fontWeight:'bold', fontSize: 20	}}>E-mail:</Text>
					<Text>tiendat.dee.95@gmail.com</Text>
				</View>
				</View>
				<Text style={{fontSize:20}}>----Settings----</Text>
				<View style={{padding:5, backgroundColor:'white', flexDirection:'row', justifyContent: 'space-between'}}>
				<Text style={{fontSize: 20}}>Share GPS:</Text>
				<Switch
		          onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
		          style={{marginBottom: 10}}
		          value={this.state.trueSwitchIsOn} />
				</View>
				<TouchableOpacity onPress={()=>}>
				<View style={{padding:5, backgroundColor:'white', flexDirection:'row', justifyContent: 'space-between'}}>
				<Text style={{fontSize: 20}}>Friends List</Text>
				<Text style={{padding: 5}}>></Text>
				</View>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}