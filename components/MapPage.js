'use strict';
import React, { Component } from 'react';
import {
	Text,
	View
} from 'react-native';
import MapView from 'react-native-maps';
export default class MapPage extends Component {
	render(){
		return(
			<MapView style={{flex:1}}>
				<View style={{height:100, backgroundColor:'red'}} />
			</MapView>
		);
	}
}