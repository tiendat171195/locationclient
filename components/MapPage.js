'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	Dimensions,
	StyleSheet
} from 'react-native';
import MapView from 'react-native-maps';
import flagImg from '../assets/supermarket-marker.png';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// socket
import io from 'socket.io-client/dist/socket.io.js';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 10.74566227;
const LONGITUDE = 106.70406818;
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
        members: [],
        watchID: null,
	    };
	    this.onMapPress = this.onMapPress.bind(this);
      this.startSocket = this.startSocket.bind(this);
      this.getData = this.getData.bind(this);
      this.startGeolocation = this.startGeolocation.bind(this);
      
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
    this.socket.emit('get_markers',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID}));
    this.socket.emit('get_latlngs',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID}));
  }
  startSocket(){
    this.socket = io('http://192.168.83.2:3000/maps', {jsonp:false});

    this.socket.on('add_marker_callback', function(data){
      if(data.hasOwnProperty('success')){
        return;
      }
      myThis.setState({
	      markers: [
	        ...myThis.state.markers,
	        {
	          coordinate: {'latitude':data.lat, 'longitude':data.lng},
	          key: `Marker${id++}`,
	        },
	      ],
	    });
      myThis.forceUpdate();
    });

    this.socket.on('get_markers_callback', function(data){
      if(data.hasOwnProperty('success')){
        return;
      }
      myThis.setState({ markers: [] });
      data.markers.map(marker=>{
        myThis.setState({
	      markers: [
	        ...myThis.state.markers,
	        {
	          coordinate: {'latitude':marker.lat, 'longitude':marker.lng},
	          key: `Marker${id++}`,
	        },
	      ],
	    });
      })
      
      myThis.forceUpdate();
    });
    
    this.socket.on('get_latlngs_callback', function(data){
      //console.log(data);
      if(data.hasOwnProperty('success')){
        return;
      }
      myThis.setState({ members: [] });     
      for (var index = 0; index < data.latlngs.length; index++) {
        myThis.state.members.push({'_id':data.latlngs[index]._id, 'coordinate':{'latitude':data.latlngs[index].latlng.lat, 'longitude':data.latlngs[index].latlng.lng}, 'key':id++});
      }
     myThis.forceUpdate();
    });
    this.socket.on('update_latlng_callback', function(data){
     // console.log('update latlng');
       //console.log(data);
      myThis.replaceLocationById(data.user_id, {'latitude': data.latlng.lat, 'longitude': data.latlng.lng});
      myThis.forceUpdate();
    });

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
    
    startGeolocation() {
      console.log('componentDidMount');
      console.log(navigator);
      navigator.geolocation.clearWatch(this.state.watchID);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.setState({currentRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }});
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
                      }});
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
          console.log('watchPosition');
          console.log({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID, 'latlng':{'lat': position.coords.latitude, 'lng': position.coords.longitude}});
        myThis.socket.emit('update_latlng',  JSON.stringify({'token': this.props.userInfo.token, 'user_id': this.props.userInfo.user_id, 'group_id': this.props.groupID, 'latlng':{'lat': position.coords.latitude, 'lng': position.coords.longitude}}));
        
      })
    }
    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.state.watchID);
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
                  />
                ))}
                {this.state.members.map(user => (
                  <MapView.Marker
                    title={user._id}
                    key={user.key}
                    coordinate={user.coordinate}
                    image={{uri:"https://furtaev.ru/preview/user_on_map_2_small.png"}}
                  >
                  </MapView.Marker>
                ))}
                
              
                
                
             
		          </MapView>
              <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Tìm đường" onPress={()=>{}}>
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