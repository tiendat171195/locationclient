'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	ViewPagerAndroid,
	TouchableOpacity,
	Navigator,
	Image,
	Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

import NewsDetail from './NewsDetail';
import apis from '../apis/api.js';

class ItemPage extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<TouchableOpacity activeOpacity={0.6} onPress={()=>{
				this.props.navigator.push({
					component: NewsDetail,
					passProps: this.props.info
				});
			}} >
				<View style={{margin:2, height: height/5, flexDirection:'row', backgroundColor:'white'}}>
					<View style={{flex:1}}>
						<Image
							style={{flex:1}}
							source={{uri: this.props.ImgUrl}} />
					</View>
					<View style={{padding:10, flex:2, marginLeft: 10}}>
						<Text numberOfLines={1} style={{fontWeight:'bold', fontSize: 20}}>{this.props.Title}</Text>
						<Text numberOfLines={3}>{this.props.Description}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}
export default class NewsFeedPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			_newsfeed: [],
		}
		this.getNewsFeed();
	}
	
	async getNewsFeed(){
		let responseAPI = await apis.getNewsFeed();
		for (var i = responseAPI.newfeeds.length - 1; i >= 0; i--) {
			this.state._newsfeed.push(
				responseAPI.newfeeds[i]
			)
		};
		this.forceUpdate();
	}
	render(){
		return(
			<ScrollView style={{flex:1, backgroundColor:'silver'}}>
				<ViewPagerAndroid style={{flex: 1,height:height/3}}>
					{
						this.state._newsfeed.map((u, i) => {
							return (
								<View key={i} style={{flex:1}} onPress={()=>{
									this.props.navigator.push({
										component: NewsDetail,
										passProps: u
									});
								}}>
									<TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={()=>{
									console.log("pressed");
									this.props.navigator.push({
										component: NewsDetail,
										passProps: u
									});
								}}>
									<Image
										style={{flex:1, height: height/3}}
										source={{uri: u.image}}
										onPress={()=>console.log('Image Pressed')}>
										<View><Text numberOfLines={1} style={{color: 'white', fontWeight:'bold', fontSize:20}}>{u.title}</Text></View>
									</Image>
									</TouchableOpacity>
								</View>
						)})
					}		
				</ViewPagerAndroid>
				{
				this.state._newsfeed.map((u, i) => {
					return (
						<ItemPage key={i} Title={u.title} Description={u.description} ImgUrl={u.image} navigator={this.props.navigator} {...{'info': u}} />
				)})
				
				}
				
				
			</ScrollView>
		);
	}
}
