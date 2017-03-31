'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator
} from 'react-native';

import Login from './components/LogInScreen.js'

export default class LocationClient extends Component {
  configureScene(route, routeStack){
    if(route.type === 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight 
  }
  renderScene(route, navigator){
    return <route.component navigator={navigator} {...route.passProps} />;
  }
  render() {
    return (
      <Navigator
          initialRoute={{component: Login}}
          configureScene={this.configureScene}
          renderScene={this.renderScene} />

    );
  }
}

AppRegistry.registerComponent('LocationClient', () => LocationClient);
