//import liraries
import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, Easing. Image } from 'react-native';
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
            ratio: new Animated.Value(0)
        }
    }
    render() {
        const ratio = this.state.ratio.interpolate({
            inputRange: [-1, 1],
            outputRange: ['-20deg', '20deg']
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
