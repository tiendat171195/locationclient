'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Alert,
  ToolbarAndroid,
  DrawerLayoutAndroid,
  nativeImageSource,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  Picker,
  ListView
} from 'react-native';
import MapView from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// socket
import io from 'socket.io-client/dist/socket.io.js';
import apis from '../apis/api.js';
import { Card, ListItem } from 'react-native-elements';
import Search from 'react-native-search-box';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 100;
//const API_path = 'http://192.168.83.2:3000/';
const API_path = 'https://stormy-woodland-18039.herokuapp.com/';
const customStyle = [
  /*{
    elementType: 'geometry',
    stylers: [
      {
        color: '#fff0f5',
      },
    ],
  },*/
  /*{
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00ff7f',
      },
    ],
  },*/
  /*{
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#a52a2a',
      },
    ],
  },*/
  /*{
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdb76b',
      },
    ],
  },*/
  /*{
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#afeeee',
      },
    ],
  },*/
  /*{
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#9acd32',
      },
    ],
  },*/
  /*{
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#afeeee',
      },
    ],
  },*/
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffdab9',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#7fff00',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#a52a2a',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffa07a',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#f08080',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00008b',
      },
    ],
  },
  /*{
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fff0f5',
      },
    ],
  },*/
  /*{
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },*/
  /*{
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },*/
  /*{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },*/
  /*{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },*/
];


var giobalThis;
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class MapPage extends Component {
  constructor(props) {
    super(props);

    giobalThis = this;
    this.state = {
      markers: [],
      currentRegion: null,
      members: [],
      watchID: null,
      openSearch: false,
      openDrawer: false,
      _roomList: [],
      groupID: null,
      start_location: null,
      start_address: null,
      start_date: null,
      end_location: null,
      end_address: null,
      end_date: null,
      stopovers: [],
      direction_coordinates: [],
      arriving_users: [],
      destination_users: [],
      mapType: "standard",
      groundName: '',
      dataMembersSource: ds.cloneWithRows([]),
      dataRoutesSource: ds.cloneWithRows([]),
      appointments: [],
      showMemberList: false,
      showRoutesList: true,
    };


    this.bindThis = this.bindThis.bind(this);
    this.bindThis();

  }
  bindThis() {
    this.onMapPress = this.onMapPress.bind(this);
    this.getSocketData = this.getSocketData.bind(this);
    this.addSocketCallback = this.addSocketCallback.bind(this);
    this.startGeolocation = this.startGeolocation.bind(this);
    this.findDirection = this.findDirection.bind(this);
    this.onActionSelected = this.onActionSelected.bind(this);
    this.GetRoomList = this.GetRoomList.bind(this);
    this.startNewSocket = this.startNewSocket.bind(this);
    this.calculateDistanceThisUser = this.calculateDistanceThisUser.bind(this);
    this.findRouteDirection = this.findRouteDirection.bind(this);
  }
  componentWillMount() {
    this.GetRoomList(this.props.userInfo.user_id);
    this.startNewSocket(this.state.groupID);
    this.startGeolocation();
  }
  getSocketData(groupID) {
    if (groupID === null) return;

    /*this.socket.emit('get_markers',
      JSON.stringify({
        'user_id': this.props.userInfo.user_id,
        'group_id': groupID
      }));*/

    this.socket.emit('get_latlngs', JSON.stringify({
      'user_id': this.props.userInfo.user_id,
      'group_id': groupID
    }));

    this.socket.emit('get_route', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit('get_starting_point', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit('get_ending_point', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit('get_appointments', JSON.stringify({
      "group_id": groupID
    }));


  }
  addSocketCallback() {
    //Add a new marker
    this.socket.on('add_marker_callback', function (data) {

      if (data.hasOwnProperty('success') && data.success === false) {
        return;
      }
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.setState({
        markers: [
          ...giobalThis.state.markers,
          {
            coordinate: { 'latitude': data.latlng.lat, 'longitude': data.latlng.lng },
            key: data.marker_id,
          },
        ],
      });
    });

    //Get all markers
    this.socket.on('get_markers_callback', function (data) {
      if (data.hasOwnProperty('success')) {
        return;
      }
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.setState({ markers: [] });
      data.markers.map(marker => {
        giobalThis.setState({
          markers: [
            ...giobalThis.state.markers,
            {
              coordinate: { 'latitude': marker.latlng.lat, 'longitude': marker.latlng.lng },
              key: marker._id,
            },
          ],
        });
      })
    });

    //Get all members' location
    this.socket.on('get_latlngs_callback', function (data) {
      console.log(data);
      if (data.hasOwnProperty('success')) return;
      if (data.group_id != giobalThis.state.groupID) return;

      giobalThis.state.members = [];
      for (var index = 0; index < data.latlngs.length; index++) {
        giobalThis.state.members.push({ '_id': data.latlngs[index]._id, 'username': data.latlngs[index].username, 'coordinate': { 'latitude': data.latlngs[index].latlng.lat, 'longitude': data.latlngs[index].latlng.lng }, 'key': data.latlngs[index]._id });
      }
      giobalThis.state.dataMembersSource = ds.cloneWithRows(giobalThis.state.members);
      giobalThis.forceUpdate();
    });

    //Update 1 member's location
    this.socket.on('update_latlng_callback', function (data) {
      if (data.user_id == giobalThis.props.userInfo.user_id) return;
      giobalThis.replaceLocationById(data.user_id, { 'latitude': data.latlng.lat, 'longitude': data.latlng.lng });
      console.log(data.user_id);
      giobalThis.forceUpdate();
    });

    this.socket.on('get_starting_point_callback', function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.setState({
        start_date: data.hasOwnProperty("start_time") ? data.start_time : null
      })
    });


    this.socket.on('get_ending_point_callback', function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.setState({
        end_date: data.hasOwnProperty("end_time") ? data.end_time : null
      })
    });

    this.socket.on('get_route_callback', async function (data) {
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
      } else {
        giobalThis.state.start_location = null;
        giobalThis.state.start_address = null;
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
      else {
        giobalThis.state.end_location = null;
        giobalThis.state.end_address = null;
      }

      giobalThis.state.stopovers = [];
      data.stopovers.map(u => {
        giobalThis.state.stopovers.push({
          "_id": u._id,
          "coordinate":
          {
            "latitude": u.latlng.lat,
            "longitude": u.latlng.lng
          },
          "user": []
        });
      });

      giobalThis.state.arriving_users = [];
      data.arriving_users.map(u => {
        giobalThis.state.arriving_users.push({
          "user_id": u.id,
          "username": u.username
        });
      });

      giobalThis.state.destination_users = [];
      data.destination_users.map(u => {
        giobalThis.state.destination_users.push({
          "user_id": u.id,
          "username": u.username
        });
      });

      giobalThis.animationMap();
      console.log(giobalThis.state.stopovers);
      giobalThis.findRouteDirection(giobalThis.state.start_location, giobalThis.state.end_location);
    });

    //Handle 1 user comes in arriving point
    this.socket.on("add_arriving_user_callback", function (data) {
      if (data.user_id == giobalThis.props.userInfo.user_id) return;
      giobalThis.state.arriving_users.push({
        "user_id": data.user_id,
        "username": data.username
      });
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng đang đến: " + data.username
      );
    });

    //Handle 1 user leaves starting point
    this.socket.on("delete_arriving_user_callback", function (data) {
      for (var index = 0; index < giobalThis.state.arriving_users.length; index++) {
        if (giobalThis.state.arriving_users[index].user_id === data.user_id) {
          giobalThis.state.arriving_users.splice(index, 1);
          break;
        }
      }
      if (data.user_id != giobalThis.props.userInfo.user_id) {
        Alert.alert(
          "Thông báo điểm hẹn",
          "Người dùng rời khỏi: " + data.username
        );
      }

    });

    //Handle 1 user comes in destination point
    this.socket.on("add_destination_user_callback", function (data) {
      if (data.user_id == giobalThis.props.userInfo.user_id) return;
      giobalThis.state.destination_users.push({
        "user_id": data.user_id,
        "username": data.username
      })
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng đang đến: " + data.username
      );
    });

    //Handle 1 user leaves destination point
    this.socket.on("delete_destination_user_callback", function (data) {
      for (var index = 0; index < giobalThis.state.destination_users.length; index++) {
        if (giobalThis.state.destination_users[index].user_id === data.user_id) {
          giobalThis.state.destination_users.splice(index, 1);
          break;
        }
      }
      if (data.user_id != giobalThis.props.userInfo.user_id) {
        Alert.alert(
          "Thông báo điểm hẹn",
          "Người dùng rời khỏi: " + data.username
        );
      }
    });

    //Handle 1 user comes in stopover point
    this.socket.on("add_user_into_stopover_callback", function (data) {
      giobalThis.state.stopovers.map(u => {
        if (u._id === data.stopover_id) {
          u.users.push({
            "user_id": data.user_id,
            "username": data.username
          });
        }
      });
    });

    //Handle 1 user leaves stopover point
    this.socket.on("delete_user_into_stopover_callback", function (data) {
      giobalThis.state.stopovers.map(u => {
        if (u._id === data.stopover_id) {
          u.users.splice({
            "user_id": data.user_id,
            "username": data.username
          }, 1);
        }
      });
    });

    this.socket.on("get_appointments_callback", function (data) {
      giobalThis.state.appointments = [];

      data.appointments.map(u => {
        giobalThis.state.appointments.push({
          "coordinate":
          {
            "latitude": u.latlng.lat,
            "longitude": u.latlng.lng
          }
        })
      });
      giobalThis.state.dataRoutesSource = ds.cloneWithRows(giobalThis.state.appointments);
      console.log("giobalThis.state.dataRoutesSource")
      console.log(giobalThis.state.dataRoutesSource)
    });
  }
  startNewSocket(groupID) {
    if (groupID === null) return;
    if (this.socket !== undefined) this.socket.disconnect();
    this.socket = io(API_path + 'maps?group_id=' + groupID + '/', { jsonp: false });
    this.socket.emit('authenticate', { "token": this.props.userInfo.token });
    this.socket.on('authenticated', function () {
      giobalThis.addSocketCallback();
      giobalThis.getSocketData(groupID);
    });
    this.socket.on('unauthorized', function (msg) {
      console.log("unauthorized: " + JSON.stringify(msg.data));
    });

  }
  addMarker(groupID, coordinate) {
    if (groupID === null) return;
    this.socket.emit('add_marker',
      JSON.stringify({
        'user_id': this.props.userInfo.user_id,
        'group_id': groupID,
        'latlng': {
          'lat': coordinate.latitude,
          'lng': coordinate.longitude
        }
      }));

  }
  onMapPress(e) {
    //this.addMarker(this.state.groupID, e.nativeEvent.coordinate);
  }
  replaceLocationById(UserID, LatLng) {
    for (var index = 0; index < this.state.members.length; index++) {
      if (this.state.members[index]._id == UserID) {
        this.state.members[index].coordinate = LatLng;
        return;
      }

    }
  }
  onRegionChange(region) {
  }
  addToArrivingUsersSocket() {
    for (var index = 0; index < this.state.arriving_users.length; index++) {
      if (this.state.arriving_users[index].user_id === this.props.userInfo.user_id) {
        return;
      }
    }
    this.socket.emit("add_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
  }
  notInArrivingUsersSocket() {
    for (var index = 0; index < this.state.arriving_users.length; index++) {
      if (this.state.arriving_users[index].user_id === this.props.userInfo.user_id) {
        this.socket.emit("delete_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
        return;
      }
    }
  }
  addToDestinationUsersSocket() {
    for (var index = 0; index < this.state.destination_users.length; index++) {
      if (this.state.destination_users[index].user_id === this.props.userInfo.user_id) {
        return;
      }
    }
    this.socket.emit("add_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
  }
  notInDestinationUsersSocket() {

    for (var index = 0; index < this.state.destination_users.length; index++) {
      if (this.state.destination_users[index].user_id === this.props.userInfo.user_id) {
        this.socket.emit("delete_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
        return;
      }
    }
  }
  addToStopoverSocket(stopoverID) {
    this.state.stopovers.map(u => {
      if (u._id === stopoverID) {
        return;
      }
    });
    this.socket.emit("add_user_into_stopover", JSON.stringify({
      "group_id": this.state.groupID,
      "stopover_id": stopoverID,
      "user_id": this.props.userInfo.user_id
    }));
  }
  notInStopoverSocket(stopoverID) {
    this.state.stopovers.map(u => {
      if (u._id === stopoverID) {
        this.socket.emit("delete_user_into_stopover", JSON.stringify({
          "group_id": this.state.groupID,
          "stopover_id": stopoverID,
          "user_id": this.props.userInfo.user_id
        }));
        return;
      }
    });

  }
  async calculateDistanceThisUser() {
    if (this.state.start_location !== null) {
      let distance = await apis.distance_googleAPI(this.state.currentRegion, this.state.start_location);
      if (distance >= 0 && distance < 100) {
        this.addToArrivingUsersSocket();
        return;
      }
      else {
        this.notInArrivingUsersSocket();
      }
    }
    if (this.state.end_location !== null) {
      let distance = await apis.distance_googleAPI(this.state.currentRegion, this.state.end_location);
      if (distance >= 0 && distance < 100) {
        this.addToDestinationUsersSocket();
        return;
      }
      else {
        this.notInDestinationUsersSocket();
      }
    }
    this.state.stopovers.map(u => async () => {
      let distance = await apis.distance_googleAPI(this.state.currentRegion, u.coordinate);
      if (distance >= 0 && distance < 100) {
        return;

      }
    });
    if (this.state.direction_coordinates.length > 0) {
      console.log("direction_coordinates");
      console.log(this.state.direction_coordinates);
      /*let tempDistanceMin = await apis.distance_googleAPI(this.state.currentRegion, this.state.direction_coordinates[0].coordinate);
      for (var index = 0; index < this.state.direction_coordinates.length; index++) {
        let distance = await apis.distance_googleAPI(this.state.currentRegion, this.state.direction_coordinates[index].coordinate);
        if (distance < tempDistanceMin) {
          tempDistanceMin = distance;
        }
      }
      if(tempDistanceMin > 1000){
        Alert.alert(
          "Thông báo",
          'Bạn đã đi lạc'
        );
      }*/
    }

  }

  updateCurrentLatlng(groupID, position) {
    if (groupID === null) return;

    this.socket.emit('update_latlng', JSON.stringify({
      'user_id': this.props.userInfo.user_id,
      'group_id': this.state.groupID,
      'latlng':
      {
        'lat': position.coords.latitude,
        'lng': position.coords.longitude
      }
    }));
    this.calculateDistanceThisUser();
    this.forceUpdate();
  }
  async startGeolocation() {
    if (this.state.watchID !== null) navigator.geolocation.clearWatch(this.state.watchID);
    await navigator.geolocation.getCurrentPosition(
      (position) => {

        this.setState({
          currentRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
        this.updateCurrentLatlng(this.state.groupID, position);


      },
      (error) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              currentRegion: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            });
            this.updateCurrentLatlng(this.state.groupID, position);

          },
          (error) => {
            console.log("fail to get position");
            this.startGeolocation();
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.state.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        currentRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      });
      giobalThis.updateCurrentLatlng(this.state.groupID, position);

    })
  }
  componentWillUnmount() {
    console.log("Unmount");
    //navigator.geolocation.clearWatch(this.state.watchID);
  }
  _decode(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
  }

  async findDirection(start, end) {
    if (start === null || end === null) return;
    let responseAPI = await apis.findDirection_googleAPI(start, end);
    this.setState({
      direction_coordinates: this._decode(responseAPI.routes[0].overview_polyline.points)
    })
  }
  async findRouteDirection() {

    if (this.state.start_location === null || this.state.end_location === null) return;

    var directions = [];
    var stopovers = this.state.stopovers.slice(0);
    var currentPoint = this.state.start_location;
    directions.push(this.state.start_location);
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
    directions.push(this.state.end_location);
    console.log("------------------------");
    this.state.direction_coordinates = [];
    for (var index = 0; index < directions.length - 1; index++) {
      let responseAPI = await apis.findDirection_googleAPI(directions[index], directions[index + 1]);
      this.state.direction_coordinates = this.state.direction_coordinates.concat(this._decode(responseAPI.routes[0].overview_polyline.points))
    }
    this.forceUpdate();
  }
  componentDidMount() {
  }
  onActionSelected(position) {
    switch (position) {
      case 0:
        this.setState({
          openSearch: !this.state.openSearch
        });
        break;
      default:
        break;
    }

  }
  async GetRoomList(UserID) {
    let responseAPI = await apis.getRoomList(UserID);
    if (responseAPI == null) {
      return;
    }
    this.setState({
      _roomList: []
    });
    if (responseAPI.groups.length <= 0) return;
    for (var index = 0; index < responseAPI.groups.length; index++) {
      this.state._roomList.push(responseAPI.groups[index]);
    }
    this.state.groupName = this.state._roomList[0].name;
    this.state.groupID = this.state._roomList[0]._id;
    this.startNewSocket(this.state.groupID);
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
  animationMap() {
    this.refs.map.animateToRegion({
      latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
      longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
      latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 1.5,
      longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 1.5,
    }, 2000);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ToolbarAndroid
          style={{ height: 50, backgroundColor: 'sandybrown' }}
          title={this.state.groupName}
          navIcon={{ uri: "https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/menu-alt-512.png", width: 48, height: 48 }}
          onIconClicked={() => this.state.openDrawer ? this.refs.drawer.closeDrawer() : this.refs.drawer.openDrawer()}
        >
          {/*<Picker
            style={{width: width/4}}
            itemStyle={{backgroundColor:'orange'}}
            selectedValue={this.state.groupName}
            onValueChange={(itemValue, itemIndex) => {this.state.groupID = itemValue; 
                                                      this.state.groupName = this.state._roomList[itemIndex].name;
                                                      this.startNewSocket(this.state.groupID);}}
            mode='dropdown'>
            {this.state._roomList.map((u, i) =>{
              return(
                <Picker.Item label={u.name} value={u._id} key={u._id} />
              );
            })}
          </Picker>*/}
        </ToolbarAndroid>
        {this.state.openSearch ?
          <Search
            ref="searchbox"
            placeholder="Tìm kiếm"
            cancelTitle="Hủy"
            backgroundColor="silver"
            contentWidth={30}
          /**
          * There many props that can customizable
          * Please scroll down to Props section
          */
          /> : <View />}
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={200}
          drawerLockMode='locked-open'
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          onDrawerClose={() => this.state.openDrawer = false}
          onDrawerOpen={() => this.state.openDrawer = true}
          renderNavigationView={() =>
            <ScrollView style={{ backgroundColor: "#fdf5e6" }}>
              <View>
                <Text style={{
                  fontFamily: 'sans-serif',
                  fontSize: 20,
                  color: 'blue',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  backgroundColor: "#ffdab9"
                }}>
                  Kiểu bản đồ
                </Text>
                <Card containerStyle={{ margin: 0, padding: 0, backgroundColor: "#fdf5e6" }} >
                  <ListItem
                    titleStyle={this.state.mapType == "standard" ? { fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 20, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "standard" ? { backgroundColor: "#ffefd5" } : {}}
                    title="Cơ bản"
                    onPress={() => {
                      this.setState({
                        mapType: "standard"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    titleStyle={this.state.mapType == "satellite" ? { fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 20, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "satellite" ? { backgroundColor: "#ffefd5" } : {}}
                    title="Vệ tinh"
                    onPress={() => {
                      this.setState({
                        mapType: "satellite"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    titleStyle={this.state.mapType == "hybrid" ? { fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 20, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "hybrid" ? { backgroundColor: "#ffefd5" } : {}}
                    title="Địa hình"
                    onPress={() => {
                      this.setState({
                        mapType: "hybrid"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    titleStyle={this.state.mapType == "terrain" ? { fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 20, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "terrain" ? { backgroundColor: "#ffefd5" } : {}}
                    title="Hỗn hợp"
                    onPress={() => {
                      this.setState({
                        mapType: "terrain"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                </Card>
              </View>
              <View>
                <Text style={{
                  fontFamily: 'fantasy',
                  fontSize: 20,
                  color: 'blue',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  backgroundColor: "#ffdab9"
                }}>
                  Vòng tròn kết nối
                </Text>
                <Card containerStyle={{ margin: 0, padding: 0, backgroundColor: "#fdf5e6" }} >
                  {
                    this.state._roomList.map((u, i) => {
                      return (
                        <ListItem
                          titleStyle={this.state.groupID == u._id ? { fontSize: 20, fontFamily: 'fantasy', fontWeight: 'bold' } :
                            { fontSize: 20, fontFamily: 'fantasy' }}
                          underlayColor="#ffefd5"
                          containerStyle={this.state.groupID == u._id ? { backgroundColor: "#ffefd5" } : {}}
                          key={i}
                          title={u.name}
                          onPress={() => {
                            this.state.groupName = u.name;
                            this.state.groupID = u._id;
                            this.startNewSocket(this.state.groupID);
                            this.refs.drawer.closeDrawer();
                          }} />
                      )
                    })
                  }
                </Card>
              </View>
            </ScrollView>
          }>




          <View style={{ flex: 1, flexDirection: 'column' }}>
            <MapView
              ref="map"
              style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
              toolbarEnabled={false}
              onRegionChange={this.onRegionChange}
              mapType={this.state.mapType}
              onPress={this.onMapPress}>
              {this.state.markers.map(marker => (
                <MapView.Marker
                  title={marker.key}
                  key={marker.key}
                  coordinate={marker.coordinate}
                  pinColor='sandybrown'
                />
              ))}
              {this.state.members.map(user => {
                if (user._id != this.props.userInfo.user_id) return (
                  <MapView.Marker
                    title={user._id}
                    key={user._id}
                    coordinate={user.coordinate}>
                    <View>
                      <Image
                        source={require("../assets/map/map_user_marker.png")}
                        style={{ height: 48, width: 48 }}
                      />
                    </View>
                  </MapView.Marker>
                )
              })}
              {this.state.currentRegion !== null ? (
                <MapView.Marker
                  title='Vị trí của bạn'
                  key={0}
                  coordinate={this.state.currentRegion}
                >
                  <View>
                    <Image
                      source={require("../assets/map/map_user_marker.png")}
                      style={{ height: 48, width: 48 }}
                    >
                      <Image
                        style={{ width: 30, height: 30, alignSelf: "center", borderRadius: 30 / 2 }}
                        resizeMode="cover"

                        source={{ uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7" }}
                      />
                    </Image>
                  </View>

                </MapView.Marker>
              ) : <View />}

              {this.state.start_location !== null ?
                <MapView.Marker
                  title='Điểm bắt đầu'
                  key={1}
                  coordinate={this.state.start_location}>
                  <View>
                    <Image
                      source={require("../assets/map/map_startlocation_marker.png")}
                      style={{ height: 48, width: 48 }}
                    />
                  </View>
                  <MapView.Callout
                    style={{ width: 150, }}
                    tooltip={true}
                    onPress={() => { this.findDirection(this.state.currentRegion, this.state.start_location) }}>
                    <View style={{ flexDirection: 'column', padding: 10, alignItems: 'center', backgroundColor: 'orange', borderRadius: 10 }}>
                      <View style={{}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Điểm bắt đầu</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 15, margin: 5 }}>{this.state.start_address}</Text>
                      </View>
                      <View style={{}}>
                        <Text style={{ fontStyle: 'italic', fontSize: 10 }}>Chạm vào để tìm đường đi</Text>
                      </View>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                : <View />}
              {this.state.start_location !== null ?
                <MapView.Circle
                  center={this.state.start_location}
                  radius={100}
                  strokeWidth={1}
                />
                : <View />}
              {this.state.end_location !== null ?
                <MapView.Marker
                  title='Điểm kết thúc'
                  key={2}
                  coordinate={this.state.end_location}>
                  <View>
                    <Image
                      source={require("../assets/map/map_endlocation_marker.png")}
                      style={{ height: 48, width: 48 }}
                    />
                  </View>
                  <MapView.Callout
                    style={{ width: 150 }}
                    tooltip={true}
                    onPress={() => { this.findDirection(this.state.currentRegion, this.state.end_location) }}>
                    <View style={{ flexDirection: 'column', padding: 10, alignItems: 'center', backgroundColor: 'orange', borderRadius: 10 }}>
                      <View style={{}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Điểm kết thúc</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 15, margin: 5 }}>{this.state.end_address}</Text>
                      </View>
                      <View style={{}}>
                        <Text style={{ fontStyle: 'italic', fontSize: 10 }}>Chạm vào để tìm đường đi</Text>
                      </View>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                : <View />}
              {this.state.end_location !== null ?
                <MapView.Circle
                  center={this.state.end_location}
                  radius={100}
                  strokeWidth={1}
                />
                : <View />}
              {this.state.stopovers.map(u => {
                return (
                  <MapView.Marker
                    title='Điểm dừng chân'
                    key={id++}
                    coordinate={u.coordinate}>
                    <View>
                      <Image
                        source={require("../assets/map/map_stopover_marker.png")}
                        style={{ height: 48, width: 48 }}
                      />
                    </View>
                    <MapView.Callout
                      style={{ width: 150 }}
                      tooltip={true}
                      onPress={() => { this.findDirection(this.state.currentRegion, u.coordinate) }}>
                      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'orange', borderRadius: 150 / 2 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Điểm dừng chân</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontStyle: 'italic', fontSize: 10 }}>Chạm vào để tìm đường đi</Text>
                        </View>
                      </View>
                    </MapView.Callout>
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



            <View style={{ margin: 10, ...StyleSheet.absoluteFillObject }}>
              <View style={{ alignContent: 'center', alignSelf: 'flex-end', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.currentRegion !== null) {
                      this.refs.map.animateToRegion(this.state.currentRegion, 2000);
                    }
                  }}>
                  <Image
                    source={require("../assets/map/navbar_gps_icon.png")}
                    style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
              </View>
              <View style={{ alignContent: 'center', alignSelf: 'flex-end', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showMemberList: !this.state.showMemberList
                    })
                  }}>
                  <Image
                    source={{ uri: 'http://free-icon-rainbow.com/i/icon_05358/icon_053580_256.png' }}
                    style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
              </View>
              <View style={{ alignContent: 'center', alignSelf: 'flex-end', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showRoutesList: !this.state.showRoutesList
                    })
                  }}>
                  <Image
                    source={{ uri: 'https://d30y9cdsu7xlg0.cloudfront.net/png/81349-200.png' }}
                    style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.showMemberList &&
              <View style={{ justifyContent: 'flex-end', flexDirection: 'column', ...StyleSheet.absoluteFillObject }}>
              <View style={{ justifyContent: 'flex-end',padding: 5 }}>
              <View style={{ backgroundColor: 'sandybrown', opacity: 0.6, ...StyleSheet.absoluteFillObject, borderTopLeftRadius:25, borderTopRightRadius:25  }} />
              <Text style={{ fontFamily: 'sans-serif', fontSize: 25, alignSelf:'center', fontWeight:'bold', color:'black' }}>Danh sách thành viên</Text>
                  <ListView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    enableEmptySections={true}
                    scrollEnabled={true}
                    style={{}}
                    dataSource={this.state.dataMembersSource}
                    renderRow={(data) =>
                      <View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
                        <Image
                          style={{ width: 70, height: 70, alignSelf: "center", borderRadius: 70 / 2 }}
                          resizeMode="cover"
                          source={{ uri: "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-1/p160x160/16388040_1019171961520719_4744401854953494000_n.jpg?oh=a5294f7473787e86beb850562f89d547&oe=599332F7" }}
                        />
                        <Text style={{ fontSize: 20, color:'black',fontFamily: 'sans-serif' }}>{data.username}</Text>

                      </View>}

                  />
                </View>
              </View>}
            {
              this.state.showRoutesList &&
              <View style={{ justifyContent: 'flex-end', flexDirection: 'column', ...StyleSheet.absoluteFillObject }}>
                <View style={{ justifyContent: 'flex-end', padding: 5}}>
                  <View style={{ backgroundColor: 'sandybrown', opacity: 0.6, ...StyleSheet.absoluteFillObject, borderTopLeftRadius:25, borderTopRightRadius:25 }} />
                  <Text style={{ fontFamily: 'sans-serif', fontSize: 25, alignSelf:'center', fontWeight:'bold', color:'black' }}>Danh sách điểm hẹn</Text>
                  <ListView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    enableEmptySections={true}
                    scrollEnabled={true}
                    style={{}}
                    dataSource={this.state.dataRoutesSource}
                    renderRow={(data) =>
                      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, maxWidth:width-30, backgroundColor:'white', borderRadius:15 }}>
                        <View style={{ width: 100, height: 100, borderRadius: 150 / 2, margin: 10 }}>
                          <MapView
                            liteMode={true}
                                              
                  toolbarEnabled={false}
                            mapType={this.state.mapType}
                            style={{ ...StyleSheet.absoluteFillObject }}
                            region={{
                              latitude: data.coordinate.latitude,
                              longitude: data.coordinate.longitude,
                              latitudeDelta: LATITUDE_DELTA,
                              longitudeDelta: LONGITUDE_DELTA,
          /*{
          latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
          longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
          latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 1.5,
          longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 1.5,
        }*/}} >
                            <MapView.Marker title='Vị trí'
                              key={data._id}
                              coordinate={data.coordinate} />
                          </MapView>
                          </View>
                          <View style={{flexDirection:'column', margin:5}}>
                            <Text>Địa chỉ:</Text>
                            <Text>Bắt đầu:</Text>
                            <Text>Kết thúc:</Text>
                          </View>
                        </View>}
                  />
              </View>
              </View>
            }




          </View>






        </DrawerLayoutAndroid>

        {/*<ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Tìm đường" onPress={this.findRouteDirection}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    //justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    //...StyleSheet.absoluteFillObject,
  },
});