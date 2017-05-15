'use strict';
import React, {Component} from 'react';
import {
    ScrollView,
	View,
	Text,
	TouchableHighlight,
	Alert,
    TextInput,
    Button
} from 'react-native';

import apis from '../apis/api.js';

export default class CreateRoom extends Component{
    constructor(props){
        super(props);
        this.state = {
            newRoomName: '',
        };
    }
    async CreateNewRoom(RoomName){
        let responseAPI = await apis.createNewRoom(RoomName);
		if(responseAPI == null){
			return;
		} 
        this.props.navigator.pop();
		//if(responseAPI.status == "success"){
			console.log(responseAPI);
		//}
		/*else{
			Alert.alert(
				'Lỗi đăng nhập',
				responseAPI.message
			);
		}*/
    }
    render(){
        return(
            <ScrollView>
               <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({newRoomName: text})}
                    value={this.state.newRoomName}
                    placeholder="Nhập tên của phòng"
                /> 
                <Button
                    onPress={()=>{this.CreateNewRoom(this.state.newRoomName)}}
                    title="Tạo"
                    color="#841584"
                />
            </ScrollView>
        );
    }
}