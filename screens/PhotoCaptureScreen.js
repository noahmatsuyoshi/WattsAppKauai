import React from 'react';
import {
  Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import Header from '../components/Header';
import LoadingManager from '../components/LoadingManager';
import {RNCamera} from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_Services from '../components/API_Services';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting for Camera</Text>
  </View>
);

export default class PhotoCaptureScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Capture Photo' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }  

  render() {
    return (
      <View style={{flex: 1}}>
        <RNCamera 
          ref={ref => {
            this.camera = ref;
          }}
          style={{flex: 1}} 
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity 
                onPress={() => this.takePicture(camera)} 
                style={{
                  flex: 0,
                  padding: 15,
                  paddingHorizontal: 20,
                  alignSelf: 'flex-end',
                  margin: 20,
                }}>
                  <Ionicons name="ios-camera" size={50} color='white'/>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    this.props.navigation.navigate('IssueDescription', {picture: data.base64});
  };
  
  // Push Notification Registration Stuff
  componentWillMount() {
    /*
    PushNotificationIOS.addEventListener('register', this._onRegistered);
    PushNotificationIOS.addEventListener(
      'registrationError',
      this._onRegistrationError,
    );
    PushNotificationIOS.addEventListener(
      'notification',
      this._onRemoteNotification,
    );
    PushNotificationIOS.addEventListener(
      'localNotification',
      this._onLocalNotification,
    );
    */

    PushNotificationIOS.requestPermissions();
  }
  
  /*
  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this._onRegistered);
    PushNotificationIOS.removeEventListener(
      'registrationError',
      this._onRegistrationError,
    );
    PushNotificationIOS.removeEventListener(
      'notification',
      this._onRemoteNotification,
    );
    PushNotificationIOS.removeEventListener(
      'localNotification',
      this._onLocalNotification,
    );
  }

  async _onRegistered(deviceToken) {
    Alert.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken}`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
    response = await API_Services.registerDeviceForPush(deviceToken);
    console.log(response);
  }

  _onRegistrationError(error) {
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
  }

  _onRemoteNotification(notification) {
    const result = `Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()}.`;

    Alert.alert('Push Notification Received', result, [
      {
        text: 'Dismiss',
        onPress: null,
      },
    ]);
  }

  _onLocalNotification(notification) {
    Alert.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
  }
  */
}