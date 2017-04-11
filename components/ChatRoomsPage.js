'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Navigator
} from 'react-native';

import ChatRoom from './ChatRoom';

class ItemPage extends Component{
	render(){
		return(
			<TouchableOpacity activeOpacity={0.6} onPress={() => myNavigator.push({name:"chatroom"})}>
			<View style={{margin:2, height: 100, flexDirection:'row', backgroundColor:'white'}}>
				<View style={{backgroundColor:'red', flex:1, borderRadius:50, marginRight: 20}}>
					<Text style={{flex:1, textAlign:'center', textAlignVertical:'center', fontSize:30}}>Image</Text>
				</View>
				<View style={{flex:2, marginLeft: 10}}>
					<Text style={{fontWeight:'bold', fontSize: 20	}}>{this.props.Title}</Text>
					<Text>{this.props.Description}</Text>
				</View>
			</View>
			</TouchableOpacity>
		);
	}
}
var myNavigator;
export default class ChatRoomsPage extends Component{
	constructor(props){
		super(props);
	}
	renderScene(route, navigator){
		myNavigator = navigator;
		switch(route.name){
			case "main": return <ListRooms /> ;
			case "chatroom": return <ChatRoom /> ;
		}
	}
	render(){
		
		return(
			<Navigator
		      initialRoute={{name:"main"}}
		      renderScene={this.renderScene}
		      /*navigationBar={
     <Navigator.NavigationBar
       routeMapper={{
         LeftButton: (route, navigator, index, navState) =>
          { return (<Text>Cancel</Text>); },
         RightButton: (route, navigator, index, navState) =>
           { return (<Text>Done</Text>); },
         Title: (route, navigator, index, navState) =>
           { return (<Text>Awesome Nav Bar</Text>); },
       }}
       
	     />
	  }*/
		    />
		);
	}
}
class ListRooms extends Component{
	render(){
		return(
			<ScrollView style={{backgroundColor: 'silver', flex: 1}}>
				<Text style={{fontSize:20}}>----Phòng đang trò chuyện----</Text>
				<ItemPage Title='Title1' Description='Descrip1' />
				<ItemPage Title='Title2' Description='Descrip2' />
				<Text style={{fontSize:20}}>----Phòng công cộng----</Text>
				<ItemPage Title='Title3' Description='Descrip3' />
				<ItemPage Title='Title4' Description='Descrip4' />
				<ItemPage Title='Title5' Description='Descrip5' />
				<ItemPage Title='Title6' Description='Descrip6' />
			</ScrollView>
		);
	}
	
}
