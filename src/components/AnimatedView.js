//import liraries
import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, Easing } from 'react-native';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// create a component
var giobalThis;
class FadeView extends Component {
    constructor(props) {
        super(props);
        giobalThis = this;
        this.state = {
            x: null,
            y: null,
            fadeAnim: new Animated.Value(1)
        }
    }
    onPress(evt) {
        const { locationX, locationY } = evt.nativeEvent;
        this.setState({ x: locationX, y: locationY });
        console.log('on press');
        console.log(locationX, locationY);
    }
    onMove(evt) {
        const { pageX, pageY } = evt.nativeEvent;
        const { x, y } = this.state;
        const ratio = (pageX - x)*2 / width;
        this.setState({
            fadeAnim: new Animated.Value(ratio)
        })
        console.log('on move');
        console.log(pageX, pageY);
    }
    onRelease(evt){
        const {locationX, locationY} = evt.nativeEvent;
        console.log('on release');
        console.log(locationX, locationY);
    }
    render() {
        const fadeAnim = this.state.fadeAnim.interpolate({
            inputRange: [-1, 1],
            outputRange: [0, 1]
        })
        return (
            <View
                style={{ height: 200 }}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderMove={this.onMove.bind(this)}
                onResponderGrant={this.onPress.bind(this)}>
                <Animated.View style={{
                    backgroundColor: 'green', opacity: fadeAnim
                }}>
                    <Text>Test animation</Text>
                </Animated.View>
            </View>
        );
    }

    componentDidMount(){
        setInterval(function(){
            giobalThis.setState({fadeAnim: new Animated.Value(1)});
            Animated.timing(                            // Animate value over time
                giobalThis.state.fadeAnim,                      // The value to drive
                {
                  toValue: -1,
                  duration: 3000                             // Animate to final value of 1
                }
            ).start();
            
        }, 3000)
    }
}

export default FadeView;
