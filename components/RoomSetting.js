'use strict';
import React, { Component } from 'react';
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
    Button,
    ToastAndroid,
    Alert
} from 'react-native';
import { Actions } from "react-native-router-flux";
import io from 'socket.io-client/dist/socket.io.js';
import apis from '../apis/api.js';
import MapView from 'react-native-maps';
import DialogAndroid from 'react-native-dialogs';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const DEFAULT_LATITUDE = 10.762934;
const DEFAULT_LONGITUDE = 106.682038;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var giobalThis;
var id = 100;
//const API_path = 'http://192.168.83.2:3000/';
const API_path = 'https://stormy-woodland-18039.herokuapp.com/';
export default class RoomSetting extends Component {
    constructor(props) {
        super(props);
        giobalThis = this;
        this.state = {
            room_name: this.props.groupInfo.name,
            editting_room_name: false,
            start_location: null,
            start_address: null,
            start_date: null,
            end_location: null,
            end_address: null,
            end_date: null,
            stopovers: [],
            direction_coordinates: [],
            appointments: [],
            previousNumAppointments: 0,
        };
        this.showEndDatePicker = this.showEndDatePicker.bind(this);
        this.showStartDatePicker = this.showStartDatePicker.bind(this);
        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showEndTimePicker = this.showEndTimePicker.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.startNewSocket = this.startNewSocket.bind(this);
        this.getSocketData = this.getSocketData.bind(this);
        this.getPointerInfo = this.getPointerInfo.bind(this);
    }
    startNewSocket(groupID) {
        if (groupID === null) return;
        if (this.socket !== undefined) this.socket.disconnect();
        this.socket = io(API_path + 'maps?group_id=' + groupID, { jsonp: false });
        this.socket.emit('authenticate', { "token": this.props.userInfo.token });
        this.socket.on('authenticated', function () {
            giobalThis.addSocketCallback();
            giobalThis.getSocketData(groupID);
        });
        this.socket.on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
        });
    }
    addSocketCallback() {
        this.socket.on('get_starting_point_callback', function (data) {
            if (giobalThis.props.groupInfo.group_id != data.group_id) return;
            if (data.hasOwnProperty("start_time")) {
                giobalThis.setState({
                    start_date: data.start_time
                })
            }
        });

        this.socket.on('get_ending_point_callback', function (data) {
            if (giobalThis.props.groupInfo.group_id != data.group_id) return;
            if (data.hasOwnProperty("end_time")) {
                giobalThis.setState({
                    end_date: data.end_time
                })
            }
        });

        

        this.socket.on('get_route_callback', async function(data){
            console.log("get_route_callback");
            console.log(data);
            if (data.hasOwnProperty("start_latlng")) {
                var pointer = await giobalThis.getPointerInfo({
                    latitude: data.start_latlng.lat,
                    longitude: data.start_latlng.lng
                });
                giobalThis.state.start_location = {
                        "latitude": pointer.coordinate.latitude,
                        "longitude": pointer.coordinate.longitude
                };
                giobalThis.state.start_address = pointer.address;
            }

            if (data.hasOwnProperty("end_latlng")) {
                var pointer = await giobalThis.getPointerInfo({
                    latitude: data.end_latlng.lat,
                    longitude: data.end_latlng.lng
                });
                giobalThis.state.end_location = {
                        "latitude": pointer.coordinate.latitude,
                        "longitude": pointer.coordinate.longitude
                };
                giobalThis.state.end_address = pointer.address;
            }

            giobalThis.state.stopovers = [];
            data.stopovers.map(u => {
                giobalThis.state.stopovers.push({
                    "coordinate":
                    {
                        "latitude": u.latlng.lat,
                        "longitude": u.latlng.lng
                    }
                });
            });
            giobalThis.animationMap();
            giobalThis.findDirection(giobalThis.state.start_location, giobalThis.state.end_location);
        });
        this.socket.on('get_appointments_callback', function (data) {
            console.log("get_appointments_callback");
            console.log(data);
            giobalThis.state.appointments = [];
            
            data.appointments.map(u=>{
                giobalThis.state.appointments.push({
                    "coordinate":
                    {
                        "latitude": u.latlng.lat,
                        "longitude": u.latlng.lng
                    }
                })
                giobalThis.state.previousNumAppointments++;
            });
        });
    }
    getSocketData(groupID) {
        this.socket.emit('get_starting_point', JSON.stringify({
            "group_id": this.props.groupInfo.group_id
        }));
        this.socket.emit('get_ending_point', JSON.stringify({
            "group_id": this.props.groupInfo.group_id
        }));
        this.socket.emit('get_route', JSON.stringify({
            "group_id": this.props.groupInfo.group_id
        }));
        this.socket.emit('get_appointments', JSON.stringify({
            "group_id": this.props.groupInfo.group_id
        }));

    }
    checkValid() {
        if (this.state.start_date === null || this.state.start_latlng === null) {
            Alert.alert(
                "Lỗi",
                "Vui lòng điền đầy đủ thông tin phòng"
            )
            return false;
        }
        return true;
    }
    updateSocketData() {
        if (this.checkValid()) {
            this.socket.emit('update_starting_point', JSON.stringify({
                "group_id": this.props.groupInfo.group_id,
                "start_time": this.state.start_date,
                "start_latlng": {
                    "lat": this.state.start_location.latitude,
                    "lng": this.state.start_location.longitude
                }
            }));

            this.socket.emit('update_ending_point', JSON.stringify({
                "group_id": this.props.groupInfo.group_id,
                "end_time": this.state.end_date,
                "end_latlng": {
                    "lat": this.state.end_location.latitude,
                    "lng": this.state.end_location.longitude
                }
            }));

            var tempStopovers = [];
            for (var index = 0; index < this.state.stopovers.length; index++) {
                tempStopovers.push({
                    "latlng": {
                        "lat": this.state.stopovers[index].coordinate.latitude,
                        "lng": this.state.stopovers[index].coordinate.longitude
                    }
                })
            }

            this.socket.emit('add_route', JSON.stringify({
                "group_id": this.props.groupInfo.group_id,
                "start_latlng": {
                    "lat": this.state.start_location.latitude,
                    "lng": this.state.start_location.longitude
                },
                "end_latlng": {
                    "lat": this.state.end_location.latitude,
                    "lng": this.state.end_location.longitude
                },
                "stopovers": tempStopovers
            }));

            for (var index = this.state.previousNumAppointments; index < this.state.appointments.length; index++) {
                this.socket.emit('add_appointment', JSON.stringify({
                    "group_id": this.props.groupInfo.group_id,
                    "address": "",
                    "start_time": 0,
                    "end_time": 0,
                    "latlng": {
                        "lat": this.state.appointments[index].coordinate.latitude,
                        "lng": this.state.appointments[index].coordinate.longitude
                    }
                }));
                
            }

            Alert.alert(
                'Thông báo',
                'Cập nhật thông tin phòng thành công',
                [
                    { text: 'Xác nhận', onPress: () => Actions.pop() },
                ],
                { cancelable: false }
            )
        }
    }
    componentWillMount() {
        this.startNewSocket(this.props.groupInfo.group_id);
    }
    async showStartTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: (new Date(this.state.start_date !== null ? this.state.start_date : (new Date()).getTime())).getHours(),
                minute: (new Date(this.state.start_date !== null ? this.state.start_date : (new Date()).getTime())).getMinutes(),
                is24Hour: false,
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.showStartDatePicker(hour, minute);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }
    async showStartDatePicker(hour, minute) {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: this.state.start_date === null ? new Date(Date()) : new Date(this.state.start_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day

                this.setState({ start_date: new Date(year, month, day, hour, minute).getTime() });

            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    async showEndTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: (new Date(this.state.end_date !== null ? this.state.end_date : (new Date()).getTime())).getHours(),
                minute: (new Date(this.state.end_date !== null ? this.state.end_date : (new Date()).getTime())).getMinutes(),
                is24Hour: false,
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                this.showEndDatePicker(hour, minute);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }
    async showEndDatePicker(hour, minute) {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: this.state.end_date === null ? new Date(Date()) : new Date(this.state.end_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day

                this.setState({ end_date: new Date(year, month, day, hour, minute).getTime() });

            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    onMapPress(e) {
        this.showChoseMarkerDialog(e.nativeEvent.coordinate);
    }
    async getPointerInfo(location) {
        try {
            let responseAPI = await apis.getInfoLocation_googleAPI(location);
            if (responseAPI.status === "OK") {
                return {
                    "address": responseAPI.results[0].formatted_address,
                    "coordinate": {
                        latitude: responseAPI.results[0].geometry.location.lat,
                        longitude: responseAPI.results[0].geometry.location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    showChoseMarkerDialog = function (location) {
        var dialog = new DialogAndroid();
        dialog.set({
            title: 'Chọn kiểu',
            items: [
                "Điểm bắt đầu",
                "Điểm kết thúc",
                "Điểm dừng chân",
                "Điểm hẹn"
            ],
            negativeText: 'Hủy',
            itemsCallback: (id, text) => this.addMarkerOnMap(location, id),
        });
        dialog.show();
    }
    async addMarkerOnMap(location, type) {
        var marker = await this.getPointerInfo(location);
        switch (type) {
            case 0: //Điểm bắt đầu
                this.setState({
                    start_location: marker.coordinate,
                    start_address: marker.address
                })
                this.findDirection(this.state.start_location, this.state.end_location);
                break;
            case 1: //Điểm kết thúc
                this.setState({
                    end_location: marker.coordinate,
                    end_address: marker.address
                })
                this.findDirection(this.state.start_location, this.state.end_location);
                break;
            case 2: //Điểm dừng chân
                this.state.stopovers.push(marker);
                this.forceUpdate();
                this.findDirection(this.state.start_location, this.state.end_location);
                break;
            case 3:
                this.state.appointments.push(marker);
                this.forceUpdate();
                break;
            default:
                break;
        }
    }
    _decode(t, e) {
        for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
    }
    async findDirection(startLocation, endLocation) {
        if (startLocation === null || endLocation === null) return;

        var directions = [];
        var stopovers = this.state.stopovers.slice(0);
        var currentPoint = startLocation;
        directions.push(startLocation);
        while (stopovers.length > 0) {
            var minDistance = await apis.distance_googleAPI(currentPoint, stopovers[0].coordinate);
            var minIndex = 0;
            for (var index = 1; index < stopovers.length; index++) {
                var tempDistance = await apis.distance_googleAPI(currentPoint, stopovers[index].coordinate);
                if ((tempDistance < minDistance && tempDistance !== -1) || minDistance === -1) {
                    minDistance = tempDistance;
                    minIndex = index;
                }
            }
            if (minDistance === -1) return;
            currentPoint = stopovers[minIndex].coordinate;
            directions.push(stopovers[minIndex].coordinate);
            stopovers.splice(minIndex, 1);
        }
        directions.push(endLocation);
        console.log("------------------------");
        this.state.direction_coordinates = [];
        for (var index = 0; index < directions.length - 1; index++) {
            let responseAPI = await apis.findDirection_googleAPI(directions[index], directions[index + 1]);
            this.state.direction_coordinates = this.state.direction_coordinates.concat(this._decode(responseAPI.routes[0].overview_polyline.points))
        }
        this.forceUpdate();
    }

    animationMap(){
        this.refs.map.animateToRegion({
            latitude: (this.state.start_location.latitude + this.state.end_location.latitude)/2,
            longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
            latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude)*1.5,
            longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude)*1.5,
        }, 2000);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ToolbarAndroid
                    style={{ height: 50, backgroundColor: 'sandybrown' }}
                    navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                    title={'Cài đặt phòng'}
                    onIconClicked={() => { Actions.pop() }}
                    onActionSelected={this.onActionSelected} />
                <ScrollView style={{flex: 1 }}>
                    <View style={{ height: 250, width: width, margin:0, marginBottom: 10 }}>
                        <MapView
                            ref="map"
                            style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
                            onPress={this.onMapPress}>
                            {this.state.start_location !== null ?
                                <MapView.Marker
                                    title='Điểm bắt đầu'
                                    key={1}
                                    coordinate={this.state.start_location}
                                    draggable={true}
                                    onDragEnd={(e) => this.addMarkerOnMap(e.nativeEvent.coordinate, 0)}
                                >
                                    <View>
                                        <Image
                                            source={require("../assets/map/map_startlocation_marker.png")}
                                            style={{ height: 48, width: 48 }}
                                        />
                                    </View>
                                </MapView.Marker>
                                : <View />}
                            {this.state.end_location !== null ?
                                <MapView.Marker
                                    title='Điểm kết thúc'
                                    key={2}
                                    coordinate={this.state.end_location}
                                    draggable={true}
                                    onDragEnd={(e) => this.addMarkerOnMap(e.nativeEvent.coordinate, 1)}
                                >
                                    <View>
                                        <Image
                                            source={require("../assets/map/map_endlocation_marker.png")}
                                            style={{ height: 48, width: 48 }}
                                        />
                                    </View>
                                </MapView.Marker>
                                : <View />}
                            {this.state.stopovers.map((u, i) => {
                                console.log(u);
                                return (
                                    <MapView.Marker
                                        title='Điểm dừng chân'
                                        key={id++}
                                        coordinate={u.coordinate}
                                        draggable={true}
                                        onDragEnd={(e) => {
                                            this.state.stopovers[i] = {
                                                "coordinate": e.nativeEvent.coordinate
                                            };
                                            this.findDirection(this.state.start_location, this.state.end_location);
                                        }}
                                    >
                                        <View>
                                            <Image
                                                source={require("../assets/map/map_stopover_marker.png")}
                                                style={{ height: 48, width: 48 }}
                                            />
                                        </View>
                                    </MapView.Marker>)
                            })}
                            {this.state.appointments.map((u, i) => {
                                return (
                                    <MapView.Marker
                                        title='Điểm hẹn'
                                        key={id++}
                                        coordinate={u.coordinate}
                                        
                                    >
                                    </MapView.Marker>)
                            })}
                            <MapView.Polyline
                                coordinates={this.state.direction_coordinates}
                                strokeWidth={5}
                            />
                        </MapView>
                        <ScrollView style={{ backgroundColor: 'navajowhite', width: 70, height: 250, top: 0, left: width - 70 }}>
                            <TouchableOpacity style={{ margin: 5, marginLeft: 0, alignItems: "center" }}>
                                <Image
                                    source={require("../assets/map/map_startlocation_marker.png")}
                                    style={{ height: 48, width: 48, alignItems: 'center' }} />
                                <Text style={{ textAlign: 'center' }}>Bắt đầu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, marginLeft: 0, alignItems: "center" }}>
                                <Image
                                    source={require("../assets/map/map_endlocation_marker.png")}
                                    style={{ height: 48, width: 48, alignItems: 'center' }} />
                                <Text style={{ textAlign: 'center' }}>Kết thúc</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, marginLeft: 0, alignItems: "center" }}>
                                <Image
                                    source={require("../assets/map/map_stopover_marker.png")}
                                    style={{ height: 48, width: 48, alignItems: 'center' }} />
                                <Text style={{ textAlign: 'center' }}>Dừng chân</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <Text style={{ fontSize: 25, color: 'black' }}>Tên phòng:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 25, marginHorizontal: 5, color: 'dimgray' }}
                            onChangeText={(text) => this.setState({ room_name: text })}
                            value={this.state.room_name}
                            editable={this.state.editting_room_name}
                            onEndEditing={() => {
                                this.setState({ editting_room_name: false });
                            }}
                        />
                        <Text style={{ marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                            onPress={() => this.state.editting_room_name ?
                                this.setState({ editting_room_name: false })
                                : this.setState({ editting_room_name: true })}>
                            {this.state.editting_room_name ? "Xong" : "Sửa"}
                        </Text>
                    </View>

                    <Text style={{ fontSize: 25, color: 'black' }}>Ngày bắt đầu:</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 15 }}>{this.state.start_date === null ? 'Chưa chọn thời gian bắt đầu' : '' + new Date(this.state.start_date)}</Text>
                        <Text style={{ fontSize: 15, marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                            onPress={this.showStartTimePicker}>
                            Sửa
                    </Text>
                    </View>

                    <Text style={{ fontSize: 25, color: 'black' }}>Ngày kết thúc:</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 15 }}>{this.state.end_date === null ? 'Chưa chọn thời gian kết thúc' : '' + new Date(this.state.end_date)}</Text>
                        <Text style={{ fontSize: 15, marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                            onPress={this.showEndTimePicker}>
                            Sửa
                    </Text>
                    </View>

                    <View style={{ height: 0 }}>
                        <Text style={{ fontSize: 25 }}>Ngày kết thúc:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{this.state.end_date === null ? 'Chưa chọn thời gian kết thúc' : '' + new Date(this.state.end_date)}</Text>
                            <Text style={{ fontSize: 25, marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                                onPress={this.showEndTimePicker}>
                                Sửa
                        </Text>
                        </View>
                    </View>
                    <Button
                        style={{marginTop:10}}
                        onPress={() => { this.updateSocketData(); }}
                        title="Hoàn tất"
                        color="#840384" />
                </ScrollView>
            </View>
        );
    }
}