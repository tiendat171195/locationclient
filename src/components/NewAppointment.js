//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TimePickerAndroid,
    DatePickerAndroid,
    Image,
    Dimensions,
    TouchableOpacity,
    Slider,
    ToolbarAndroid
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from "react-native-router-flux";
import apis from '../apis/api.js';
import io from 'socket.io-client/dist/socket.io.js';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const API_path = 'https://stormy-woodland-18039.herokuapp.com/';
var giobalThis;
// create a component
class NewAppointment extends Component {
    constructor(props) {
        super(props);
        giobalThis = this;
        this.state = {
            start_date: null,
            start_date_text: '',
            end_date: null,
            end_date_text: '',
            appointment_location: null,
            appointment_address: null,
            radius: 0,
        }
        this.showEndDatePicker = this.showEndDatePicker.bind(this);
        this.showStartDatePicker = this.showStartDatePicker.bind(this);
        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showEndTimePicker = this.showEndTimePicker.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.onActionSelected = this.onActionSelected.bind(this);
    }
    componentWillMount(){
        this.startNewSocket();
    }
    convertStartingDate() {
        let startingDate = new Date(this.state.start_date);
        this.state.start_date_text = '';
        let tempText = '';
        tempText += startingDate.getHours()
            + ':'
            + (startingDate.getMinutes() < 10 ? '0' + startingDate.getMinutes() : startingDate.getMinutes())
            + ' ngày '
            + startingDate.getDate()
            + '/'
            + (1+startingDate.getMonth())
            + '/'
            + (1900 + startingDate.getYear());
        this.setState({
            start_date_text: tempText
        })
    }
    convertEndingDate() {
        let endingDate = new Date(this.state.end_date);
        this.state.end_date_text = '';
        let tempText = '';
        tempText += endingDate.getHours()
            + ':'
            + (endingDate.getMinutes() < 10 ? '0' + endingDate.getMinutes() : endingDate.getMinutes())
            + ' ngày '
            + endingDate.getDay()
            + '/'
            + endingDate.getMonth()
            + '/'
            + (1900 + endingDate.getYear());
        this.setState({
            end_date_text: tempText
        })
    }
    async showStartTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: (new Date(this.state.start_date != null ? this.state.start_date : (new Date()).getTime())).getHours(),
                minute: (new Date(this.state.start_date != null ? this.state.start_date : (new Date()).getTime())).getMinutes(),
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
                mode: 'spinner',
                date: this.state.start_date == null ? new Date(Date()) : new Date(this.state.start_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day

                this.setState({ start_date: new Date(year, month, day, hour, minute).getTime() });
                this.convertStartingDate();
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    async showEndTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: (new Date(this.state.end_date != null ? this.state.end_date : (new Date()).getTime())).getHours(),
                minute: (new Date(this.state.end_date != null ? this.state.end_date : (new Date()).getTime())).getMinutes(),
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
                mode: 'spinner',
                date: this.state.end_date == null ? new Date(Date()) : new Date(this.state.end_date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day

                this.setState({ end_date: new Date(year, month, day, hour, minute).getTime() });
                this.convertEndingDate();
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    async getPointerInfo(location) {
        try {
            let responseAPI = await apis.getInfoLocation_googleAPI(location);
            if (responseAPI.status === "OK") {
                return {
                    "address": responseAPI.results[0].formatted_address,
                    "coordinate": {
                        latitude: responseAPI.results[0].geometry.location.lat,
                        longitude: responseAPI.results[0].geometry.location.lng
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    async onMapPress(e) {
        this.setState({
            appointment_location: e.nativeEvent.coordinate
        });
        var marker = await this.getPointerInfo(e.nativeEvent.coordinate);
        this.setState({
            appointment_address: marker.address
        });
    }
    onActionSelected(position) {

        switch (position) {

            case 0:
                this.addNewAppointment();
                break;
            default:
                break;
        }
    }
    startNewSocket(groupID) {
        if (groupID === null) return;
        if (this.socket !== undefined) this.socket.disconnect();
        this.socket = io(API_path + 'maps?group_id=' + groupID, { jsonp: false });
        this.socket.emit('authenticate', { "token": this.props.userInfo.user_token });
        this.socket.on('authenticated', function () {
        });
        this.socket.on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
        });
    }
    addNewAppointment(){
        console.log('add_appoinment');
        console.log({
            "group_id": this.props.groupInfo._id,
            "address": this.state.appointment_address,
            "start_time": this.state.start_date,
            "end_time": this.state.end_date,
            "latlng": {
                "lat": this.state.appointment_location.latitude,
                "lng": this.state.appointment_location.longitude
            }
        });
        this.socket.emit('add_appointment', JSON.stringify({
            "group_id": this.props.groupInfo._id,
            "address": this.state.appointment_address,
            "start_time": this.state.start_date,
            "end_time": this.state.end_date,
            "latlng": {
                "lat": this.state.appointment_location.latitude,
                "lng": this.state.appointment_location.longitude
            }
        }));
        Actions.pop();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ToolbarAndroid
                    style={{ height: 50, backgroundColor: 'sandybrown' }}
                    navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                    title={'Cài đặt điểm hẹn'}
                    onIconClicked={() => { Actions.pop() }}
                    actions={[
                        {
                            title:'Tạo',
                            icon: {uri:'http://www.iconhot.com/icon/png/wp-woothemes-ultimate/256/checkmark-4.png'},
                            show: 'always'
                        }]}
                    onActionSelected={this.onActionSelected} />
                <View style={{ padding: 5, flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 40, width: 40 }}
                                source={{ uri: 'http://www.freeiconspng.com/uploads/schedule-icon-7.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Ngày bắt đầu:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                            <TextInput editable={false}
                                style={{ flex: 1, fontSize: 25, color: 'dimgray' }}>
                                {this.state.start_date === null ? 'Chưa chọn thời gian bắt đầu' : '' + this.state.start_date_text}
                            </TextInput>
                            <Text style={{ fontSize: 15, marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                                onPress={this.showStartTimePicker}>
                                Sửa
                    </Text>
                        </View>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 40, width: 40 }}
                                source={{ uri: 'http://www.freeiconspng.com/uploads/schedule-icon-7.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Ngày kết thúc:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                            <TextInput editable={false}
                                style={{ flex: 1, fontSize: 25, color: 'dimgray' }}>
                                {this.state.end_date === null ? 'Chưa chọn thời gian kết thúc' : '' + this.state.end_date_text}
                            </TextInput><Text style={{ fontSize: 15, marginHorizontal: 5, textAlignVertical: 'center', color: 'blue' }}
                                onPress={this.showEndTimePicker}>
                                Sửa
                    </Text>
                        </View>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 40, width: 40 }}
                                resizeMode='contain'
                                source={{ uri: 'http://www.kasal.com/images/site_assets/icon-address.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Địa chỉ:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                            <TextInput
                                placeholder="Nhập địa chỉ điểm hẹn"
                                style={{ flex: 1, fontSize: 25, color: 'dimgray' }}
                            >
                                {this.state.appointment_address}
                            </TextInput>
                        </View>
                    </View>


                    <View style={{ flex: 1 }}>
                        <MapView
                            ref="map"
                            style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
                            toolbarEnabled={false}
                            onPress={this.onMapPress}>
                            {
                                this.state.appointment_location != null &&
                                <View>
                                    <MapView.Marker
                                        title='Điểm hẹn'
                                        key={0}
                                        coordinate={this.state.appointment_location}
                                    />
                                    <MapView.Circle
                                        center={this.state.appointment_location}
                                        radius={this.state.radius}

                                        strokeWidth={1}
                                    />
                                </View>}
                        </MapView>
                        <View style={{ margin: 10, ...StyleSheet.absoluteFillObject }}>
                            <View style={{ alignContent: 'center', alignSelf: 'flex-start', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(this.props.currentRegion);
                                        if (this.props.currentRegion !== null) {
                                            this.refs.map.animateToRegion(this.props.currentRegion, 2000);
                                        }
                                    }}>
                                    <Image
                                        source={require("../assets/map/navbar_gps_icon.png")}
                                        style={{ height: 30, width: 30 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1, ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' }}>
                            <Slider
                                maximumValue={1000}
                                minimumValue={0}
                                value={this.state.radius}
                                onSlidingComplete={(tempRadius) => {
                                    this.setState({
                                        radius: tempRadius
                                    });
                                }
                                }
                                style={{ margin: 10 }} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

//make this component available to the app
export default NewAppointment;
