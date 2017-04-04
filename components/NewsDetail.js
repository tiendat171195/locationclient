'use strict'
import React, {Component} from 'react';
import {
	ScrollView,
	View,
	Text,
	Image,
	TextInput,
	Button,
	Alert
} from 'react-native';
class Comment extends Component {
	render(){
		return(
			<View style={{backgroundColor: 'white', topMargin:2, bottomMargin:2}}>
				{this.props.descrip[index].description}
			</View>
		);
	}
}
export default class NewsDetail extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			title: '',
			imgUrl: '',
			descrip: '',
			rate: 0,
			location: '',
			comments: [],
			recentComment: '',
			CommentsContent: [],
		}
		fetch('http://192.168.73.2:3000/newfeed/58d5f105717c6320c0ee82cc', {"method": "GET"})
		.then((response) => response.json())
		.then((responseData) => {
			//if(responseData.status === "success"){
				this.setState({
					title: responseData.title + "đasdasfasfasfascascascascascas",
					imgUrl: responseData.image,
					descrip: responseData.description,
					location: responseData.location,
					rate: responseData.rate,
					comments: responseData.comments,
				});
			//}
		})
		.catch((error) => {
			console.error(error);
			return null;
		})
		.done();

	}
	
	postComment(){
		fetch('http://192.168.73.2:3000/comment/?newfeed_id=58d5f105717c6320c0ee82cc', 
			{method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			    description: this.state.recentComment,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			Alert.alert(
				"Done!",
				'Done'
			);
			
		})
		.catch((error) => {
	        console.error(error);
	        return null;
	    })
		.done();
	}
	render(){
		for (let i = this.state.comments.length - 1; i >= 0; i--) {
			this.state.CommentsContent.push(<View key={i}>
			<Text>{this.state.comments[i].description}</Text>
			</View>);
		}
		return(
			<ScrollView>
				<View style={{flex:1, flexDirection: 'row', backgroundColor: 'white'}}>
					<View style={{flex:2}}>
						<Image
						
						style={{flex:1}}
						source={{uri:this.state.imgUrl}} />
						
					</View>
					<View style={{flex:5}}>
						<Text style={{fontSize: 50}}>
							{this.state.title}
						</Text>
					</View>
				</View>
				<View>
					<Text style={{fontSize: 35}}>
						{this.state.descrip}
					</Text>
				</View>
				
				{this.state.CommentsContent}

				<View style={{flex:1, flexDirection:'row'}}>
				<TextInput 
					style={{flex:5, height: 40, borderColor: 'gray', borderWidth: 1}} 
					placeholder="Write a comment"
					onChangeText={(recentComment) => this.setState({recentComment})}
					value={this.state.text} />

				<Button
					onPress={() => this.postComment()}
					title="Send"
					color="#841584" 
					style={{flex:1}}/>
				</View>
			</ScrollView>
		);
	}
}