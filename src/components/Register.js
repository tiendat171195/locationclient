'use strict';
import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    StyleSheet,
    Image,
    TextInput,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { register } from '../actions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            repassword: '',
            phone: null,
            email: '',
            gender: '',
            birthday: null,
            city: '',
        }
        this.checkUserInput = this.checkUserInput.bind(this);
    }
    checkUserInput() {
        if (this.state.username.length < 6) {
            return { status: 'error', message: 'Tên đăng nhập phải trên 6 ký tự' };
        }
         else if (this.state.password.length < 6) {
            return { status: 'error', message: 'Mật khẩu phải trên 6 ký tự' };
        }
         else if (this.state.password !== this.state.repassword) {
            return { status: 'error', message: 'Mật khẩu xác nhận không khớp' };
        }
        else if (this.state.phone === null) {
            return { status: 'error', message: 'Số điện thoại không được trống' };
        }
        else if (this.state.email === '') {
            return { status: 'error', message: 'Email không được trống' };
        }
        else if (this.state.birthday === '') {
            return { status: 'error', message: 'Ngày sinh không được trống' };
        }
        else if (this.state.gender === '') {
            return { status: 'error', message: 'Giới tính không được trống' };
        }
        else if (this.state.city === '') {
            return { status: 'error', message: 'Địa chỉ không được trống' };
        }  
        return { status: 'success' };
    }
    async SignUp() {
        var checkInfo = this.checkUserInput();
        if (checkInfo.status == 'error') {
            Alert.alert(
                'Lỗi đăng ký',
                checkInfo.message
            );
        } else {
             this.props.register(this.state.username,
                this.state.password,
                this.state.phone,
                this.state.email,
                this.state.gender,
                this.state.birthday,
                this.state.city); 
                   
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.registerResponse.registered){
            Alert.alert(
                'Đăng ký thành công',
                'Chúc mừng bạn đã đăng ký thành công'
            )
            Actions.pop();
        }
    }
    render() {
        return (
            <View>
                <Image
                    source={require('../assets/screen.jpg')}
                    resizeMode='cover'
                    style={{ width: width, height: height }}
                >
                    {
                        this.props.registerResponse.isRegistering &&
                        <View style={{ width: width, height: height, ...StyleSheet.absoluteFillObject }}>
                            <ActivityIndicator size='large' />
                        </View>
                    }

                    <ScrollView>

                        <View style={{ alignItems: 'center', margin: 20 }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                                <Text style={{ fontFamily: 'sans-serif', fontSize: 35, fontWeight: 'bold', color: 'white' }}>Đăng ký</Text>
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, borderTopRightRadius: 15, borderTopLeftRadius: 15, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/tendangnhap.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(userName) => this.setState({ username: userName })}
                                    value={this.state.username}
                                    placeholder="Tên đăng nhập"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(password) => this.setState({ password: password })}
                                    value={this.state.password}
                                    placeholder="Mật khẩu"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(repassword) => this.setState({ repassword: repassword })}
                                    value={this.state.repassword}
                                    placeholder="Xác nhận mật khẩu"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(phone) => this.setState({ phone: phone })}
                                    value={this.state.phone}
                                    placeholder="Số điện thoại"
                                    keyboardType="phone-pad"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(email) => this.setState({ email: email })}
                                    value={this.state.email}
                                    keyboardType='email-address'
                                    placeholder="E-mail"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(gender) => this.setState({ gender: gender })}
                                    value={this.state.gender}
                                    placeholder="Giới tính"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(birthday) => this.setState({ birthday: birthday })}
                                    value={this.state.birthday}
                                    placeholder="Ngày sinh"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>
                            <View style={{ paddingHorizontal: 5, height: 50, minWidth: width - 100, flexDirection: 'row', alignSelf: 'center', }}>
                                <View style={{ flex: 1, opacity: 0.55, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, backgroundColor: 'darkslategrey', ...StyleSheet.absoluteFillObject }} />

                                <Image
                                    source={require('../assets/image/matkhau.png')}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 25,
                                        color: "black",
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                    }}
                                    onChangeText={(city) => this.setState({ city: city })}
                                    value={this.state.city}
                                    placeholder="Địa chỉ"
                                    placeholderTextColor="white"
                                    underlineColorAndroid='white' />
                            </View>


                        </View>
                        <View
                            style={{ marginBottom: 40, borderRadius: 15, width: width - 100, alignSelf: 'center' }}>
                            <Button

                                onPress={this.SignUp.bind(this)}
                                title="Tạo tài khoản mới"
                                color="#841584" />
                        </View>
                    </ScrollView>
                </Image>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        registerResponse: state.registerResponse
    }
}

function mapDispatchToProps(dispatch) {
    return {
        register: (username, password, phone, email, gender, birthday, city) => dispatch(register(username, password, phone, email, gender, birthday, city))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);