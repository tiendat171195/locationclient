'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	ViewPagerAndroid,
	TouchableOpacity,
	Navigator
} from 'react-native';


import NewsDetail from './NewsDetail';

class ItemPage extends Component{
	render(){
		return(
			<TouchableOpacity activeOpacity={0.6} onPress={()=>{
				this.props.navigator.push({
					component: NewsDetail,
				});
			}} >
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
export default class NewsFeedPage extends Component{
	constructor(props){
		super(props);
		
	}
	render(){
		return(
			<ScrollView style={{flex:1}}>
				<ViewPagerAndroid style={{height:200}}>
				<View style={{backgroundColor:'blue'}}></View>
				<View style={{backgroundColor:'yellow'}}></View>
				<View style={{backgroundColor:'green'}}></View>
				</ViewPagerAndroid>
				<ItemPage Title='Title1' Description='Descrip1' navigator={this.props.navigator}  />
				<ItemPage Title='Title2' Description='Descrip2' />
				<ItemPage Title='Title3' Description='Descrip3' />
				<ItemPage Title='Title4' Description='Descrip4' />
				<ItemPage Title='Title5' Description='Descrip5' />
				<ItemPage Title='Title6' Description='Descrip6' />
			</ScrollView>
		);
	}
}
