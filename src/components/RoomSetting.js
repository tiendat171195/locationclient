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
    Alert,
    ListView,
    Modal,
    CameraRoll
} from 'react-native';
import { Actions } from "react-native-router-flux";
import io from 'socket.io-client/dist/socket.io.js';
import apis from '../apis/api.js';
import MapView from 'react-native-maps';
import {
    MAIN_COLOR,
    TOOLBAR_HEIGHT
} from './type.js';
import {
    START_MARKER,
    END_MARKER,
    STOPOVER_MARKER
} from './images.js';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const DEFAULT_LATITUDE = 10.762934;
const DEFAULT_LONGITUDE = 106.682038;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var giobalThis;
var id = 100;
//const API_path = 'http://192.168.83.2:3000/';
const API_path = 'https://stormy-woodland-18039.herokuapp.com/';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class RoomSetting extends Component {
    constructor(props) {
        super(props);
        giobalThis = this;
        this.state = {
            room_name: this.props.groupInfo.name,
            editting_room_name: false,
            start_location: null,
            start_address: '',
            start_date: null,
            start_radius: 0,
            end_location: null,
            end_address: null,
            end_date: null,
            end_radius: 0,
            stopovers: [],
            direction_coordinates: [],
            dataMembersSource: ds.cloneWithRows([]),
            dataAppointmentsSource: ds.cloneWithRows([]),
            modalVisible: false,
            photos: [],
            avatar_room: null,
        };

        //this.onMapPress = this.onMapPress.bind(this);
        this.getPointerInfo = this.getPointerInfo.bind(this);
        this.findDirection = this.findDirection.bind(this);
        this.getRouteInfo = this.getRouteInfo.bind(this);
    }
    /* updateSocketData() {
        if (this.checkValid()) {
            this.socket.emit('update_starting_point', JSON.stringify({
                "group_id": this.props.groupInfo._id,
                "start_time": this.state.start_date,
                "start_latlng": {
                    "lat": this.state.start_location.latitude,
                    "lng": this.state.start_location.longitude
                }
            }));

            this.socket.emit('update_ending_point', JSON.stringify({
                "group_id": this.props.groupInfo._id,
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
                "group_id": this.props.groupInfo._id,
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


            Alert.alert(
                'Thông báo',
                'Cập nhật thông tin phòng thành công',
                [
                    { text: 'Xác nhận', onPress: () => Actions.pop() },
                ],
                { cancelable: false }
            )
        }
    } */
    async getRouteInfo() {
        let data = this.props.getRoutesResponse.data.find(obj => obj.group_id == this.props.groupInfo._id);
        if (data === undefined) return;
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
        this.findDirection(this.state.start_location, this.state.end_location);
    }
    componentWillMount() {
        this.state.avatar_room = this.props.groupInfo.avatar_url;
        this.state.dataMembersSource = ds.cloneWithRows(this.props.groupInfo.users);
        this.state.dataAppointmentsSource = ds.cloneWithRows(this.props.getAppointmentsResponse.data.find(obj => obj.group_id == this.props.groupInfo._id).appointments);

        this.getRouteInfo();
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.getAppointmentsResponse.uptodate && nextProps.getAppointmentsResponse.uptodate) {
            this.state.dataAppointmentsSource = ds.cloneWithRows(nextProps.getAppointmentsResponse.data.find(obj => obj.group_id == this.props.groupInfo._id).appointments);
        }
        if (!this.props.getRoutesResponse.uptodate && nextProps.getRoutesResponse.uptodate) {
            this.getRouteInfo();
        }
    }
    convertDate(date) {
        let tempDate = new Date(date);
        let tempText = '';
        tempText += tempDate.getHours()
            + ':'
            + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
            + ' ngày '
            + tempDate.getDate()
            + '/'
            + (1 + tempDate.getMonth())
            + '/'
            + (1900 + tempDate.getYear());
        return tempText;
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
    _decode(t, e) {
        for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
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
    /*   */
    /*  
     } */
    /*   */
    /*  */
    /* 
        animationMap(){
            this.refs.map.animateToRegion({
                latitude: (this.state.start_location.latitude + this.state.end_location.latitude)/2,
                longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
                latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude)*1.5,
                longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude)*1.5,
            }, 2000);
        } */
    getPhotos = () => {
        console.log('get photo');
        CameraRoll.getPhotos({
            first: 100,
            assetType: 'All'
        })
            .then(r => this.setState({ photos: r.edges }));
    }
    toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: 'silver' }}>
                <ToolbarAndroid
                    style={{ height: TOOLBAR_HEIGHT, backgroundColor: MAIN_COLOR }}
                    navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                    title={'Cài đặt phòng'}
                    onIconClicked={() => { Actions.pop() }}
                    onActionSelected={this.onActionSelected} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'white', marginBottom: 1, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent:'center' }}>
                        <TouchableOpacity
                            style={{ height:65, width: 65, backgroundColor: MAIN_COLOR, borderRadius: 35, marginRight: 15, alignItems:'center', justifyContent:'center' }}
                            onPress={() => {
                                console.log(this.props.groupInfo);
                                console.log(this.state.room_avatar);
                                this.toggleModal();
                                this.getPhotos();
                            }}>
                            <Image
                                style={{ height: 60, width: 60, borderRadius: 30 }}
                                resizeMode="cover"
                                source={{ uri: this.state.avatar_room }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>Tên phòng:</Text>
                            <TextInput
                                style={{ flex: 1, fontSize: 18, color: 'dimgray' }}
                                onChangeText={(text) => this.setState({ room_name: text })}
                                value={this.state.room_name}
                                editable={this.state.editting_room_name}
                                onEndEditing={() => {
                                    this.setState({ editting_room_name: false });
                                }}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', marginBottom: 1, padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 24, width: 24, marginHorizontal: 8, resizeMode: 'contain' }}
                                source={{ uri: 'https://www.dsaa.org/get/files/image/galleries/memberIcon-0001.png?500x500' }} />
                            <Text style={{ fontSize: 18, color: 'black' }}>Danh sách thành viên</Text>
                        </View>

                        <ListView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            enableEmptySections={true}
                            style={{}}
                            renderFooter={() => {
                                return (<View style={{ marginLeft: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                                    <TouchableOpacity>
                                        <Image
                                            style={{ width: 50, height: 50, alignSelf: "center", padding: 5, borderRadius: 70 / 2 }}
                                            resizeMode="cover"
                                            source={{ uri: 'https://www.shareicon.net/download/2015/08/30/93295_add_512x512.png' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 16 }}>Thêm</Text>
                                </View>)
                            }}
                            dataSource={this.state.dataMembersSource}
                            renderRow={(data, section, index, highlightRow) => {

                                return (
                                    <View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
                                        <Image
                                            style={{ width: 50, height: 50, alignSelf: "center", padding: 5, borderRadius: 70 / 2 }}
                                            resizeMode="cover"
                                            source={{ uri: data.avatar_url }}
                                        />
                                        <Text style={{ fontSize: 16, color: 'black' }}>{data.username}</Text>
                                    </View>
                                )

                            }
                            }
                        />
                    </View>

                    <View style={{ backgroundColor: 'white', marginBottom: 1, padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ height: 24, width: 24, marginRight: 8, resizeMode: 'contain' }}
                                source={{ uri: 'http://www.mbsr-pleine-conscience.org/wp-content/uploads/2015/04/calendar-icon.png' }} />
                            <Text style={{ fontSize: 18, color: 'black' }}>Danh sách điểm hẹn</Text>
                        </View>
                        <ListView
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            enableEmptySections={true}
                            scrollEnabled={true}
                            style={{}}
                            dataSource={this.state.dataAppointmentsSource}
                            renderFooter={() => <View style={{ marginLeft: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                                <TouchableOpacity onPress={() => {
                                    Actions.newappointment({
                                        userInfo: this.props.userInfo,
                                        groupInfo: this.props.groupInfo,
                                        currentRegion: this.props.currentRegion
                                    })
                                }}>
                                    <Image
                                        style={{ width: 50, height: 50, margin: 10 }}
                                        source={{ uri: 'https://www.shareicon.net/download/2015/08/30/93295_add_512x512.png' }} />

                                </TouchableOpacity>
                                <Text style={{ fontSize: 16 }}>Thêm</Text>
                            </View>}
                            renderRow={(data, section, index, highlightRow) => {
                                return (<View style={{ flexDirection: 'row', alignItems: 'center', borderWidth:1, padding:8, borderColor:MAIN_COLOR, margin: 8, width: width*2/2.5 +16, height:width/2.5, backgroundColor: 'white', borderRadius: 8 }}>
                                    <View style={{ width: width/2.5- 16, height: width/2.5 -16, marginRight: 8 }}>
                                        <MapView
                                            liteMode={true}

                                            toolbarEnabled={false}
                                            style={{ ...StyleSheet.absoluteFillObject }}
                                            region={{
                                                latitude: data.coordinate.latitude,
                                                longitude: data.coordinate.longitude,
                                                latitudeDelta: LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA
                                            }} >
                                            <MapView.Marker
                                                key={data._id}
                                                coordinate={data.coordinate} />
                                        </MapView>
                                    </View>
                                    <View style={{ flexDirection: 'column', width: width / 2.5 }}>
                                        <Text style={{ color: 'black' }}
                                            numberOfLines={3}>Địa chỉ: {data.address}</Text>
                                        <Text style={{ color: 'black' }}>Bắt đầu: {this.convertDate(data.start_time)}</Text>
                                        <Text style={{ color: 'black' }}>Kết thúc: {this.convertDate(data.end_time)}</Text>
                                    </View>
                                </View>)
                            }
                            }
                        />
                    </View>

                    <View style={{ backgroundColor: 'white', marginBottom: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding:16 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 24, width: 24, marginRight:8, resizeMode: 'contain' }}
                                    source={{ uri: 'https://image.flaticon.com/icons/png/512/149/149054.png' }} />
                                <Text style={{ fontSize: 18, color: 'black' }}>Lộ trình</Text>
                            </View>
                            <TouchableOpacity style={{ justifyContent: 'flex-end' }}
                                onPress={() => {
                                    Actions.newroute({
                                        userInfo: this.props.userInfo, groupInfo: this.props.groupInfo,
                                        //currentRegion: this.props.currentRegion
                                    })
                                }}>
                                <Text style={{ fontSize: 12, color: 'blue' }}>Sửa lộ trình</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: width, height: 200 }}>
                            {(this.state.start_location != null && this.state.end_location != null) ?
                                <MapView
                                    liteMode={true}
                                    toolbarEnabled={false}
                                    style={{ ...StyleSheet.absoluteFillObject }}
                                    region={{
                                        latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
                                        longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
                                        latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 2,
                                        longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 2,
                                    }} >
                                    <MapView.Marker
                                        title='Điểm bắt đầu'
                                        key={0}
                                        coordinate={this.state.start_location}
                                    >
                                        <View>
                                            <Image
                                                source={START_MARKER}
                                                style={{ height: 48, width: 48 }}
                                            />
                                        </View>
                                    </MapView.Marker>
                                    <MapView.Marker
                                        title='Điểm kết thúc'
                                        key={1}
                                        coordinate={this.state.end_location}
                                    >
                                        <View>
                                            <Image
                                                source={END_MARKER}
                                                style={{ height: 48, width: 48 }}
                                            />
                                        </View>
                                    </MapView.Marker>
                                    {this.state.stopovers.map(u => {
                                        return (
                                            <MapView.Marker
                                                title='Điểm dừng chân'
                                                key={id++}
                                                coordinate={u.coordinate}>
                                                <View>
                                                    <Image
                                                        source={STOPOVER_MARKER}
                                                        style={{ height: 38, width: 38 }}
                                                    />
                                                </View>

                                            </MapView.Marker>)
                                    })}
                                    <MapView.Polyline
                                        coordinates={this.state.direction_coordinates}
                                        strokeColor="grey"
                                        strokeWidth={2}
                                    />
                                </MapView>
                                : <View>
                                    <Text style={{ fontSize: 15 }}>Nhóm chưa thiết lập lộ trình</Text>
                                </View>}
                        </View>
                    </View>


                </ScrollView>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => console.log('closed')}
                >
                    <View style={{ flex: 1 }}>
                        <ToolbarAndroid
                            style={{ height: 50, backgroundColor: MAIN_COLOR }}
                            title='Chọn ảnh nhóm'
                            titleColor='#6666ff'
                            navIcon={{ uri: "http://semijb.com/iosemus/BACK.png", width: 50, height: 50 }}
                            onIconClicked={this.toggleModal}
                        >
                        </ToolbarAndroid>
                        <ScrollView
                            contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            {
                                this.state.photos.map((p, i) => {
                                    return (
                                        <TouchableOpacity
                                            style={{ opacity: i === this.state.index ? 0.5 : 1 }}
                                            key={i}
                                            underlayColor='transparent'
                                            onPress={async () => {
                                                let url = await apis.uploadImage(p.node.image.uri);
                                                this.toggleModal();
                                                let res = await apis.updateGroupImage(url, this.props.groupInfo._id);
                                                console.log('update group img');
                                                console.log(res);
                                                if (res.status_code == 200) {
                                                    this.setState({
                                                        avatar_room: url
                                                    })
                                                }
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    width: width / 3,
                                                    height: width / 3
                                                }}
                                                source={{ uri: p.node.image.uri }}
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        getAppointmentsResponse: state.getAppointmentsResponse,
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
)(RoomSetting);