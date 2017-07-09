'use strict';
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableHighlight,
    Image,
    Alert,
    TextInput,
    Button,
    ToolbarAndroid,
    TouchableOpacity
} from 'react-native';
import { Actions } from "react-native-router-flux";
import apis from '../apis/api.js';
import { MAIN_COLOR, MAIN_FONT } from './type.js';
import { Card, ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import {
	getRooms,
} from '../actions';
class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newRoomName: '',
            descriptionRoom: '',
            added_list: [],
            friends_list: []
        };
        this.CreateNewRoom = this.CreateNewRoom.bind(this);
        this.AddNewMember = this.AddNewMember.bind(this);
    }
    async AddNewMember(GroupID, NewMemberID) {
		let responseAPI = await apis.addNewMember(GroupID, NewMemberID);
		if (responseAPI == null) {
			return;
		}
	}
    async CreateNewRoom(RoomName) {
        let responseAPI = await apis.createNewRoom(RoomName);
        if (responseAPI == null) {
            return;
        }
        
        this.state.added_list.map(async user=>{
            console.log(user);
            await apis.addNewMember(responseAPI.group_id, user._id);
        })
        this.props.getRooms();

        Actions.pop();
        //if(responseAPI.status == "success"){
        //}
		/*else{
			Alert.alert(
				'Lỗi đăng nhập',
				responseAPI.message
			);
		}*/
    }
    componentWillMount() {
        this.state.friends_list = this.props.friendsList;
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
                    }} />
                <ScrollView>
                    <TextInput
                        style={{ fontSize: 25, 
                                fontFamily: MAIN_FONT, 
                                marginHorizontal: 20, 
                                marginVertical:5, 
                                backgroundColor:'silver', 
                                borderRadius:5,
                                 }}
                        onChangeText={(text) => this.setState({ newRoomName: text })}
                        value={this.state.newRoomName}
                        placeholder="Tên phòng"
                        underlineColorAndroid='transparent'
                    />
                    <View style={{ paddingLeft: 30, flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            style={{ height: 30, width: 30, marginTop:10, alignSelf:'center' }}
                            resizeMode='contain'
                            source={{ uri: 'https://d30y9cdsu7xlg0.cloudfront.net/png/38220-200.png' }} />
                        <Text style={{ fontSize: 20, paddingLeft: 3, color: 'black', fontWeight: 'bold' }}>Thêm thành viên</Text>
                    </View>
                    <Card containerStyle={{ margin: 0, padding: 0 }} >
                        {
                            this.state.added_list.map((friend, i) => {
                                return (
                                    <ListItem
                                        key={i}
                                        roundAvatar
                                        hideChevron={true}
                                        title={friend.username}
                                        titleStyle={{ fontSize: 25 }}
                                        rightTitle={
                                            <TouchableOpacity onPress={() => {
                                                this.state.friends_list.push(friend);
                                                this.state.added_list.splice(i, 1);
                                                this.forceUpdate();
                                            }}>
                                                <Image
                                                    style={{ height: 40, width: 40 }}
                                                    source={{ uri: 'http://www.iconsplace.com/download/red-minus-2-256.png' }} />
                                            </TouchableOpacity>
                                        }
                                        avatarStyle={{ height: 48, width: 48, borderRadius: 24 }}
                                        avatar={{ uri: friend.avatar_url }}
                                        onPress={() => console.log('Clicked')} />
                                )
                            })
                        }
                    </Card>
                    <Card containerStyle={{ margin: 0, padding: 0 }} >
                        {
                            this.state.friends_list.map((friend, i) => {
                                return (
                                    <ListItem
                                        key={i}
                                        roundAvatar
                                        hideChevron={true}
                                        title={friend.username}
                                        titleStyle={{ fontSize: 25 }}
                                        rightTitle={
                                            <TouchableOpacity onPress={() => {
                                                this.state.added_list.push(friend);
                                                this.state.friends_list.splice(i, 1);
                                                this.forceUpdate();
                                            }}>
                                                <Image
                                                    style={{ height: 40, width: 40 }}
                                                    source={{ uri: 'https://cdn.pixabay.com/photo/2014/04/02/10/55/plus-304947_640.png' }} />
                                            </TouchableOpacity>
                                        }
                                        avatarStyle={{ height: 48, width: 48, borderRadius: 24 }}
                                        avatar={{ uri: friend.avatar_url }}
                                        onPress={() => console.log('Clicked')} />
                                )
                            })
                        }
                    </Card>
                    <View
                        style={{alignSelf:'center', marginBottom: 50, marginTop:10, width:200 }}>
                    <Button
                        
                        onPress={() => { this.CreateNewRoom(this.state.newRoomName) }}
                        title="Tạo"
                        color="#841584"
                    />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getRooms: () => dispatch(getRooms()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateRoom);