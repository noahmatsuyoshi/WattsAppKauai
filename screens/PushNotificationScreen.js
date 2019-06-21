import React, { Component } from 'react';
import { View, Text, TextInput, Switch, Alert } from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import SubmitButton from '../components/SubmitButton';
import API_Services from '../components/API_Services';

class PushNotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      members: false,
      employees: false,
      admins: false
    };
  }

  sendNotification() {
    Alert.alert(
      'Confirm Changes',
      'Are you sure you want to send this notification?',
      [
        {text: 'Yes, send to users', onPress: this.confirmSendNotification.bind(this)},
        {text: 'Cancel', onPress: () => {}}
      ],
      { cancelable: true }
    )
  }

  confirmSendNotification() {
    API_Services.sendPushNotification(
      message=this.state.message, 
      admins=this.state.admins,
      employees=this.state.employees,
      members=this.state.members
    
    )
  }

  render() {
    return (
      <View style={{flex: 0.9}}>
        <View style={{alignItems: 'center', justifyContent: 'center', margin: 10}}>
          <View style={[StyleSheets.Input.box, {marginTop: 40}]}>
            <TextInput 
              placeholder="Message"
              onChangeText={(text) => this.setState({message: text})} 
              value={this.state.message}
              style={StyleSheets.Input.text}
            />
          </View>         
          <View style={{flexDirection: 'row', alignContent: 'center', margin: 10}}>
            <Text style={StyleSheets.Info.text}>
              Send to Members: {' '}
            </Text>
            <Switch 
              onValueChange={(value) => {
                this.setState({members: value})
              }}
              value={this.state.members}
            />
          </View>
          <View style={{flexDirection: 'row', alignContent: 'center', margin: 10}}>
            <Text style={StyleSheets.Info.text}>
              Send to Employees: {' '}
            </Text>
            <Switch 
              onValueChange={(value) => {
                this.setState({employees: value})
              }}
              value={this.state.employees}
            />
          </View>
          <View style={{flexDirection: 'row', alignContent: 'center', margin: 10}}>
            <Text style={StyleSheets.Info.text}>
              Send to Admins: {' '}
            </Text>
            <Switch 
              onValueChange={(value) => {
                this.setState({admins: value})
              }}
              value={this.state.admins}
            />
          </View>
          <SubmitButton onPress={this.sendNotification.bind(this)} title='Send Notification' />
        </View>
        
      </View>
    );
  }
}

export default PushNotificationScreen;
