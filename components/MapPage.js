'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	Dimensions,
	StyleSheet,
  Alert
} from 'react-native';
import MapView from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// socket
import io from 'socket.io-client/dist/socket.io.js';
import apis from '../apis/api.js';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

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


var myThis;
export default class MapPage extends Component {
	constructor(props){
		super(props);
    myThis = this;
		this.state = {
	      markers: [],
        currentRegion: {
	        latitude: LATITUDE,
	        longitude: LONGITUDE,
	        latitudeDelta: LATITUDE_DELTA,
	        longitudeDelta: LONGITUDE_DELTA,
	      },
        isAllowedGPS: true,
        members: [],
        watchID: null,
        start_date: 0,
        start_location: null,
        direction_coordinates: [],
        arriving_users: [],
	    };
	    this.onMapPress = this.onMapPress.bind(this);
      this.startSocket = this.startSocket.bind(this);
      this.getData = this.getData.bind(this);
      this.startGeolocation = this.startGeolocation.bind(this);
      this.findDirection = this.findDirection.bind(this);
      this.calculateDistanceAllMembers = this.calculateDistanceAllMembers.bind(this);
      
	}
  componentWillMount(){
    this.startSocket();
    this.getData();
    this.startGeolocation();
  }
  componentWillReceiveProps(){
    this.getData();
  }
  getData(){
    this.socket.emit('get_markers',  
                      JSON.stringify({'token': this.props.userInfo.token, 
                                      'user_id': this.props.userInfo.user_id, 
                                      'group_id': this.props.groupID}));
    this.socket.emit('get_latlngs',  
                      JSON.stringify({'token': this.props.userInfo.token, 
                                      'user_id': this.props.userInfo.user_id, 
                                      'group_id': this.props.groupID}));
    this.socket.emit('get_starting_point', 
                      JSON.stringify({"token": this.props.userInfo.token,
                                      "group_id": this.props.groupID}));
}
  startSocket(){
    this.socket = io('http://192.168.83.2:3000/maps', {jsonp:false});

    this.socket.on('add_marker_callback', function(data){
      if(data.hasOwnProperty('success')){
        return;
      }
      if(data.group_id != myThis.props.groupID) return;
      myThis.setState({
	      markers: [
	        ...myThis.state.markers,
	        {
	          coordinate: {'latitude':data.latlng.lat, 'longitude':data.latlng.lng},
	          key: data.marker_id,
	        },
	      ],
	    });
      myThis.forceUpdate();
    });

    this.socket.on('get_markers_callback', function(data){
      console.log(data);
      if(data.hasOwnProperty('success')){
        return;
      }
      if(data.group_id != myThis.props.groupID) return;
      myThis.setState({ markers: [] });
      data.markers.map(marker=>{
        myThis.setState({
	      markers: [
	        ...myThis.state.markers,
	        {
	          coordinate: {'latitude':marker.latlng.lat, 'longitude':marker.latlng.lng},
	          key: marker._id,
	        },
	      ],
	    });
      })
    });
    
    this.socket.on('get_latlngs_callback', function(data){
      //console.log(data);
      if(data.hasOwnProperty('success')) return;
      if(data.group_id != myThis.props.groupID) return;

      myThis.setState({ members: [] });     
      for (var index = 0; index < data.latlngs.length; index++) {
        myThis.state.members.push({'_id':data.latlngs[index]._id, 'coordinate':{'latitude':data.latlngs[index].latlng.lat, 'longitude':data.latlngs[index].latlng.lng}, 'key':id++});
      }
      myThis.calculateDistanceAllMembers();
     myThis.forceUpdate();
    });
    this.socket.on('update_latlng_callback', function(data){
     // console.log('update latlng');
       //console.log(data);
       if(data.group_id != myThis.props.groupID) return;
      myThis.replaceLocationById(data.user_id, {'latitude': data.latlng.lat, 'longitude': data.latlng.lng});
      myThis.calculateDistanceAllMembers();
      myThis.forceUpdate();
    });
    this.socket.on('update_starting_point_callback', function(data){
            if(myThis.props.groupID != data.group_id) return;
            myThis.setState({
                start_date: data.start_time,
                start_location: data.hasOwnProperty("start_latlng")?{"latitude":data.start_latlng.lat, "longitude":data.start_latlng.lng}
                                                                  :null
            });
            
                                        
        });
      this.socket.on('get_starting_point_callback', function(data){
          if(myThis.props.groupID != data.group_id) return;
          myThis.setState({
              start_date: data.hasOwnProperty("start_time")?data.start_time:0,
              start_location: data.hasOwnProperty("start_latlng")?{"latitude":data.start_latlng.lat, "longitude":data.start_latlng.lng}
                                                                :null
          });
      
      });
      this.socket.on("add_arriving_user_callback", function(data){
          if(data.group_id != myThis.props.groupID) return;
          Alert.alert(
            "Thông báo điểm hẹn",
            "Người dùng đang đến: "+data.user_id
          );
      });
      this.socket.on("delete_arriving_user_callback", function(data){
          if(data.group_id != myThis.props.groupID) return;
          Alert.alert(
            "Thông báo điểm hẹn",
            "Người dùng rời khỏi: "+data.user_id
          );
      })
  }
	onMapPress(e) {
	    /*this.setState({
	      markers: [
	        ...this.state.markers,
	        {
	          coordinate: e.nativeEvent.coordinate,
	          key: `Marker${id++}`,
	        },
	      ],
	    });*/
      //test socket
      this.socket.emit('add_marker',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id':this.props.groupID, 'latlng': {'lat': e.nativeEvent.coordinate.latitude, 'lng': e.nativeEvent.coordinate.longitude}}));
        
  }
  replaceLocationById(UserID, LatLng){
    for (var index = 0; index < this.state.members.length; index++) {
      if(this.state.members[index]._id == UserID){
        this.state.members[index].coordinate = LatLng;
        return;
      }
      
    }
  }
    onRegionChange(region) {
      this.setState({
        region: region
      });
    }
    async calculateDistanceAllMembers(){
      if(this.state.start_location === null) return;
      for (var index = 0; index < this.state.members.length; index++) {
        let distance = await apis.distance_googleAPI(this.state.members[index].coordinate, this.state.start_location)
        if(distance.value < 500){
          for (var i = 0; i < this.state.arriving_users.length; i++) {
            if(this.state.arriving_users[i] == this.state.members[index]._id) return;
          }
          this.state.arriving_users.push(this.state.members[index]._id);
          this.socket.emit("add_arriving_user", JSON.stringify({"token":this.props.userInfo.token,
                            "group_id":this.props.groupID,
                            "user_id":this.state.members[index]._id}));
        }
        else{
          for (var i = 0; i < this.state.arriving_users.length; i++) {
            if(this.state.arriving_users[i] == this.state.members[index]._id){
              this.state.members.splice(i, 1);
              this.socket.emit("delete_arriving_user", JSON.stringify({"token":this.props.userInfo.token,
                            "group_id":this.props.groupID,
                            "user_id":this.state.members[index]._id}));
            }
          }
        }
      }
    }
    async startGeolocation() {
      console.log('componentDidMount');
      console.log(navigator);
      if(this.state.watchID!==null) navigator.geolocation.clearWatch(this.state.watchID);
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          
          this.setState({currentRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
            isAllowedGPS: true});
          myThis.socket.emit('update_latlng',  JSON.stringify({'token': this.props.userInfo.token,
                                                                'user_id': this.props.userInfo.user_id,
                                                                'group_id': this.props.groupID,
                                                                'latlng':
                                                                  {'lat': position.coords.latitude,
                                                                  'lng': position.coords.longitude}}));
        
        },
        (error) => {navigator.geolocation.getCurrentPosition(
                    (position) => {
                      console.log(position);
                      this.setState({currentRegion: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      },
                      isAllowedGPS:true});
                      myThis.socket.emit('update_latlng',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID, 'latlng':{'lat': position.coords.latitude, 'lng': position.coords.longitude}}));
                    
                    },
                    (error) => {console.log("fail to get position");
                  this.startGeolocation();},
                    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
                  );},
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.state.watchID = navigator.geolocation.watchPosition((position) => {
        this.setState({currentRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }});
        myThis.socket.emit('update_latlng',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID, 'latlng':{'lat': position.coords.latitude, 'lng': position.coords.longitude}}));
        
      })
    }
    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.state.watchID);
    }
    _decode(t,e){
      for(var n,o,u=0, l=0, r=0, d= [], h=0,i=0,a=null,c=Math.pow(10,e||5); u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}
    async findDirection(){
      if(this.state.start_location === null) return;
      let responseAPI = await apis.findDirection_googleAPI({latitude:this.state.currentRegion.latitude, longitude:this.state.currentRegion.longitude},
                                        this.state.start_location);
                                        console.log(this._decode(responseAPI.routes[0].overview_polyline.points));
      this.setState({
        direction_coordinates:  this._decode(responseAPI.routes[0].overview_polyline.points)
      })
      //console.log("-------------------");
      //console.log(responseAPI.routes[0].legs[0].steps); 
      /*this.setState({
          direction_coordinates:[]
        });
      responseAPI.routes[0].legs[0].steps.map(u=>{
        
        
        this.setState({
          direction_coordinates:[
            ...this.state.direction_coordinates,
            {
              "latitude":u.start_location.lat,
              "longitude":u.start_location.lng
            }
          ]
        });
      });
      this.setState({
          direction_coordinates:[
            ...this.state.direction_coordinates,
            
              this.state.start_location
            
          ]
        });*/
     
    }
	render(){
		return(
			<View style={styles.container}>
		        <MapView
		          provider={this.props.provider}
		          style={styles.map}
		          initialRegion={this.state.currentRegion}
              toolbarEnabled={false}
		          //customMapStyle={customStyle}
		          onPress={this.onMapPress}>
                {this.state.markers.map(marker => (
                  <MapView.Marker
                    title={marker.key}
                    key={marker.key}
                    coordinate={marker.coordinate}
                    pinColor='orange'
                  />
                ))}
                {this.state.members.map(user => {
                  if(user._id != this.props.userInfo.user_id) return(
                    <MapView.Marker
                      title={user._id}
                      key={user.key}
                      coordinate={user.coordinate}
                      image={{uri:"https://furtaev.ru/preview/user_on_map_2_small.png"}}
                    />
                )})}
                {this.state.isAllowedGPS?(
                  <MapView.Marker
                    title='Vị trí của bạn'
                    key={99999}
                    coordinate={this.state.currentRegion}
                    image={{uri:"https://furtaev.ru/preview/user_on_map_2_small.png"}}
                  />
                ):<View/>}
                
                {this.state.start_location!==null?
                  <MapView.Marker
                    title='Điểm hẹn'
                    key={9999}
                    coordinate={this.state.start_location}
                    image={{uri:"http://files.softicons.com/download/web-icons/vista-map-markers-icons-by-icons-land/png/128x128/MapMarker_Flag1_Left_Azure.png"}}
                  />
                  :<View/>}
              <MapView.Polyline
                coordinates={this.state.direction_coordinates}
                strokeWidth={5}
                 />
                
             
		          </MapView>
              <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Tìm đường" onPress={this.findDirection}>
                  <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Tìm địa điểm" onPress={() => {}}>
                  <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="Tìm bạn" onPress={() => {}}>
                  <Icon name="md-done-all" style={styles.actionButtonIcon} />
                </ActionButton.Item>
              </ActionButton>
		    </View>
		);
	}
}
MapPage.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});