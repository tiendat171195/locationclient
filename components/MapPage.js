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
  Image
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

const customStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#fff0f5',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00ff7f',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#a52a2a',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdb76b',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#afeeee',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#9acd32',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#afeeee',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffdead',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#ffdead',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7fffd4',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0e68c',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#ff7f50',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7fffd4',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fff0f5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#00ffff',
      },
    ],
  },
];


var giobalThis;
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
  }
  componentWillMount() {
    this.startNewSocket(this.state.groupID);
    this.GetRoomList(this.props.userInfo.user_id);
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

    this.socket.emit('get_stopovers', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit('get_starting_point', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit('get_ending_point', JSON.stringify({
      "group_id": groupID
    }));
    this.socket.emit("get_arriving_users", JSON.stringify({
      "group_id": groupID
    }));

  }
  addSocketCallback() {
    //Add a new marker
    this.socket.on('add_marker_callback', function (data) {
      console.log('add_marker_callback');
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
      if (data.hasOwnProperty('success')) return;
      if (data.group_id != giobalThis.state.groupID) return;

      giobalThis.state.members = [];
      for (var index = 0; index < data.latlngs.length; index++) {
        giobalThis.state.members.push({ '_id': data.latlngs[index]._id, 'coordinate': { 'latitude': data.latlngs[index].latlng.lat, 'longitude': data.latlngs[index].latlng.lng }, 'key': data.latlngs[index]._id });
      }
      giobalThis.forceUpdate();
    });

    //Update 1 member's location
    this.socket.on('update_latlng_callback', function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.replaceLocationById(data.user_id, { 'latitude': data.latlng.lat, 'longitude': data.latlng.lng });
      giobalThis.forceUpdate();
    });

    this.socket.on('update_starting_point_callback', async function (data) {
      if (giobalThis.state.groupID != data.group_id) return;

      giobalThis.setState({
        start_date: data.hasOwnProperty("start_time") ? data.start_time : null
      })
      if (data.hasOwnProperty("start_latlng")) {
        var pointer = await giobalThis.getPointerInfo({
          latitude: data.start_latlng.lat,
          longitude: data.start_latlng.lng
        });
        giobalThis.setState({
          start_location: {
            "latitude": pointer.coordinate.latitude,
            "longitude": pointer.coordinate.longitude
          },
          start_address: pointer.address
        });
      }
      else {
        giobalThis.setState({
          start_location: null,
          start_address: null
        })
      }
    });
    this.socket.on('get_starting_point_callback', async function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.setState({
        start_date: data.hasOwnProperty("start_time") ? data.start_time : null
      })
      if (data.hasOwnProperty("start_latlng")) {
        var pointer = await giobalThis.getPointerInfo({
          latitude: data.start_latlng.lat,
          longitude: data.start_latlng.lng
        });
        giobalThis.setState({
          start_location: {
            "latitude": pointer.coordinate.latitude,
            "longitude": pointer.coordinate.longitude
          },
          start_address: pointer.address
        });
      }
      else {
        giobalThis.setState({
          start_location: null,
          start_address: null
        })
      }
    });

    this.socket.on('update_ending_point_callback', async function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.setState({
        end_date: data.hasOwnProperty("end_time") ? data.end_time : null
      })
      if (data.hasOwnProperty("end_latlng")) {
        var pointer = await giobalThis.getPointerInfo({
          latitude: data.end_latlng.lat,
          longitude: data.end_latlng.lng
        });
        giobalThis.setState({
          end_location: {
            "latitude": pointer.coordinate.latitude,
            "longitude": pointer.coordinate.longitude
          },
          end_address: pointer.address
        });
      }
      else {
        giobalThis.setState({
          end_location: null,
          end_address: null
        })
      }
    });

    this.socket.on('get_ending_point_callback', async function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.setState({
        end_date: data.hasOwnProperty("end_time") ? data.end_time : null
      })
      if (data.hasOwnProperty("end_latlng")) {
        var pointer = await giobalThis.getPointerInfo({
          latitude: data.end_latlng.lat,
          longitude: data.end_latlng.lng
        });
        giobalThis.setState({
          end_location: {
            "latitude": pointer.coordinate.latitude,
            "longitude": pointer.coordinate.longitude
          },
          end_address: pointer.address
        });
      }
      else {
        giobalThis.setState({
          end_location: null,
          end_address: null
        })
      }
      //will delete when api has fixed
      if (data.hasOwnProperty("start_latlng")) {
        var pointer = await giobalThis.getPointerInfo({
          latitude: data.start_latlng.lat,
          longitude: data.start_latlng.lng
        });
        giobalThis.setState({
          end_location: {
            "latitude": pointer.coordinate.latitude,
            "longitude": pointer.coordinate.longitude
          },
          end_address: pointer.address
        });
      }
      else {
        giobalThis.setState({
          end_location: null,
          end_address: null
        })
      }
    });

    this.socket.on('get_stopovers_callback', function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      data.stopovers.map(u => {
        giobalThis.state.stopovers.push({
          "_id": u._id,
          "coordinate":
          {
            "latitude": u.latlng.lat,
            "longitude": u.latlng.lng
          },
          'users': []
        });
      });
      giobalThis.forceUpdate();
    });

    this.socket.on('add_stopover_callback', function (data) {

      if (giobalThis.state.groupID != data.group_id) return;
      giobalThis.state.stopovers.push({
        "_id": data.stopover_id,
        "coordinate":
        {
          "latitude": data.latlng.lat,
          "longitude": data.latlng.lng
        }
      });
      giobalThis.forceUpdate();
    });

    this.socket.on("get_arriving_users_callback", function (data) {
      if (giobalThis.state.groupID != data.group_id) return;
      data.arriving_users.map(u => {
        console.log(data.username);
        giobalThis.state.arriving_users.push({
          "user_id": data._id,
          "username": data.username
        });
      });
    });

    //Handle 1 user comes in arriving point
    this.socket.on("add_arriving_user_callback", function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.arriving_users.push({
        "user_id": data.user_id,
        "username": data.username
      })
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng đang đến: " + data.username
      );
    });

    //Handle 1 user leaves starting point
    this.socket.on("delete_arriving_user_callback", function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.arriving_users.splice(this.state.arriving_users.indexOf({
        "user_id": data.user_id,
        "username": data.username
      }), 1);
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng rời khỏi: " + data.username
      );
    });

    //Handle 1 user comes in destination point
    this.socket.on("add_destination_user_callback", function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
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
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.destination_users.splice(this.state.destination_users.indexOf({
        "user_id": data.user_id,
        "username": data.username
      }), 1);
      Alert.alert(
        "Thông báo điểm hẹn",
        "Người dùng rời khỏi: " + data.username
      );
    });

    //Handle 1 user comes in stopover point
    this.socket.on("add_user_into_stopover_callback", function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.stopovers.map(u=>{
        if (u._id === data.stopover_id){
          u.users.push({
            "user_id": data.user_id,
            "username": data.username
          });
        }
      });
    });

    //Handle 1 user leaves stopover point
    this.socket.on("delete_user_into_stopover_callback", function (data) {
      if (data.group_id != giobalThis.state.groupID) return;
      giobalThis.state.stopovers.map(u => {
        if (u._id === data.stopover_id) {
          u.users.splice({
            "user_id": data.user_id,
            "username": data.username
          }, 1);
        }
      });
    });
  }
  startNewSocket(groupID) {
    if (groupID === null) return;
    if (this.socket !== undefined) this.socket.disconnect();
    this.socket = io('http://192.168.83.2:3000/maps?group_id=' + groupID, { jsonp: false });
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
    console.log('region change');
  }
  addToArrivingUserSocket() {
    if (this.state.arriving_users.indexOf({ "_id": this.props.userInfo.user_id, "username": this.props.userInfo.username }) === -1) {
      this.socket.emit("add_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
    }
  }
  notInArrivingUsersSocket() {
    if (this.state.arriving_users.indexOf({ "_id": this.props.userInfo.user_id, "username": this.props.userInfo.username }) !== -1) {
      this.socket.emit("delete_arriving_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
    }
  }
  addToDestinationUserSocket() {
    if (this.state.arriving_users.indexOf({ "_id": this.props.userInfo.user_id, "username": this.props.userInfo.username }) === -1) {
      this.socket.emit("add_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
    }
  }
  notInDestinationUsersSocket() {
    if (this.state.arriving_users.indexOf({ "_id": this.props.userInfo.user_id, "username": this.props.userInfo.username }) !== -1) {
      this.socket.emit("delete_destination_user", JSON.stringify({ "group_id": this.state.groupID, "user_id": this.props.userInfo.user_id }));
    }
  }
  addToStopoverSocket(stopoverID) {
    this.state.stopovers.map(u=>{
      if(u._id === stopoverID){
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
      if (distance > 0 && distance < 100) {
        this.addToArrivingUsersSocket();
        return;
      }
      else {
        this.notInArrivingUsersSocket();
      }
    }
    if (this.state.end_location !== null) {
      let distance = await apis.distance_googleAPI(this.state.currentRegion, this.state.end_location);
      if (distance > 0 && distance < 100) {
        this.addToDestinationUserSocket();
        return;
      }
      else{
        this.notInDestinationUsersSocket();
      }
    }
    this.state.stopovers.map(u => async () => {
      let distance = await apis.distance_googleAPI(this.state.currentRegion, u.coordinate);
      if (distance > 0 && distance < 100) {
        return;

      }
    });
  }

  updateCurrentLatlng(groupID, position) {
    if (groupID === null) return;
    this.calculateDistanceThisUser();
    this.socket.emit('update_latlng', JSON.stringify({
      'user_id': this.props.userInfo.user_id,
      'group_id': this.state.groupID,
      'latlng':
      {
        'lat': position.coords.latitude,
        'lng': position.coords.longitude
      }
    }));
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
    navigator.geolocation.clearWatch(this.state.watchID);
  }
  _decode(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
  }

  async findDirection() {
    if (this.state.start_location === null && this.state.currentRegion === null) return;
    let responseAPI = await apis.findDirection_googleAPI({ latitude: this.state.currentRegion.latitude, longitude: this.state.currentRegion.longitude },
      this.state.start_location);
    this.setState({
      direction_coordinates: this._decode(responseAPI.routes[0].overview_polyline.points)
    })
  }

  componentDidMount() {
  }
  onActionSelected(position) {
    switch (position) {
      case 0:
        this.setState({
          openSearch: !this.state.openSearch
        })
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
    for (var index = 0; index < responseAPI.groups.length; index++) {
      this.state._roomList.push(responseAPI.groups[index]);
    }
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
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ToolbarAndroid
          style={{ height: 50, backgroundColor: 'sandybrown' }}
          title="Bản đồ"
          navIcon={{ uri: "https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/menu-alt-512.png", width: 50, height: 50 }}
          onIconClicked={() => this.state.openDrawer ? this.refs.drawer.closeDrawer() : this.refs.drawer.openDrawer()}
          actions={[{ title: 'Tìm kiếm', icon: { uri: "https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/67-512.png" }, show: 'always' }]}
          onActionSelected={this.onActionSelected} />
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
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          onDrawerClose={() => this.state.openDrawer = false}
          onDrawerOpen={() => this.state.openDrawer = true}
          renderNavigationView={() =>
            <Card containerStyle={{ margin: 0, padding: 0 }} >
              {
                this.state._roomList.map((u, i) => {
                  return (
                    <ListItem
                      titleStyle={{ fontSize: 20, fontFamily: 'fantasy' }}
                      key={i}
                      title={u.name}
                      onPress={() => {
                        this.state.groupID = u._id;
                        this.startNewSocket(this.state.groupID);
                        this.refs.drawer.closeDrawer();
                      }} />
                  )
                })
              }
            </Card>

          }>
          <MapView
            ref="map"
            style={{ flex: 1 }}
            toolbarEnabled={false}
            onRegionChange={this.onRegionChange}
            //customMapStyle={customStyle}
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
                      source={{ uri: "https://furtaev.ru/preview/user_on_map_2_small.png" }}
                      style={{ height: 50, width: 50 }}
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
                    source={{ uri: "https://furtaev.ru/preview/user_on_map_2_small.png" }}
                    style={{ height: 50, width: 50 }}
                  />
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
                    source={{ uri: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Flag-2-Right-Pink-icon.png" }}
                    style={{ height: 50, width: 50 }}
                  />
                </View>
              </MapView.Marker>
              : <View />}
            {this.state.end_location !== null ?
              <MapView.Marker
                title='Điểm kết thúc'
                key={2}
                coordinate={this.state.end_location}>
                <View>
                  <Image
                    source={{ uri: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Flag-4-Right-Pink-icon.png" }}
                    style={{ height: 50, width: 50 }}
                  />
                </View>
              </MapView.Marker>
              : <View />}
            {this.state.stopovers.map(u => {
              <MapView.Marker
                title='Điểm dừng chân'
                key={u._id}
                coordinate={u.coordinate}>
                <View>
                  <Image
                    source={{ uri: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Pink-icon.png" }}
                    style={{ height: 50, width: 50 }}
                  />
                </View>
              </MapView.Marker>
            })}
            <MapView.Polyline
              coordinates={this.state.direction_coordinates}
              strokeWidth={5}
            />


          </MapView>
        </DrawerLayoutAndroid>

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Tìm đường" onPress={this.findDirection}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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