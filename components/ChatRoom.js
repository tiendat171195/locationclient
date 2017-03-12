'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView
} from 'react-native';

class ItemPage extends Component{
	render(){
		return(
			<View style={{margin:2, height: 100, flexDirection:'row', backgroundColor:'white'}}>
				<View style={{backgroundColor:'red', flex:1, borderRadius:50, marginRight: 20}}>
					<Text style={{flex:1, textAlign:'center', textAlignVertical:'center', fontSize:30}}>Image</Text>
				</View>
				<View style={{flex:2, marginLeft: 10}}>
					<Text style={{fontWeight:'bold', fontSize: 20	}}>{this.props.Title}</Text>
					<Text>{this.props.Description}</Text>
				</View>
			</View>
		);
	}
}
export default class ChatRoomPage extends Component{
	render(){
		return(
			<ScrollView style={{backgroundColor: 'gray', flex: 1}}>
				<Text style={{fontSize:20}}>----Recent Room----</Text>
				<ItemPage Title='Title1' Description='Descrip1' />
				<ItemPage Title='Title2' Description='Descrip2' />
				<Text style={{fontSize:20}}>----Public Room----</Text>
				<ItemPage Title='Title3' Description='Descrip3' />
				<ItemPage Title='Title4' Description='Descrip4' />
				<ItemPage Title='Title5' Description='Descrip5' />
				<ItemPage Title='Title6' Description='Descrip6' />
			</ScrollView>
		);
	}
}
