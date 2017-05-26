'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Image,
  ToolbarAndroid,
  TextInput,
  DatePickerAndroid,
  StyleSheet,
  TimePickerAndroid,
  Button
} from 'react-native';

import io from 'socket.io-client/dist/socket.io.js';
import apis from '../apis/api.js';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var myThis;
export default class RoomSetting extends Component{
    constructor(props){
        super(props);
        myThis = this;
        this.state = {
            room_name: '',
            editting_room_name: false,
            start_date: 0,
            end_date: 0,
            appointment_address: '',
            appointment_location: null
        };
        this.showEndDatePicker = this.showEndDatePicker.bind(this);
        this.showStartDatePicker = this.showStartDatePicker.bind(this);
        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showEndTimePicker = this.showEndTimePicker.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.startSocket = this.startSocket.bind(this);
        this.getSocketData = this.getSocketData.bind(this);
        this.getAppointmentInfo = this.getAppointmentInfo.bind(this);
    }
    startSocket(){
        this.socket = io('http://192.168.83.2:3000/maps', {jsonp:false});

        this.socket.on('update_starting_point_callback', function(data){
            if(myThis.props.groupInfo.group_id != data.group_id) return;
            myThis.setState({
                room_name: data.name,
                start_date: data.start_time,
            });
            myThis.getAppointmentInfo({latitude: data.start_latlng.lat,
                                        longitude: data.start_latlng.lng});
                                        
        });
        this.socket.on('get_starting_point_callback', function(data){
            if(myThis.props.groupInfo.group_id != data.group_id) return;
            myThis.setState({
                room_name: data.hasOwnProperty("name")?data.name:myThis.props.groupInfo.name,
                start_date: data.hasOwnProperty("start_time")?data.start_time:0,
            });
            if(data.hasOwnProperty("start_latlng")) 
                myThis.getAppointmentInfo({latitude: data.start_latlng.lat,
                                        longitude: data.start_latlng.lng});
        });
    }
    getSocketData(){
        this.socket.emit('get_starting_point', JSON.stringify({"token": this.props.userInfo.token,
                                                "group_id": this.props.groupInfo.group_id}));
    }
    updateSocketData(){
        this.socket.emit('update_starting_point', JSON.stringify({"token": this.props.userInfo.token,
                                                "group_id": this.props.groupInfo.group_id,
                                                "start_time": this.state.start_date,
                                                "start_latlng":{
                                                    "lat":this.state.appointment_location.latitude,
                                                    "lng":this.state.appointment_location.longitude
                                                }}));
    }
    componentWillMount(){
        /*this.setState({
            room_name: this.props.groupInfo.name,
        });*/
        this.startSocket();
        this.getSocketData();
        
    }
    async showStartTimePicker(){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: (new Date(this.state.start_date)).getHours(),
                minute: (new Date(this.state.start_date)).getMinutes(),
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.showStartDatePicker(hour, minute);
            }
            } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
            }
    }
    async showStartDatePicker(hour, minute){
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: this.state.start_date===0?new Date(Date()): new Date(this.state.start_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                
                this.setState({start_date: new Date(year, month, day, hour, minute).getTime()});
                
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
            }
    }
    async showEndTimePicker(){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: (new Date(this.state.end_date)).getHours(),
                minute: (new Date(this.state.end_date)).getMinutes(),
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.showEndDatePicker(hour, minute);
            }
            } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
            }
    }
    async showEndDatePicker(hour, minute){
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(this.state.end_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                
                this.setState({end_date: new Date(year, month, day, hour, minute).getTime()});
                
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
            }
    }
    onMapPress(e) {
        this.getAppointmentInfo({'latitude': e.nativeEvent.coordinate.latitude,
                'longitude': e.nativeEvent.coordinate.longitude})
    }
    async getAppointmentInfo(location){
        try{
            let responseAPI = await apis.getInfoLocation_googleAPI(location);
            if(responseAPI.status === "OK"){
                this.setState({
                    appointment_address: responseAPI.results[0].formatted_address,
                    appointment_location:{
                        latitude: responseAPI.results[0].geometry.location.lat,
                        longitude: responseAPI.results[0].geometry.location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                })
            }
        }catch(error){
            console.error(error);
        }
    }
    render(){
        return(
            <View style={{flex:1}}>
                <ToolbarAndroid
                    style={{height:50, backgroundColor:'sandybrown'}}
                    navIcon={{uri:"http://semijb.com/iosemus/BACK.png", width:50, height:50}}
                    title={'Cài đặt phòng'}
                    onIconClicked={()=>{this.props.navigator.pop();
                                        return true }}
                    onActionSelected={this.onActionSelected} />
                <ScrollView style={{flex:1}}>
                    <Text style={{fontSize: 25}}>Tên phòng:</Text>
                    <View style={{flexDirection:'row'}}>
                    <TextInput
                        style={{flex:1, fontSize: 25, marginHorizontal: 5}}
                        onChangeText={(text) => this.setState({room_name: text})}
                        value={this.state.room_name}
                        editable={this.state.editting_room_name}
                        onEndEditing={()=>{
                            this.setState({editting_room_name: false});
                        }}
                        />
                    <Text style={{marginHorizontal: 5, textAlignVertical:'center', color:'blue'}}
                        onPress={()=>this.state.editting_room_name?
                            this.setState({editting_room_name: false})
                            :this.setState({editting_room_name: true})}>
                        {this.state.editting_room_name ? "Xong" : "Sửa"}
                    </Text>
                    </View>

                    <Text style={{fontSize: 25}}>Ngày hẹn:</Text>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize: 15}}>{this.state.start_date===0?'Chưa chọn thời gian hẹn':'' + new Date(this.state.start_date)}</Text>
                    <Text style={{fontSize: 15, marginHorizontal: 5, textAlignVertical:'center', color:'blue'}}
                        onPress={this.showStartTimePicker}>
                        Sửa
                    </Text>
                    </View>
                    <View style={{height:0}}>
                        <Text style={{fontSize: 25}}>Ngày kết thúc:</Text>
                        <View style={{flexDirection:'row'}}>
                        <Text>{this.state.end_date===''?'Chưa chọn thời gian kết thúc':'' + new Date(this.state.end_date)}</Text>
                        <Text style={{fontSize: 25, marginHorizontal: 5, textAlignVertical:'center', color:'blue'}}
                            onPress={this.showEndTimePicker}>
                            Sửa
                        </Text>
                        </View>
                    </View>
                    <Text style={{fontSize: 25}}>Chọn vị trí:</Text>
                    <View style={{flexDirection:'row'}}>
                    <TextInput
                        style={{flex:1, fontSize: 15, marginHorizontal: 5}}
                        onChangeText={(text) => this.setState({appointment_address: text})}
                        value={this.state.appointment_address}
                        placeholder="Nhập điểm hẹn"
                        />
                    <Text style={{fontSize:25, marginHorizontal: 5, textAlignVertical:'center', color:'blue'}}
                            onPress={()=>{this.getAppointmentInfo(this.state.appointment_address)}}
                            >
                        Tìm
                    </Text>
                    </View>
                    <MapView
                        style={{height: 250, marginVertical: 10}} 
                        onPress={this.onMapPress}
                        toolbarEnabled={false}
                        region={this.state.appointment_location!==null?{latitude:10.764798, longitude:106.681714, latitudeDelta: LATITUDE_DELTA, longitudeDelta:LONGITUDE_DELTA}
                                                                                    :this.state.appointment_location}>
                        {this.state.appointment_location!==null?
                            <MapView.Marker
                            title='Điểm hẹn'
                            key={0}
                            coordinate={this.state.appointment_location}
                            draggable={true}
                            onDragEnd={(e)=>this.getAppointmentInfo(e.nativeEvent.coordinate)}
                            />
                            :<View/>}
                        
                    </MapView>
                    <Button
                        onPress={() => this.updateSocketData()}
                        title="Hoàn tất"
                        color="#840384" />
                </ScrollView>
            </View>
        );
    }
}