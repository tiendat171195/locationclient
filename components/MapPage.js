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



export default class MapPage extends Component {
	constructor(props){
		super(props);

		this.state = {
	      region: {
	        latitude: LATITUDE,
	        longitude: LONGITUDE,
	        latitudeDelta: LATITUDE_DELTA,
	        longitudeDelta: LONGITUDE_DELTA,
	      },
	      markers: [],
	    };
	    this.onMapPress = this.onMapPress.bind(this);
	}
	onMapPress(e) {
	    this.setState({
	      markers: [
	        ...this.state.markers,
	        {
	          coordinate: e.nativeEvent.coordinate,
	          key: `Marker${id++}`,
	        },
	      ],
	    });
	  }


	render(){
		return(
			<View style={styles.container}>
		        <MapView
		          provider={this.props.provider}
		          style={styles.map}
		          initialRegion={{
		            latitude: LATITUDE,
		            longitude: LONGITUDE,
		            latitudeDelta: LATITUDE_DELTA,
		            longitudeDelta: LONGITUDE_DELTA,
		          }}
		          customMapStyle={customStyle}
		          onPress={this.onMapPress}>
                {this.state.markers.map(marker => (
                  <MapView.Marker
                    title={marker.key}
                    key={marker.key}
                    coordinate={marker.coordinate}
                  />
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