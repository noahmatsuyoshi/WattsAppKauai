import React from 'react';
import {
    ActivityIndicator, 
    View, 
    StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate('SignIn', {username: username, password: password});
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
