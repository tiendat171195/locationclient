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
    ActivityIndicator,
    KeyboardAvoidingView,
    DatePickerAndroid,
    TouchableOpacity,
    Picker
} from 'react-native';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { register } from '../actions';
import {
    MAIN_COLOR,
    CONTENT_COLOR,
    MAIN_TEXT_COLOR,
    CONTENT_TEXT_COLOR,
    PLACEHOLDER_TEXT_COLOR,
    MAIN_FONT
} from './type.js';
import {
    DIENTHOAI_IMG,
    DIACHI_IMG,
    CHATROOM_IMG,
    EMAIL_IMG,
    GIOITINH_IMG,
    NGAYSINH_IMG,
    TENDANGNHAP_IMG,
    MATKHAU_IMG,
} from './images.js';
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
            gender: 'Nam',
            birthday: null,
            city: '',
            birthday_text: ''
        }
        this.checkUserInput = this.checkUserInput.bind(this);
    }
    async showDatePicker() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                mode: 'spinner',
                date: this.state.birthday == null ? new Date(Date()) : new Date(this.state.birthday)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                console.log(year, month, day);
                console.log(new Date(year, month, day).getTime());
                this.setState({ birthday: new Date(year, month, day).getTime() });
                this.convertBirthday();
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    convertBirthday() {
        let birthday = new Date(this.state.birthday);
        this.state.birthday_text = '';
        let tempText = '';
        tempText =
            + birthday.getDate()
            + '/'
            + (1+birthday.getMonth())
            + '/'
            + (1900 + birthday.getYear());
        this.setState({
            birthday_text: tempText
        })
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
        else if (this.state.birthday === null) {
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
            console.log('Dang ky ',this.state.username,
            this.state.password,
            this.state.phone,
            this.state.email,
            this.state.gender,
            this.state.birthday,
            this.state.city);
            this.props.register(this.state.username,
                this.state.password,
                this.state.phone,
                this.state.email,
                this.state.gender,
                this.state.birthday,
                this.state.city);

        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.registerResponse.registered) {
            Alert.alert(
                'Đăng ký thành công',
                'Chúc mừng bạn đã đăng ký thành công'
            )
            Actions.pop();
        }
    }
    render() {
        return (
            <KeyboardAvoidingView>
                {
                    this.props.registerResponse.isRegistering &&
                    <View style={{ width: width, height: height, ...StyleSheet.absoluteFillObject }}>
                        <ActivityIndicator size='large' />
                    </View>
                }

                <ScrollView style={{ backgroundColor: MAIN_COLOR }}>

                    <View style={{ alignItems: 'center', margin: 20 }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                            <Text style={{ fontFamily: 'sans-serif', fontSize: 35, fontWeight: 'bold', color: 'white' }}>Đăng ký</Text>
                        </View>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={TENDANGNHAP_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(userName) => this.setState({ username: userName })}
                                value={this.state.username}
                                placeholder="Tên đăng nhập"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                underlineColorAndroid="transparent" />
                        </View>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={MATKHAU_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(password) => this.setState({ password: password })}
                                value={this.state.password}
                                placeholder="Mật khẩu"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                secureTextEntry={true}
                                underlineColorAndroid="transparent" />
                        </View>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={MATKHAU_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(repassword) => this.setState({ repassword: repassword })}
                                value={this.state.repassword}
                                placeholder="Xác nhận mật khẩu"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                secureTextEntry={true}
                                underlineColorAndroid="transparent" />
                        </View>


                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={DIENTHOAI_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(phone) => this.setState({ phone: phone })}
                                value={this.state.phone}
                                placeholder="Số điện thoại"
                                keyboardType="phone-pad"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                underlineColorAndroid="transparent" />
                        </View>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={EMAIL_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(email) => this.setState({ email: email })}
                                value={this.state.email}
                                keyboardType='email-address'
                                placeholder="E-mail"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                underlineColorAndroid="transparent" />
                        </View>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={GIOITINH_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <Picker
                                mode="dropdown"
                                style={{flex:1, alignSelf:'flex-start'}}
                                selectedValue={this.state.gender}
                                onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
                                <Picker.Item label="Nam" value="Nam" />
                                <Picker.Item label="Nữ" value="Nữ" />
                            </Picker>
                            
                        </View>

                        <TouchableOpacity onPress={this.showDatePicker.bind(this)}
                            style={{
                                width: width / 1.3,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                marginBottom: 1
                            }}
                            activeOpacity={1}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={NGAYSINH_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                editable={false}
                                value={this.state.birthday_text}
                                placeholder="Ngày sinh"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                underlineColorAndroid="transparent" />
                        </TouchableOpacity>

                        <View style={{
                            width: width / 1.3,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginBottom: 1
                        }}>
                            <View style={{
                                flex: 1,
                                opacity: 1,
                                backgroundColor: 'white',
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 15,
                                ...StyleSheet.absoluteFillObject
                            }} />

                            <Image
                                source={DIACHI_IMG}
                                resizeMode='contain'
                                style={{ height: 30, width: 30, alignSelf: 'center', margin: 5 }} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: 25,
                                    color: MAIN_TEXT_COLOR,
                                    fontFamily: MAIN_FONT,
                                    fontWeight: 'bold',
                                    marginTop: 6
                                }}
                                onChangeText={(city) => this.setState({ city: city })}
                                value={this.state.city}
                                placeholder="Địa chỉ"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                underlineColorAndroid="transparent" />
                        </View>



                    </View>
                    <View
                        style={{ alignItems: 'center', marginBottom: 50 }}>
                        <Button
                            onPress={this.SignUp.bind(this)}
                            title="Tạo tài khoản mới"
                            color="#841584" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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