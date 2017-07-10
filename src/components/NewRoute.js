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
    //Dimensions,
    TouchableOpacity,
    Slider,
    ToolbarAndroid,
    ScrollView
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from "react-native-router-flux";
import {connect} from 'react-redux';
import apis from '../apis/api.js';
import io from 'socket.io-client/dist/socket.io.js';
//const { width, height } = Dimensions.get('window');
import DialogAndroid from 'react-native-dialogs';
//const ASPECT_RATIO = width / height;
//const LATITUDE_DELTA = 0.01;
//const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const API_path = 'https://stormy-woodland-18039.herokuapp.com/';
var giobalThis;
var id = 1000;
import {
    CONTENT_COLOR,
    CONTENT_TEXT_COLOR,
    MAIN_FONT,
    PLACEHOLDER_TEXT_COLOR,
    CALLOUT_BACKGROUND_COLOR,
    MAIN_COLOR,
    TOOLBAR_HEIGHT,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    width
} from './type.js';
import {
    START_MARKER,
    END_MARKER,
} from './images.js';
// create a component
class NewRoute extends Component {
    constructor(props) {
        super(props);
        giobalThis = this;
        this.state = {
            start_date: null,
            start_date_text: '',
            end_date: null,
            end_date_text: '',
            start_location: null,
            start_address: null,
            start_radius: 0,
            end_location: null,
            end_address: null,
            end_radius: 0,
            stopovers: [],
            direction_coordinates: [],
            radius: 0,
            search_text: ''
        }
        this.showEndDatePicker = this.showEndDatePicker.bind(this);
        this.showStartDatePicker = this.showStartDatePicker.bind(this);
        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showEndTimePicker = this.showEndTimePicker.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.onActionSelected = this.onActionSelected.bind(this);
    }
    componentWillMount() {
        this.getRouteInfo();
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
            + (1 + startingDate.getMonth())
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
            + endingDate.getDate()
            + '/'
            + (1 + endingDate.getMonth())
            + '/'
            + (1900 + endingDate.getYear());
        this.setState({
            end_date_text: tempText
        })
    }
    animationMap() {
//this.refs.map.animateToRegion(this.state.currentRegion, 2000);
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
        this.showChoseMarkerDialog(e.nativeEvent.coordinate);
    }
    showChoseMarkerDialog = function (location) {
        var dialog = new DialogAndroid();
        dialog.set({
            title: 'Chọn kiểu',
            items: [
                "Điểm bắt đầu",
                "Điểm kết thúc",
                "Điểm dừng chân"
            ],
            negativeText: 'Hủy',
            itemsCallback: (id, text) => this.addMarkerOnMap(location, id),
        });
        dialog.show();
    }
    onActionSelected(position) {

        switch (position) {

            case 0:
                this.addNewRoute();
                break;
            default:
                break;
        }
    }
    
    async getRouteInfo() {
        let data = this.props.getRoutesResponse.data.find(obj => obj.group_id == this.props.groupInfo._id);
        if(data === undefined) return;
        if (data.hasOwnProperty("start_latlng") && data.start_latlng.lat != undefined) {
            var pointer = await this.getPointerInfo({
                latitude: data.start_latlng.lat,
                longitude: data.start_latlng.lng
            });
            this.state.start_location = {
                latitude: data.start_latlng.lat,
                longitude: data.start_latlng.lng
            };
            this.state.start_address = pointer.address;
            this.state.start_radius = data.start_radius;
        }
        else {
            this.state.start_location = null;
            this.state.start_address = '';
            this.state.start_radius = 0;
        }

        if (data.hasOwnProperty("end_latlng") && data.end_latlng.lat != undefined) {
            var pointer = await this.getPointerInfo({
                latitude: data.end_latlng.lat,
                longitude: data.end_latlng.lng
            });
            this.state.end_location = {
                latitude: data.end_latlng.lat,
                longitude: data.end_latlng.lng
            };
            this.state.end_address = pointer.address;
            this.state.end_radius = data.end_radius;
        }
        else {
            this.state.end_location = null;
            this.state.end_address = '';
            this.state.end_radius = 0;
        }

        this.state.stopovers = [];
        data.stopovers.map(u => {
            this.state.stopovers.push({
                "coordinate":
                {
                    "latitude": u.latlng.lat,
                    "longitude": u.latlng.lng
                }
            });
        });
        this.state.start_date = data.start_time;
        this.state.end_date = data.end_time;
        this.convertStartingDate();
        this.convertEndingDate();
        this.findDirection(this.state.start_location, this.state.end_location);
    }
    async addMarkerOnMap(location, type) {
        var marker = await this.getPointerInfo(location);
        switch (type) {
            case 0: //Điểm bắt đầu
                this.setState({
                    start_location: marker.coordinate,
                    start_address: marker.address,
                    start_radius: this.state.radius
                })
                this.findDirection(this.state.start_location, this.state.end_location);
                break;
            case 1: //Điểm kết thúc
                this.setState({
                    end_location: marker.coordinate,
                    end_address: marker.address,
                    end_radius: this.state.radius
                })
                this.findDirection(this.state.start_location, this.state.end_location);
                break;
            case 2: //Điểm dừng chân
                this.state.stopovers.push({
                    "coordinate":
                    {
                        "latitude": marker.coordinate.latitude,
                        "longitude": marker.coordinate.longitude
                    },
                    'radius': this.state.radius,
                    'address': marker.address
                });
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
    addNewRoute() {
       

        var tempStopovers = [];
        for (var index = 0; index < this.state.stopovers.length; index++) {
            tempStopovers.push({
                "latlng": {
                    "lat": this.state.stopovers[index].coordinate.latitude,
                    "lng": this.state.stopovers[index].coordinate.longitude
                }
            })
        }
        this.props.getSocketResponse.data.emit('add_route', JSON.stringify({
            group_id: this.props.groupInfo._id,
            start_radius: this.state.start_radius,
            start_latlng: {
                lat: this.state.start_location.latitude,
                lng: this.state.start_location.longitude
            },
            end_radius: this.state.end_radius,
            end_latlng: {
                lat: this.state.end_location.latitude,
                lng: this.state.end_location.longitude
            },
            start_time: this.state.start_date,
            end_time: this.state.end_date,
            stopovers: tempStopovers
        }));

        Actions.pop();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ToolbarAndroid
                    style={{ height: TOOLBAR_HEIGHT, backgroundColor: MAIN_COLOR }}
                    navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                    title={'Cài đặt lộ trình'}
                    onIconClicked={() => { Actions.pop() }}
                    actions={[
                        {
                            title: 'Tạo',
                            icon: { uri: 'http://www.avtoplin-gen1.si/landing_pages/img/kljukica.png' },
                            show: 'always'
                        }]}
                    onActionSelected={this.onActionSelected} />
                <ScrollView style={{ flex: 1, backgroundColor: 'silver' }}>
                    <View style={{ backgroundColor: 'white', padding: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 30, width: 30, marginRight: 5 }}
                                source={{ uri: 'http://www.freeiconspng.com/uploads/schedule-icon-7.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Ngày bắt đầu:</Text>
                        </View>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 20,
                                color: CONTENT_TEXT_COLOR,
                                backgroundColor: CONTENT_COLOR,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                padding: 5,
                                marginTop: 3,
                                marginHorizontal: 10
                            }}
                            onPress={this.showStartTimePicker.bind(this)}>
                            {this.state.start_date === null ? 'Chưa chọn thời gian bắt đầu' : this.state.start_date_text}
                        </Text>
                    </View>

                    <View style={{ backgroundColor: 'white', padding: 5, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 30, width: 30, marginRight: 5 }}
                                source={{ uri: 'http://www.freeiconspng.com/uploads/schedule-icon-7.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Ngày kết thúc:</Text>
                        </View>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 20,
                                color: CONTENT_TEXT_COLOR,
                                backgroundColor: CONTENT_COLOR,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                padding: 5,
                                marginTop: 3,
                                marginHorizontal: 10
                            }}
                            onPress={this.showEndTimePicker.bind(this)}>
                            {this.state.end_date === null ? 'Chưa chọn thời gian kết thúc' : this.state.end_date_text}
                        </Text>
                    </View>

                    <View style={{ backgroundColor: 'white', padding: 5, marginTop: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 40, width: 40 }}
                                resizeMode='contain'
                                source={{ uri: 'http://www.kasal.com/images/site_assets/icon-address.png' }} />
                            <Text style={{ fontSize: 25, color: 'black' }}>Lộ trình:</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                            <TextInput
                                placeholder="Tìm kiếm địa điểm"
                                style={{
                                    flex: 1,
                                    fontSize: 20,
                                    color: CONTENT_TEXT_COLOR,
                                    backgroundColor: CONTENT_COLOR,
                                    borderRadius: 10,
                                    marginTop: 3,
                                    paddingHorizontal: 10,
                                    marginRight: 5,
                                    marginLeft: 10
                                }}
                                value={this.state.search_text}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => this.setState({ search_text: text })}
                            />
                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={async () => {
                                var marker = await this.getPointerInfo(this.state.search_text);
                                this.refs.map.animateToRegion({
                                    latitude: marker.coordinate.latitude,
                                    longitude: marker.coordinate.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA
                                }, 2000);
                            }}>
                                <Image
                                    style={{ height: 30, width: 30 }}
                                    source={{ uri: 'https://www.shareicon.net/download/2015/08/04/80098_find_512x512.png' }} />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ width: width, height: 250 }}>
                        <MapView
                            ref="map"
                            style={{ flex: 1 }}
                            toolbarEnabled={false}
                            onPress={this.onMapPress}>
                            {
                                this.state.start_location != null &&
                                <View>
                                    <MapView.Marker
                                        title='Điểm bắt đầu'
                                        key={0}
                                        coordinate={this.state.start_location}
                                    >
                                        <MapView.Callout
                                            style={{ width: 150 }}
                                            tooltip={true}>
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 15 }}>
                                                <View style={{}}>
                                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Điểm bắt đầu</Text>
                                                </View>
                                                <View style={{ marginHorizontal: 5 }}>
                                                    <Text style={{ color: 'black', fontStyle: 'italic', fontSize: 10 }}>{this.state.start_address}</Text>
                                                </View>
                                            </View>
                                        </MapView.Callout>
                                    </MapView.Marker>
                                    <MapView.Circle
                                        center={this.state.start_location}
                                        radius={this.state.start_radius}
                                        fillColor='sandybrown'
                                        strokeWidth={1}
                                    />

                                </View>}
                            {
                                this.state.end_location != null &&
                                <View>
                                    <MapView.Marker
                                        title='Điểm kết thúc'
                                        key={1}
                                        coordinate={this.state.end_location}
                                    >
                                        <MapView.Callout
                                            style={{ width: 150 }}
                                            tooltip={true}>
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 15 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Điểm kết thúc</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: 'black', fontStyle: 'italic', fontSize: 10 }}>{this.state.end_address}</Text>
                                                </View>
                                            </View>
                                        </MapView.Callout>
                                    </MapView.Marker>
                                    <MapView.Circle
                                        center={this.state.end_location}
                                        radius={this.state.end_radius}
                                        fillColor='sandybrown'
                                        strokeWidth={1}
                                    />

                                </View>}
                            {this.state.stopovers.map(u => {
                                return (
                                    <MapView.Marker
                                        title='Điểm dừng chân'
                                        description={u.address}
                                        key={id++}
                                        coordinate={u.coordinate}>
                                        <View style={{height: 48, width: 48}}>
                                            <Image
                                                source={START_MARKER}
                                                style={{ height: 48, width: 48 }}
                                            />
                                        </View>
                                        <MapView.Callout
                                            style={{ width: 150 }}
                                            tooltip={true}>
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 20 }}>
                                                <View style={{}}>
                                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Điểm dừng chân</Text>
                                                </View>
                                                <View style={{ marginHorizontal: 3 }}>
                                                    <Text

                                                        style={{ color: 'black', fontStyle: 'italic', fontSize: 10 }}>{u.address}</Text>
                                                </View>
                                            </View>
                                        </MapView.Callout>

                                    </MapView.Marker>)
                            })}
                            <MapView.Polyline
                                coordinates={this.state.direction_coordinates}
                                strokeColor="grey"
                                strokeWidth={5}
                            />
                        </MapView>
                        <View style={{ margin: 10, ...StyleSheet.absoluteFillObject }}>
                            <View style={{ alignContent: 'center', alignSelf: 'flex-start', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.props.getLocationResponse.data.latitude !== undefined) {
                                            this.refs.map.animateToRegion({
                                                latitude: this.props.getLocationResponse.data.latitude,
                                                longitude: this.props.getLocationResponse.data.longitude,
                                                latitudeDelta: LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA

                                            }, 2000);
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
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
	return {
        getLocationResponse: state.getLocationResponse,
        getSocketResponse: state.getSocketResponse,
        getRoutesResponse: state.getRoutesResponse,
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewRoute);