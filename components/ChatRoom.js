'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Input,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


export default class ChatRoom extends Component{
	constructor(props) {
	    super(props);
	    this.state = {messages: []};
	    this.onSend = this.onSend.bind(this);
  	}	
	omponentWillMount() {
	    this.setState({
	      messages: [
	        {
	          _id: 1,
	          text: 'Hello developer',
	          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
	          user: {
	            _id: 2,
	            name: 'React Native',
	            avatar: 'https://facebook.github.io/react/img/logo_og.png',
	          },
	        },
	      ],
	    });
	  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
