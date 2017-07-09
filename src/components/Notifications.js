'use strict';
import React, { Component } from 'react';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	Alert,
	ToolbarAndroid,
	RefreshControl,
	Image
} from 'react-native';
import { Actions } from "react-native-router-flux";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ListItem } from 'react-native-elements';

import apis from '../apis/api.js';

import { connect } from 'react-redux';
import { getNotifications } from '../actions';
import {
	HEIGHT_UNIT
} from './type.js';
import {
	DEFAULT_AVATAR,
	CHATBOX,
} from './images.js';
class Notifications extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false
		}
	}
	componentWillMount() {
		this.props.getNotifications();

	}
	
	_onRefresh() {
		this.setState({ isRefreshing: true });
		setTimeout(() => {
			
			this.props.getNotifications();
			this.setState({ isRefreshing: false });
		}, 2000);

	}
	render() {
		return (
				<ScrollView style={{ flex: 1, backgroundColor: 'white' }}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						tintColor="#ff0000"
						title="Loading..."
						titleColor="#00ff00"
						colors={['#ff0000', '#00ff00', '#0000ff']}
						progressBackgroundColor="#ffff00"
					/>}>
					<Card containerStyle={{ margin: 0, padding: 0 }} >
						{
							this.props.getNotificationsResponse.data.notifications != undefined && this.props.getNotificationsResponse.data.notifications.map((noti, i) => {
								
								return (
									<ListItem
										key={i}
										roundAvatar
										hideChevron={true}
										title={<Text style={{fontSize: 14, textAlignVertical:'center'}}
															numberOfLines={3}>
															{noti.content}
												</Text>}
										avatar={{ uri: noti.user.avatar_url }}
										onPress={() => console.log('Notification Clicked')} />
								)
							})
						}
					</Card>
				</ScrollView>
		);
	}


}


function mapStateToProps(state) {
	return {
		getNotificationsResponse: state.getNotificationsResponse
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getNotifications: () => dispatch(getNotifications())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications);