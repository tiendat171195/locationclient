'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableHighlight
} from 'react-native';

import DialogAndroid from 'react-native-dialogs';
import { Card, ListItem, Button } from 'react-native-elements';


	
export default class FriendsList extends Component {
	constructor(props){
		super(props);
		console.log('FriendList: ', props.userInfo);
		this.state = {
			_friendsList: [],
		}

	}
	componentWillMount(){
		this.getFriendsList();

	}
	showDialog = function () {
	    var dialog = new DialogAndroid();
	    dialog.set({
	    	
	      title: 'Add New Friend',
	      content: 'Enter your friend\'s ID:',
	      positiveText: 'Send Friend Request',
	      negativeText: 'Cancel',
	      input: ({
	      	hint: 'Your Friend\'s ID',
	      	callback: 
	      		(inputText)=>{
	      			console.log(inputText);
	      			
	      		}
	      })
	    });
	    dialog.show();
  	}
  	getFriendsList(){
  		fetch('http://192.168.73.2:3000/friend/friend_list/'+this.props.userInfo._id)
  		.then((response) => response.json())
		.then((responseData) => {
			//get friends list here
			for (var i = responseData.friend_list.length - 1; i >= 0; i--) {
				this.state._friendsList.push({'name': responseData.friend_list[i], 'avatar': 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7'});
			};
			this.forceUpdate();
		})
		.catch((error) => {
			console.error(error);
			return null;
		})
		.done();
  	}
  	addNewFriend(friendId){
  		//fetch('http://192.168.73.2:3000/add_friend/'+ this.props.userInfo._id+'?'+user_id=?)
  	}
	_navbar = <View style={{height:50, backgroundColor:'orange', flexDirection: 'row', justifyContent: 'space-between'}}>
					<Button style={{backgroundColor:'none'}} title='Back' onPress={()=>{
					if (this.props.navigator.getCurrentRoutes().length > 1) {
						this.props.navigator.pop();
						return true // do not exit app
					} else {
						return false // exit app
					}
				}} />
				
				<View ><Text style={{fontSize:40}}>Title</Text></View>
				<Button style={{}} title='Add' onPress={this.showDialog.bind(this)} />
				</View>;
		
	render(){
		return(
			<View>
				{this._navbar}
				<Card containerStyle={{margin:0, padding: 0}} >
				  {
				    this.state._friendsList.map((u, i) => {
				      return (
				        <ListItem
				          key={i}
				          roundAvatar
				          title={u.name}
				          avatar={{uri:u.avatar}} />

				      )
				    })
				  }
				</Card>
			
	        </View>
		);
	}


}