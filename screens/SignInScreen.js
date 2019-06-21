import React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import StyleSheets from '../styles/StyleSheets';
import API_Services from '../components/API_Services';
import Header from '../components/Header';

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    let username = this.props.navigation.getParam('username', '');
    let password = this.props.navigation.getParam('password', '');
    if(username == null) {
      username = '';
    }
    if(password == null) {
      password = '';
    }
    this.state = {
      username: username, 
      password: password, 
      error: ''
    };
    if(this.state.username != '' && this.state.password != '') {
      
      this._signInAsync();
    }
  }
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Sign In' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  render() {
    return (
      <View style={[StyleSheets.Main.container, {flex: 1}]}>
        <View style={[StyleSheets.Container.container, {flex: 0.3}]}>
          <View style={[StyleSheets.Container.container, {flex: 0.8}]}>
            <Text style={StyleSheets.HeaderText.mainTitle}>
              Welcome to WattsAppKauai by KIUC!
            </Text>
          </View>
          <View style={[StyleSheets.Container.container, {flex: 0.2}]}>
            <Image
              style={{width:80, height:80}}
              source={require('../assets/images/KIUC_Logo512.png')}
            />
          </View>
          
          
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.4}]}>
          <Text style={StyleSheets.Info.text}>
            KIUC employees login here:
          </Text>
          <TextInput
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            placeholder="Username"
            onChangeText={(newUsername) => this.setState({username: newUsername})}
            onSubmitEditing = {this._signInAsync}
            autoCapitalize = 'none'
            autoCorrect = {false}
            value={this.state.username}
            

          />
          <TextInput
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            placeholder="Password"
            onChangeText={(newPassword) => this.setState({password: newPassword})}
            onSubmitEditing = {this._signInAsync}
            secureTextEntry = {true}
            autoCapitalize = 'none'
            autoCorrect = {false}
            value={this.state.password}
          />
          <Button title="Login" onPress={this._signInAsync} />
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.1}]}>
          <Text style={StyleSheets.Error.text}>
            {this.state.error}
          </Text>
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.2}]}>
          <Text style = {StyleSheets.Info.text}>
            Otherwise, 
            
          </Text>
          <Button title="Continue as KIUC Member" onPress={this._signInGuestAsync} />
        </View>
      </View>
    );
  }

  _signInAsync = async () => {
    this.setLoading(true);
    let {response, responseJSON} = await API_Services.Login(this.state.username, this.state.password);

    this.setLoading(false);
    if(Math.floor(response.status / 100) == 4) {
      let error = "";
      for(item in responseJSON) {
        error+=item + ": " + responseJSON[item] + '\n';
      }
      this.setState({error: error});
    } else if(API_Services.userPasswordChange) {
      this.props.navigation.navigate('ChangePassword', {oldPassword: this.state.password});
      this.setState({password: ""})
    } else {
      await AsyncStorage.setItem('username', this.state.username);
      await AsyncStorage.setItem('password', this.state.password);
      API_Services.employee = true;
      this.props.navigation.navigate(API_Services.userAdministrator ? 'AppAdmin' : 'AppEmployee');
    }
    
  };

  _signInGuestAsync = async () => {
    this.setLoading(true);
    let response = await API_Services.Login(API_Services.guestUsername, API_Services.guestPassword);
    
    this.setLoading(false);
    if(API_Services.accessToken == undefined) {
      this.setState({error: response.description});
    } else {
      API_Services.employee = false;
      API_Services.administrator = false;
      this.props.navigation.navigate('AppGuest');
    }
  };
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });