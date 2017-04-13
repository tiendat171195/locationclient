'use strict'
import React, {Component} from 'react';
import {
	ScrollView,
	View,
	Text,
	Image,
	TextInput,
	Button,
	Alert,
	Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

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
		this.getDetail();

	}
	getDetail(){
		console.log(this.props._id);
		fetch('http://192.168.73.2:3000/newfeed/'+this.props._id)
		.then((response) => response.json())
		.then((responseData) => {
			//if(responseData.status === "success"){
				this.setState({
					title: responseData.title,
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
		fetch('http://192.168.73.2:3000/comment/?newfeed_id=' + this.props._id, 
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
			this.forceUpdate();
		})
		.catch((error) => {
	        console.error(error);
	        return null;
	    })
		.done();
	}
	render(){
		
		return(
			<ScrollView>
				<Image
				style={{height:height/4}}
				source={{uri: this.state.imgUrl}} />
				<Text style={{fontWeight:'bold', fontSize: 40}}>
					{this.state.title}
				</Text>
				<Text style={{fontSize: 25}}>
					{this.state.descrip}
				</Text>
				<Text>************</Text>
				<Text style={{fontSize:30}}>Bình luận:</Text>
				<View style={{flex:1, flexDirection:'row'}}>
				<TextInput 
					style={{flex:5, height: 40, borderColor: 'gray', borderWidth: 1}} 
					placeholder="Nhập bình luận của bạn..."
					onChangeText={(recentComment) => this.setState({recentComment})}
					value={this.state.text} />

				<Button
					onPress={() => {
						this.state.text = '';
						this.postComment();
					}}
					title="Gửi"
					color="#841584" 
					style={{flex:1}}/>
				</View>
				{
					this.state.comments.map((u, i) => {
						return(
							<View key={i}>
							<Text>{u.description}</Text>
							</View>
						)
					})
				}
				
			</ScrollView>
		);
	}
}