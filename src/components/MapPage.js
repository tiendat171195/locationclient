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
import { Card, ListItem, Button } from 'react-native-elements';
import Search from 'react-native-search-box';

import { connect } from 'react-redux';
let id = 100;
let first = true;
import {
  SERVER_PATH,
  CALLOUT_BACKGROUND_COLOR,
  MAIN_COLOR,
  TOOLBAR_HEIGHT,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  width,
  height,
  ASPECT_RATIO,
  MAIN_COLOR_DARK,
} from './type.js';
import {
  START_MARKER,
  END_MARKER,
  STOPOVER_MARKER
} from './images.js';
//Test
const testAppointments = [
  {
    "_id": "5942c00cf217af1d9c291d25",
    "address": "Khoa học tự nhiên",
    "start_time": 1498506976000,
    "end_time": 1498606976000,
    "radius": 500,
    "users": [],
    "coordinate": {
      "latitude": 10.762955,
      "longitude": 106.682027
    },
  },
  {
    "_id": "5942c00cf123355",
    "address": "Chợ Bến Thành",
    "start_time": 1498456986000,
    "end_time": 1499666976000,
    "radius": 500,
    "users": [],
    "coordinate": {
      "latitude": 10.772750,
      "longitude": 106.698017
    },
  }
];

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
class MapPage extends Component {
  constructor(props) {
    super(props);

    giobalThis = this;
    this.state = {
      markers: [],
      members: [],
      watchID: null,
      openSearch: false,
      openDrawer: false,
      _roomList: [],
      groupID: null,
      start_location: null,
      start_address: '',
      start_date: null,
      start_radius: 0,
      end_location: null,
      end_address: '',
      end_date: null,
      end_radius: 0,
      stopovers: [],
      direction_coordinates: [],
      arriving_users: [],
      destination_users: [],
      mapType: "standard",
      groupName: '',
      dataMembersSource: ds.cloneWithRows([]),
      dataRoutesSource: ds.cloneWithRows([]),
      appointments: [],
      showMemberList: true,
      showRoutesList: false,
      showRoutes: false,
      isWrongRoute: false,
      direction_to_route: [],
      route_direction: [],
      isBeing: false,
      showUsers: false,
      dataUsersSource: ds.cloneWithRows([]),
      mock: false,
    };


    this.bindThis = this.bindThis.bind(this);
    this.bindThis();

  }
  bindThis() {
    this.onMapPress = this.onMapPress.bind(this);
    this.getSocketData = this.getSocketData.bind(this);
    this.addSocketCallback = this.addSocketCallback.bind(this);
    this.findDirection = this.findDirection.bind(this);
    this.onActionSelected = this.onActionSelected.bind(this);
    this.calculateDistanceThisUser = this.calculateDistanceThisUser.bind(this);
    this.findRouteDirection = this.findRouteDirection.bind(this);
  }
  componentWillMount() {
    console.log('MapPage Will Mount');


  }
  componentWillReceiveProps(nextProps) {

    if (!this.props.getRoomsResponse.fetched && nextProps.getRoomsResponse.fetched) {
      console.log(nextProps.getRoomsResponse);
      if (nextProps.getRoomsResponse.data.groups === undefined || nextProps.getRoomsResponse.data.groups === 0) {
        //Chưa tham gia nhóm nào
      }
      else {
        this.state.groupID = nextProps.getRoomsResponse.data.groups[0]._id;
        this.state.groupName = nextProps.getRoomsResponse.data.groups[0].name;
        this.state.dataMembersSource = ds.cloneWithRows(nextProps.getRoomsResponse.data.groups[0].users);
      }
    }
    if (this.props.getSocketResponse.data !== null && first) {
      first = false;
      this.addSocketCallback();
    }
    if (!this.props.getAppointmentsResponse.uptodate && nextProps.getAppointmentsResponse.uptodate) {
      if (nextProps.getAppointmentsResponse.data.find(obj => obj.group_id == this.state.GroupID) !== undefined) {
        this.state.appointments = nextProps.getAppointmentsResponse.data.find(obj => obj.group_id == this.state.GroupID).appointments;
        this.state.dataRoutesSource = ds.cloneWithRows(this.state.appointments);

      }
    }
    if (!this.props.getRoutesResponse.uptodate && nextProps.getRoutesResponse.uptodate) {

      this.getRouteInfo(this.state.groupID, nextProps.getRoutesResponse.data);
    }

    /* if ((this.props.getRoomsResponse.data == undefined || this.props.getRoomsResponse.data.length == 0)
      && (nextProps.roomsList != undefined && nextProps.roomsList.length != 0)) {
      this.state.groupName = nextProps.roomsList[0].name;
      this.state.groupID = nextProps.roomsList[0]._id;
      this.choseNewGroup(this.state.groupID);
    } */
    /* if (this.props.appointments.length != nextProps.appointments.length) {
      this.choseNewGroup(this.state.groupID);
    } */
  }
  async getRouteInfo(groupId, routes = {}) {
    let data = routes.find(obj => obj.group_id == groupId);
    if (data === undefined) return;
    if (data.hasOwnProperty("start_latlng") && data.start_latlng.lat !== undefined) {
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

    if (data.hasOwnProperty("end_latlng") && data.end_latlng.lat !== undefined) {
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
    this.findRouteDirection(this.state.start_location, this.state.end_location);
  }
  getSocketData(groupID) {
    console.log('get socket data');
    if (groupID === null) return;
    /*this.props.getSocketResponse.data.emit('get_markers',
      JSON.stringify({
        'user_id': this.props.userInfo.user_id,
        'group_id': groupID
      }));*/

    this.props.getSocketResponse.data.emit('get_latlngs', JSON.stringify({
      'user_id': this.props.userInfo.user_id,
      'group_id': groupID
    }));




  }
  addSocketCallback() {
    if (this.props.getSocketResponse.data === null) return;

    //Get all members' location
    this.props.getSocketResponse.data.on('get_latlngs_callback', function (data) {
      if (data.hasOwnProperty('success') || data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.members = [];
      for (var index = 0; index < data.latlngs.length; index++) {

        data.latlngs[index].latlng.hasOwnProperty('lat') ?
          giobalThis.state.members.push({ '_id': data.latlngs[index]._id, 'username': data.latlngs[index].username, 'coordinate': { 'latitude': data.latlngs[index].latlng.lat, 'longitude': data.latlngs[index].latlng.lng }, 'key': data.latlngs[index]._id })
          : giobalThis.state.members.push({ '_id': data.latlngs[index]._id, 'username': data.latlngs[index].username, 'coordinate': {}, 'key': data.latlngs[index]._id });
      }
      console.log('done');
      giobalThis.forceUpdate();
    });

    //Update 1 member's location
    this.props.getSocketResponse.data.on('update_latlng_callback', function (data) {
      if (data.user_id == giobalThis.props.userInfo.user_id || data.group_id != giobalThis.state.groupID) return;
      giobalThis.replaceLocationById(data.user_id, { 'latitude': data.latlng.lat, 'longitude': data.latlng.lng });

      giobalThis.forceUpdate();
    });



    //Handle 1 user comes in arriving point
    this.props.getSocketResponse.data.on("add_arriving_user_callback", function (data) {
      if (data.user_id == giobalThis.props.userInfo.user_id) {
        console.log('Nguoi dung den diem bat dau');
        return;
      }
      console.log('Co ban be den diem bat dau');
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
    this.props.getSocketResponse.data.on("delete_arriving_user_callback", function (data) {
      console.log('Xoa nguoi roi khoi diem bat dau');
      for (var index = 0; index < giobalThis.state.arriving_users.length; index++) {
        if (giobalThis.state.arriving_users[index].user_id === data.user_id) {
          giobalThis.state.arriving_users.splice(index, 1);
          break;
        }
      }
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng rời khỏi: " + data.username
      );

    });

    //Handle 1 user comes in destination point
    this.props.getSocketResponse.data.on("add_destination_user_callback", function (data) {
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
    this.props.getSocketResponse.data.on("delete_destination_user_callback", function (data) {
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
    this.props.getSocketResponse.data.on("add_user_into_stopover_callback", function (data) {
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
    this.props.getSocketResponse.data.on("delete_user_into_stopover_callback", function (data) {
      giobalThis.state.stopovers.map(u => {
        if (u._id === data.stopover_id) {
          u.users.splice({
            "user_id": data.user_id,
            "username": data.username
          }, 1);
        }
      });
    });

    this.props.getSocketResponse.data.on("add_user_to_appointment_callback", function (data) {
      if (data.user_id == giobalThis.props.getUserInfoResponse.data.user_id) {
        Alert.alert(
          "Thông báo điểm hẹn",
          'Bạn vừa đi đến điểm hẹn ' + giobalThis.props.getAppointmentsResponse.data.find(obj => obj.group_id == data.group_id).appointments.find(obj => obj._id == data.appointment_id).address
        );
        return;
      }
      if (data.group_id == giobalThis.state.groupID) {

        Alert.alert(
          "Thông báo điểm hẹn",
          (giobalThis.props.getRoomsResponse.data.groups.find(obj => obj._id == giobalThis.state.groupID))
            .users.find(obj => obj._id == data.user_id).username
          + ' vừa đi đến điểm hẹn ' + giobalThis.props.getAppointmentsResponse.data.find(obj => obj.group_id == data.group_id).appointments.find(obj => obj._id == data.appointment_id).address
        );
      }
    });
    this.props.getSocketResponse.data.on("delete_user_from_appointment_callback", function (data) {
      if (data.user_id == giobalThis.props.getUserInfoResponse.data.user_id) {
        Alert.alert(
          "Thông báo điểm hẹn",
          'Bạn vừa rời khỏi điểm hẹn ' + giobalThis.props.getAppointmentsResponse.data.find(obj => obj.group_id == data.group_id).appointments.find(obj => obj._id == data.appointment_id).address
        );
        return;
      }
      if (data.group_id == giobalThis.state.groupID) {

        Alert.alert(
          "Thông báo điểm hẹn",
          (giobalThis.props.getRoomsResponse.data.groups.find(obj => obj._id == giobalThis.state.groupID))
            .users.find(obj => obj._id == data.user_id).username
          + ' vừa rời khỏi điểm hẹn ' + giobalThis.props.getAppointmentsResponse.data.find(obj => obj.group_id == data.group_id).appointments.find(obj => obj._id == data.appointment_id).address
        );
      }
    });
  }
  addMarker(groupID, coordinate) {
    if (groupID === null) return;
    this.props.getSocketResponse.data.emit('add_marker',
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
    //this.checkWrongRoute();
    /* Alert.alert(
      "Thông báo điểm hẹn",
      "user01 đã đến điểm hẹn Chợ Phạm Thế Hiển"
    );
    Alert.alert(
      "Thông báo điểm hẹn",
      "user01 đã rời khỏi điểm hẹn Chợ Phạm Thế Hiển"
    ); */
    if (this.state.showUsers) {
      this.setState({
        showUsers: false
      });
    }
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
    this.props.getSocketResponse.data.emit("add_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
  }
  notInArrivingUsersSocket() {
    for (var index = 0; index < this.state.arriving_users.length; index++) {
      if (this.state.arriving_users[index].user_id === this.props.userInfo.user_id) {
        this.props.getSocketResponse.data.emit("delete_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
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
    this.props.getSocketResponse.data.emit("add_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
  }
  async checkWrongRoute() {
    console.log('checkWrongRoute');
    if (this.props.getLocationResponse.data === null) return;
    if (this.state.route_direction.length > 0) {
      let arrayDistances = await apis.distanceMatrix_googleAPI([this.props.getLocationResponse.data], this.state.route_direction);
      console.log(arrayDistances);
      if (arrayDistances != null) {
        let minIndex = 0;
        let minDistance = arrayDistances.rows[0].elements[0].distance.value;
        arrayDistances.rows[0].elements.map((u, i) => {
          if (u.distance.value < minDistance) {
            minIndex = i;
            minDistance = u.distance.value;
          }
        })
        if (true) { //Đã lạc đường
          let des = await this.getPointerInfo(arrayDistances.destination_addresses[minIndex])
          let directionToRoute = await apis.findDirection_googleAPI(this.props.getLocationResponse.data, des.coordinate);
          if (this.state.isWrongRoute == false) {
            Alert.alert(
              'Thông báo',
              'Bạn đã đi lạc, xem hướng dẫn để trở lại lộ trình!'
            );
          }
          this.setState({
            isWrongRoute: true,
            direction_to_route: this._decode(directionToRoute.routes[0].overview_polyline.points)
          });

        }
        else { //Đúng đường
          this.setState({
            isWrongRoute: false,
            direction_to_route: []
          });
        }
      }

    }
  }
  notInDestinationUsersSocket() {

    for (var index = 0; index < this.state.destination_users.length; index++) {
      if (this.state.destination_users[index].user_id === this.props.userInfo.user_id) {
        this.props.getSocketResponse.data.emit("delete_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
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
    this.props.getSocketResponse.data.emit("add_user_into_stopover", JSON.stringify({
      "group_id": this.state.groupID,
      "stopover_id": stopoverID,
      "user_id": this.props.userInfo.user_id
    }));
  }
  notInStopoverSocket(stopoverID) {
    this.state.stopovers.map(u => {
      if (u._id === stopoverID) {
        this.props.getSocketResponse.data.emit("delete_user_into_stopover", JSON.stringify({
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
      let distance = await apis.distance_googleAPI(this.props.getLocationResponse.data, this.state.start_location);
      if (distance >= 0 && distance < 100) {
        this.addToArrivingUsersSocket();
        return;
      }
      else {
        this.notInArrivingUsersSocket();
      }
    }
    if (this.state.end_location !== null) {
      let distance = await apis.distance_googleAPI(this.props.getLocationResponse.data, this.state.end_location);
      if (distance >= 0 && distance < 100) {
        this.addToDestinationUsersSocket();
        return;
      }
      else {
        this.notInDestinationUsersSocket();
      }
    }

    let coordinatesStopoversArr = [];
    this.state.stopovers.map(u => async () => {
      coordinatesStopoversArr.push(u.coordinate)
    });
    let distanceToStopovers = await apis.distanceMatrix_googleAPI([this.props.getLocationResponse.data], coordinatesStopoversArr);
    if (distanceToStopovers != null) {
      this.state.stopovers.map((u, i) => {
        if (distanceToStopovers.rows[0].elements[i].distance.value < u.radius) {
          //Nằm trong stopover
        }
        else {
          //Rời khỏi stopver
        }
      });
    }



  }

  updateCurrentLatlng(groupID, position) {
    if (groupID === null) return;

    this.props.getSocketResponse.data.emit('update_latlng', JSON.stringify({
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

  componentWillUnmount() {

    console.log("Unmount");
    //this.props.getSocketResponse.data.disconnect();
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
    });
  }
  async findRouteDirection() {
    if (this.state.start_location === null || this.state.end_location === null) return;
    let coordinatesStopoversArr = [];
    this.state.stopovers.map(u => {
      coordinatesStopoversArr.push(u.coordinate)
    });
    let RouteResponseAPI = await apis.findDirection_googleAPI(this.state.start_location, this.state.end_location, coordinatesStopoversArr)
    if (RouteResponseAPI != null) {
      this.setState({
        route_direction: this._decode(RouteResponseAPI.routes[0].overview_polyline.points)
      });
    }
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
  choseNewGroup(GroupID) {
    /* //console.log('chosenewgroup---------------------');
    //console.log(this.state.appointments);
    //console.log(this.props.appointments); */
    this.state.groupID = GroupID;
    this.state.direction_coordinates = [];
    this.state.route_direction = [];
    this.state.direction_to_route = [];
    this.state.isWrongRoute = false;
    this.state.members = [];
    this.state.dataMembersSource = ds.cloneWithRows((this.props.getRoomsResponse.data.groups.find(obj => obj._id == GroupID)).users);

    this.state.appointments = this.props.getAppointmentsResponse.data.find(obj => obj.group_id == GroupID).appointments;
    this.state.dataRoutesSource = ds.cloneWithRows(this.state.appointments);

    this.getRouteInfo(GroupID, this.props.getRoutesResponse.data);
    this.getSocketData(this.state.groupID);

    this.forceUpdate();
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
  convertDate(date) {
    let tempDate = new Date(date);
    let tempText = '';
    tempText += tempDate.getHours()
      + ':'
      + (tempDate.getMinutes() < 10 ? '0' + tempDate.getMinutes() : tempDate.getMinutes())
      + ' ngày '
      + tempDate.getDate()
      + '/'
      + (tempDate.getMonth() + 1)
      + '/'
      + (1900 + tempDate.getYear());
    return tempText;
  }
  animationMap() {
    /* this.refs.map.animateToRegion({
      latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
      longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
      latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 1.5,
      longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 1.5,
    }, 2000); */
  }
  choseNewActions(type) {
    switch (type) {
      case 0:
        this.setState({
          showMemberList: !this.state.showMemberList,
          showRoutesList: false,
          showRoutes: false,
          showUsers: false,
        });
        break;
      case 1:
        this.setState({
          showMemberList: false,
          showRoutes: false,
          showRoutesList: !this.state.showRoutesList,
          showUsers: false,
        });
        break;
      case 2:
        this.setState({
          showMemberList: false,
          showRoutes: !this.state.showRoutes,
          showRoutesList: false,
          showUsers: false,
        });
        break;
      case 3:
        this.setState({
          showMemberList: false,
          showRoutes: false,
          showRoutesList: false,
          showUsers: true
        });
        break;
      case 99:
        this.setState({
          showMemberList: false,
          showRoutes: false,
          showRoutesList: false
        })
      default:
        break;
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ToolbarAndroid
          style={{ height: TOOLBAR_HEIGHT, backgroundColor: MAIN_COLOR }}
          title={this.state.groupName}
          titleColor='white'

          navIcon={{ uri: "http://icon-icons.com/icons2/916/PNG/512/Menu_icon_icon-icons.com_71858.png", width: 40, height: 40 }}
          onIconClicked={() => this.state.openDrawer ? this.refs.drawer.closeDrawer() : this.refs.drawer.openDrawer()}
        >
        </ToolbarAndroid>
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={width - 16 * 3}
          drawerLockMode='locked-open'
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          onDrawerClose={() => this.state.openDrawer = false}
          onDrawerOpen={() => this.state.openDrawer = true}
          renderNavigationView={() =>
            <ScrollView style={{ backgroundColor: "#e6ffe6" }}>
              <View>
                <View style={{
                  flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 3, alignItems: 'center',
                  backgroundColor: 'lightseagreen'
                }}>
                  <Image
                    style={{ width: 25, height: 25, marginRight: 5 }}
                    resizeMode='contain'
                    source={{ uri: 'http://patelholidays.com/images/map.png' }} />
                  <Text style={{
                    fontFamily: 'sans-serif',
                    fontSize: 18,
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}>
                    Kiểu bản đồ
                </Text>
                </View>
                <Card containerStyle={{ margin: 0, padding: 0, backgroundColor: "#ccffee" }} >
                  <ListItem
                    titleStyle={this.state.mapType == "standard" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "standard" ? { backgroundColor: "#80ffd4", height: 48 } : { height: 48 }}
                    title={<Text style={this.state.mapType == "standard" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}>Cơ bản</Text>}
                    onPress={() => {
                      this.setState({
                        mapType: "standard"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    titleStyle={this.state.mapType == "satellite" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "satellite" ? { backgroundColor: "#80ffd4", height: 48 } : { height: 48 }}
                    title={<Text style={this.state.mapType == "satellite" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}>Vệ tinh</Text>}
                    onPress={() => {
                      this.setState({
                        mapType: "satellite"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    titleStyle={this.state.mapType == "hybrid" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "hybrid" ? { backgroundColor: "#80ffd4", height: 48 } : { height: 48 }}
                    title={<Text style={this.state.mapType == "hybrid" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}>Địa hình</Text>}
                    onPress={() => {
                      this.setState({
                        mapType: "hybrid"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                  <ListItem
                    underlayColor="#ffefd5"
                    containerStyle={this.state.mapType == "terrain" ? { backgroundColor: "#80ffd4", height: 48 } : { height: 48 }}
                    title={<Text style={this.state.mapType == "terrain" ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                      { fontSize: 16, fontFamily: 'sans-serif' }}>Hỗn hợp</Text>}
                    onPress={() => {
                      this.setState({
                        mapType: "terrain"
                      });
                      this.refs.drawer.closeDrawer();
                    }} />
                </Card>
              </View>
              <View>
                <View style={{
                  flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 3, alignItems: 'center',
                  backgroundColor: 'lightseagreen'
                }}>
                  <Image
                    style={{ width: 25, height: 25, marginRight: 5 }}
                    resizeMode='contain'
                    source={{ uri: 'http://www.freeiconspng.com/uploads/group-registration-icon-26.png' }} />
                  <Text style={{
                    fontFamily: 'sans-serif',
                    fontSize: 18,
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: 'bold',
                  }}>
                    Nhóm
                </Text>
                </View>
                <Card containerStyle={{ margin: 0, padding: 0, backgroundColor: "#ccffee" }} >
                  {
                    this.props.getRoomsResponse !== undefined &&
                    this.props.getRoomsResponse.data.groups !== undefined
                    && this.props.getRoomsResponse.data.groups.map((u, i) => {
                      return (
                        <ListItem
                          underlayColor="#80ffd4"
                          containerStyle={this.state.groupID == u._id ? { backgroundColor: "#80ffd4", height: 48 } : { height: 48 }}
                          key={i}
                          title={<Text style={this.state.groupID == u._id ? { fontSize: 16, fontFamily: 'sans-serif', fontWeight: 'bold' } :
                            { fontSize: 16, fontFamily: 'sans-serif' }} numberOfLines={1}>{u.name}</Text>}
                          onPress={() => {
                            this.state.groupName = u.name;
                            this.choseNewGroup(u._id);
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
                  pinColor='#ccffee'
                />
              ))}
              {this.state.members.map(user => {
                if (user._id != this.props.userInfo.user_id && user.hasOwnProperty('coordinate') && user.coordinate.hasOwnProperty('latitude')) return (
                  <MapView.Marker
                    title={user.username}
                    key={user._id}
                    coordinate={user.coordinate}>
                    <View>
                      <Image
                        source={require("../assets/map/map_user_marker.png")}
                        style={{ height: 48, width: 48 }}
                      >
                        <Image
                          style={{ width: 30, height: 30, alignSelf: "center", borderRadius: 30 / 2 }}
                          resizeMode="cover"
                          source={{ uri: this.props.getRoomsResponse.data.groups.find(obj => obj._id == this.state.groupID).users.find(obj => obj._id == user._id).avatar_url }}
                        />
                      </Image>
                    </View>
                  </MapView.Marker>
                )
              })}
              {this.props.getLocationResponse.data !== null ? (
                <MapView.Marker
                  title='Vị trí của bạn'
                  key={0}
                  coordinate={{
                    latitude: this.props.getLocationResponse.data.latitude,
                    longitude: this.props.getLocationResponse.data.longitude
                  }}
                >
                  <View>
                    <Image
                      source={require("../assets/map/map_user_marker.png")}
                      style={{ height: 48, width: 48 }}
                    >
                      <Image
                        style={{ width: 30, height: 30, alignSelf: "center", borderRadius: 30 / 2 }}
                        resizeMode="cover"

                        source={{ uri: this.props.getUserInfoResponse.data.avatar_url }}
                      />
                    </Image>
                  </View>

                </MapView.Marker>
              ) : <View />}

              {this.state.start_location !== null ?
                <MapView.Marker
                  title='Điểm bắt đầu'
                  pinColor="#1e90ff"
                  key={1}
                  coordinate={this.state.start_location}>
                  <View>
                    <Image
                      source={START_MARKER}
                      style={{ height: 48, width: 48 }}
                    />
                  </View>
                  <MapView.Callout
                    style={{ width: 150, }}
                    tooltip={true}
                    onPress={() => { this.findDirection(this.props.getLocationResponse.data, this.state.start_location) }}>
                    <View style={{ flexDirection: 'column', padding: 10, alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 10 }}>
                      <View style={{}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Điểm bắt đầu</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, margin: 5 }}>{this.state.start_address}</Text>
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
                  strokeColor='blue'
                  fillColor="rgba(55, 55, 255, 0.5)"
                />
                : <View />}
              {this.state.end_location !== null ?
                <MapView.Marker
                  title='Điểm kết thúc'
                  pinColor='#dc143c'
                  key={2}
                  coordinate={this.state.end_location}>
                  <View>
                    <Image
                      source={END_MARKER}
                      style={{ height: 48, width: 48 }}
                    />
                  </View>
                  <MapView.Callout
                    style={{ width: 150 }}
                    tooltip={true}
                    onPress={() => { this.findDirection(this.props.getLocationResponse.data, this.state.end_location) }}>
                    <View style={{ flexDirection: 'column', padding: 10, alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 10 }}>
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
                  strokeColor='pink'
                  fillColor="rgba(255, 50, 35, 0.5)"
                />
                : <View />}
              {this.state.stopovers.map(u => {
                return (
                  <View>
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
                      <MapView.Callout
                        style={{ width: 150 }}
                        tooltip={true}
                        onPress={() => { this.findDirection(this.props.getLocationResponse.data, u.coordinate) }}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: CALLOUT_BACKGROUND_COLOR, borderRadius: 150 / 2 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Điểm dừng chân</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', fontSize: 10 }}>Chạm vào để tìm đường đi</Text>
                          </View>
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>
                    <MapView.Circle
                      center={u.coordinate}
                      radius={100}
                      strokeWidth={1}
                      strokeColor='green'
                      fillColor="rgba(25, 250, 35, 0.5)"
                    /></View>)
              })}
              {this.state.appointments.map((u, i) => {
                return (
                  <View>
                    <MapView.Marker
                      title='Điểm hẹn'
                      description={u.address}
                      key={u._id}
                      ref={u._id}
                      coordinate={u.coordinate}
                      onPress={() => {
                        let usersArr = [];
                        u.users.map(user_id => {
                          usersArr.push({
                            _id: user_id,
                            username: (this.props.getRoomsResponse.data.groups.find(obj => obj._id == this.state.groupID)).users.find(obj => obj._id == user_id).username,
                            avatar_url: (this.props.getRoomsResponse.data.groups.find(obj => obj._id == this.state.groupID)).users.find(obj => obj._id == user_id).avatar_url,
                          })
                        });

                        this.setState({
                          dataUsersSource: ds.cloneWithRows(usersArr)
                        });
                        this.choseNewActions(3);
                      }}
                    >
                    </MapView.Marker>
                    <MapView.Circle
                      center={u.coordinate}
                      radius={100}
                      strokeWidth={1}
                      strokeColor='green'
                      fillColor="rgba(55, 255, 55, 0.5)"
                    /></View>)
              })}
              {
                this.state.mock &&
                <MapView.Marker
                  title='user01'
                  key={9999}
                  coordinate={this.state.members.find(obj => obj.username == 'user01').coordinate}
                >

                  <View>
                    <Image
                      source={require("../assets/map/map_user_marker.png")}
                      style={{ height: 48, width: 48 }}
                    >
                      <Image
                        style={{ width: 30, height: 30, alignSelf: "center", borderRadius: 30 / 2 }}
                        resizeMode="cover"

                        source={{ uri: this.state.members.find(obj => obj.username == 'user01').avatar_url }}
                      />
                    </Image>
                  </View>

                </MapView.Marker>
              }
              {this.state.direction_coordinates.length > 0 &&
                <MapView.Polyline
                  coordinates={this.state.direction_coordinates}
                  strokeColor="green"
                  strokeWidth={4}
                />}
              {this.state.isWrongRoute &&
                <MapView.Polyline
                  coordinates={this.state.direction_to_route}
                  strokeColor="red"
                  strokeWidth={4}
                />
              }
              {this.state.route_direction.length > 0 &&
                <MapView.Polyline
                  coordinates={this.state.route_direction}
                  strokeColor={this.state.isWrongRoute ? 'grey' : 'blue'}
                  strokeWidth={4}
                />}
            </MapView>

            {(this.state.showMemberList
              || this.state.showRoutes
              || this.state.showRoutesList)
              && <TouchableOpacity
                onPress={() => { this.choseNewActions(99) }}
                style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'black', opacity: 0.8, justifyContent: 'center' }}>

              </TouchableOpacity>}

            <View style={{ margin: 10, ...StyleSheet.absoluteFillObject, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ alignContent: 'center', padding: 5, marginBottom: 1, backgroundColor: this.state.showMemberList ? "grey" : "white", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.choseNewActions(0);
                    }}>
                    <Image
                      source={{ uri: 'http://free-icon-rainbow.com/i/icon_05358/icon_053580_256.png' }}
                      style={{ height: 30, width: 30 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ alignContent: 'center', padding: 5, backgroundColor: this.state.showRoutesList ? "grey" : "white", marginBottom: 1, }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.choseNewActions(1);
                    }}>
                    <Image
                      source={{ uri: 'http://icons.iconarchive.com/icons/icons8/ios7/512/Maps-Waypoint-Map-icon.png' }}
                      style={{ height: 30, width: 30 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ alignContent: 'center', padding: 5, backgroundColor: this.state.showRoutes ? "grey" : "white", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.choseNewActions(2);
                    }}>
                    <Image
                      source={{ uri: 'https://d30y9cdsu7xlg0.cloudfront.net/png/81349-200.png' }}
                      style={{ height: 30, width: 30 }} />
                  </TouchableOpacity>
                </View>

              </View>



              <View style={{ alignContent: 'center', alignSelf: 'flex-start', padding: 5, backgroundColor: "white", borderRadius: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.props.getLocationResponse.data !== null) {
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

            {this.state.showMemberList &&
              <View style={{ justifyContent: 'flex-end', flexDirection: 'column', ...StyleSheet.absoluteFillObject }}>
                <View style={{ justifyContent: 'flex-end' }}>
                  <View>
                    <View style={{ backgroundColor: '#ccffee', opacity: 0, ...StyleSheet.absoluteFillObject }} />
                    <ListView
                      horizontal={true}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      enableEmptySections={true}
                      scrollEnabled={true}
                      style={{ paddingHorizontal: 16 }}
                      dataSource={this.state.dataMembersSource}
                      renderRow={(data) =>
                        <View style={{ flexDirection: 'column', alignItems: 'center', margin: 8 }}>
                          <Image
                            style={{ width: 64, height: 64, alignSelf: "center", borderRadius: 70 / 2 }}
                            resizeMode="cover"
                            source={{ uri: data.avatar_url }}
                          />
                          <Text style={{ fontSize: 16, color: 'white', fontFamily: 'sans-serif' }}>{data.username}</Text>

                        </View>}

                    />
                  </View>
                </View>
              </View>}


            {
              this.state.showRoutesList &&
              <View style={{ justifyContent: 'flex-end', flexDirection: 'column', ...StyleSheet.absoluteFillObject }}>
                <View style={{ justifyContent: 'flex-end', paddingHorizontal: 5 }}>

                  <View>
                    {this.state.appointments.length > 0 ?
                      <ListView
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        enableEmptySections={true}
                        scrollEnabled={true}
                        style={{}}
                        dataSource={this.state.dataRoutesSource}
                        renderRow={(data) =>
                          <TouchableOpacity

                            onPress={() => {
                              console.log(data.users);
                              this.refs.map.animateToRegion({
                                latitude: data.coordinate.latitude,
                                longitude: data.coordinate.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                              }, 2000);


                            }}
                            activeOpacity={0.8}
                            style={{ flexDirection: 'column', alignItems: 'center', margin: 4, marginBottom: 8, maxWidth: width - 30, backgroundColor: 'white' }}>
                            <View style={{ width: width * 2 / 3, height: width / 3, margin: 0 }}>
                              <MapView
                                liteMode={true}

                                toolbarEnabled={false}
                                style={{ ...StyleSheet.absoluteFillObject }}
                                region={{
                                  latitude: data.coordinate.latitude,
                                  longitude: data.coordinate.longitude,
                                  latitudeDelta: LATITUDE_DELTA,
                                  longitudeDelta: LONGITUDE_DELTA,
                                }} >
                                <MapView.Marker title='Vị trí'
                                  key={data._id}
                                  coordinate={data.coordinate} />
                              </MapView>
                            </View>
                            <View style={{ flexDirection: 'column', padding: 16, width: width * 2 / 3, height: width / 3 }}>
                              <Text style={{ color: 'black', fontSize: 12 }}
                                numberOfLines={3}>Địa chỉ: {data.address}</Text>
                              <Text style={{ color: 'black', fontSize: 12 }}>Bắt đầu: {this.convertDate(data.start_time)}</Text>
                              <Text style={{ color: 'black', fontSize: 12 }}>Kết thúc: {this.convertDate(data.end_time)}</Text>
                            </View>
                          </TouchableOpacity>}
                      /> :
                      <Text style={{ fontSize: 25, color: 'black', padding: 5 }}>Nhóm không có điểm hẹn!</Text>}
                  </View>
                </View>
              </View>
            }


            {
              this.state.showRoutes &&
              <View style={{ justifyContent: 'center', flexDirection: 'column', ...StyleSheet.absoluteFillObject, marginBottom:16 }}>

                <View style={{ justifyContent: 'flex-end', paddingHorizontal: 5 }}>
                  {
                    (this.state.start_location !== null && this.state.end_location !== null) ?
                      <View style={{}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.refs.map.animateToRegion({
                              latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
                              longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
                              latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 1.5,
                              longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 1.5,
                            })
                          }}
                          activeOpacity={0.8}
                          style={{ flexDirection: 'column', alignItems: 'center', margin: 5, maxWidth: width - 30, backgroundColor: 'white', alignSelf: 'center' }}>

                          <View style={{ width: width * 2 / 3, height: width / 3 }}>
                            <MapView
                              liteMode={true}
                              toolbarEnabled={false}
                              style={{ ...StyleSheet.absoluteFillObject }}
                              region={{
                                latitude: (this.state.start_location.latitude + this.state.end_location.latitude) / 2,
                                longitude: (this.state.start_location.longitude + this.state.end_location.longitude) / 2,
                                latitudeDelta: Math.abs(this.state.start_location.latitude - this.state.end_location.latitude) * 1.5,
                                longitudeDelta: Math.abs(this.state.start_location.longitude - this.state.end_location.longitude) * 1.5,
                              }} >
                              <MapView.Marker
                                title='Điểm bắt đầu'
                                key={0}
                                coordinate={this.state.start_location}
                              >
                                <View>
                                  <Image
                                    source={START_MARKER}
                                    style={{ height: 38, width: 38 }}
                                  />
                                </View>
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
                                fillColor='#ccffee'
                                strokeWidth={1}
                              />
                              <MapView.Marker
                                title='Điểm kết thúc'
                                key={1}
                                coordinate={this.state.end_location}
                              >
                                <View>
                                  <Image
                                    source={END_MARKER}
                                    style={{ height: 38, width: 38 }}
                                  />
                                </View>
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
                                fillColor='#ccffee'
                                strokeWidth={1}
                              />
                              {this.state.stopovers.map(u => {
                                return (
                                  <MapView.Marker
                                    title='Điểm dừng chân'
                                    description={u.address}
                                    key={id++}
                                    coordinate={u.coordinate}>
                                    <View style={{}}>
                                      <Image
                                        source={STOPOVER_MARKER}
                                        style={{ height: 28, width: 28 }}
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
                              {this.state.route_direction.length > 0 &&
                                <MapView.Polyline
                                  coordinates={this.state.route_direction}
                                  strokeColor="grey"
                                  strokeWidth={2}
                                />}

                            </MapView>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 16, width: width * 2 / 3, height: width / 3 }}>
                            <Text style={{ color: 'black', fontSize: 12 }}
                              numberOfLines={3}>Điểm khởi hành: {this.state.start_address}</Text>
                            <Text style={{ color: 'black', fontSize: 12 }}
                              numberOfLines={3}>Điểm kết thúc: {this.state.end_address}</Text>
                          </View>
                          {!this.state.isBeing && (this.state.start_location !== null && this.state.end_location !== null) &&
                            <View
                              style={{ width: width * 2 / 3, marginBottom:16 }}>
                              <Button
                                onPress={() => {
                                  this.getSocketData(this.state.groupID);
                                  this.choseNewActions(99);
                                  this.setState({
                                    isBeing: true
                                  })
                                }}
                                title="Bắt đầu"
                                fontWeight="bold"
                                textStyle={{ fontSize: 18 }}
                                backgroundColor={MAIN_COLOR}
                                borderRadius={0}
                                color='white' />
                            </View>}
                        </TouchableOpacity>
                      </View>
                      : <View>
                        <View style={{ backgroundColor: '#ccffee', opacity: 0.8, ...StyleSheet.absoluteFillObject }} />
                        <Text style={{ color: 'black', fontSize: 18, padding: 5 }}>Nhóm chưa thiết lập lộ trình!</Text>
                      </View>}
                </View>

              </View>

            }


            {this.state.showUsers &&
              <View style={{ justifyContent: 'flex-end', flexDirection: 'column', ...StyleSheet.absoluteFillObject }}>
                <View style={{ justifyContent: 'flex-end', paddingHorizontal: 5 }}>
                  
                  <View>
                    {this.state.dataUsersSource.getRowCount().toString() != '0' ?
                      <ListView
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        enableEmptySections={true}
                        scrollEnabled={true}
                        style={{}}
                        dataSource={this.state.dataUsersSource}
                        renderRow={(data) =>
                          <View style={{ flexDirection: 'column', alignItems: 'center', margin: 5 }}>
                            <Image
                              style={{ width: 64, height: 64, alignSelf: "center", borderRadius: 70 / 2 }}
                              resizeMode="cover"
                              source={{ uri: data.avatar_url }}
                            />
                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'sans-serif' }}>{data.username}</Text>

                          </View>}

                      />
                      : <View>
                        
                        <Text style={{ color: 'black', fontSize: 20, padding: 5 }}>Hiện không có thành viên nào có mặt!</Text>
                      </View>}
                  </View>
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

function mapStateToProps(state) {
  return {
    getLocationResponse: state.getLocationResponse,
    getSocketResponse: state.getSocketResponse,
    getAppointmentsResponse: state.getAppointmentsResponse,
    getRoutesResponse: state.getRoutesResponse,
    getRoomsResponse: state.getRoomsResponse,
    getUserInfoResponse: state.getUserInfoResponse,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPage);