'use strict';
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableHighlight,
    Alert,
    TextInput,
    Button,
    ToolbarAndroid
} from 'react-native';
import { Actions } from "react-native-router-flux";
import apis from '../apis/api.js';
import {MAIN_COLOR, MAIN_FONT} from './type.js';
export default class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newRoomName: '',
        };
    }
    async CreateNewRoom(RoomName) {
        let responseAPI = await apis.createNewRoom(RoomName);
        if (responseAPI == null) {
            return;
        }
        Actions.pop();
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ToolbarAndroid
                    style={{ height: 50, backgroundColor: MAIN_COLOR }}
                    navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                    title='Tạo phòng'
                    
                    onIconClicked={() => {
                        Actions.pop();
                        return true
                    }}/>
                <ScrollView>
                    <TextInput
                        style={{ fontSize: 25, fontFamily: MAIN_FONT }}
                        onChangeText={(text) => this.setState({ newRoomName: text })}
                        value={this.state.newRoomName}
                        placeholder="Tên phòng"
                    />
                    <TextInput
                        style={{ maxHeight:100, fontSize: 25, fontFamily: MAIN_FONT }}
                        onChangeText={(text) => this.setState({ newRoomName: text })}
                        value={this.state.newRoomName}
                        multiline={true}
                        placeholder="Mô tả"
                    />
                    <Text>Thêm thành viên</Text>
                    <Button
                        onPress={() => { this.CreateNewRoom(this.state.newRoomName) }}
                        title="Tạo"
                        color="#841584"
                    />
                </ScrollView>
            </View>
        );
    }
}