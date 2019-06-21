import React from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  Modal,
  TextInput
} from 'react-native';
import Header from '../components/Header';
import StyleSheets from '../styles/StyleSheets';
import API_Services from '../components/API_Services';
import CloseableModal from '../components/CloseableModal';
import SubmitButton from '../components/SubmitButton'
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Settings' loading={loading}/>}
  }

  async componentDidMount() {
    let showResolvedIssues = await AsyncStorage.getItem('showResolvedIssues') == 'true';
    this.setState({
      name: API_Services.userName,
      phone: API_Services.userPhone,
      email: API_Services.userEmail,
      showResolvedIssues: showResolvedIssues==null ? false : showResolvedIssues,
      newIssueNotifications: API_Services.newIssueNotifications
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      newIssueNotifications: false,
      websiteModalVisible: false,
      privacyPolicyVisible: false,
      myProfileVisible: false,
      newName: '',
      newPhone: '',
      newEmail: '',
      name: '',
      phone: '',
      email: '',
      showResolvedIssues: false
    }
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  openWebsite() {
    this.setState({websiteModalVisible: true});
  }

  openPrivacyPolicy() {
    this.setState({privacyPolicyVisible: true});
  }

  openMyProfile() {
    this.setState({myProfileVisible: true});
  }

  async changeNewIssueNotification(value) {
    this.setState({newIssueNotifications: value});
    await API_Services.changeUserInfo(API_Services.userName, API_Services.userPhone, API_Services.userEmail, null, null, null, value);
  }

  resetNewInfoEntry() {
    this.setState({
      newName: '',
      newPhone: '',
      newEmail: ''
    })
  }

  async submitChanges() {
    let response = await API_Services.changeUserInfo(this.state.newName, this.state.newPhone, this.state.newEmail);
    this.setState({myProfileVisible: false});
    this.resetNewInfoEntry();
    await API_Services.getMyUserInfo();
    await this.componentDidMount();
  }
  
  render() {
    return (
      <View style={[StyleSheets.Main.container, {flex: 1}]}>
        <View style={{flex:0.7}}>
          <View >
            <Text style={StyleSheets.HeaderText.subTitle}>
              Notification Settings:
            </Text>
            <View style={{flexDirection: 'row', alignContent: 'center'}}>
              <Text style={StyleSheets.Info.text}>
                New Issues: {' '}
              </Text>
              <Switch 
                onValueChange={this.changeNewIssueNotification.bind(this)}
                value={this.state.newIssueNotifications}
              />
            </View>
            <Text style={StyleSheets.HeaderText.subTitle}>
              Other Settings:
            </Text>
            <View style={{flexDirection: 'row', alignContent: 'center'}}>
              <Text style={StyleSheets.Info.text}>
                Show resolved issues: {' '}
              </Text>
              <Switch 
                onValueChange={(value) => {
                  this.setState({showResolvedIssues: value});
                  AsyncStorage.setItem('showResolvedIssues', value+'');
                }}
                value={this.state.showResolvedIssues}
              />
            </View>
          </View>
        </View>
        <View style={{flex:0.3}}>
          <Button title="My Profile" onPress={this.openMyProfile.bind(this)} /> 
          <Button title="Visit KIUC's Website" onPress={this.openWebsite.bind(this)} />
          <Button title="View Privacy Policy" onPress={this.openPrivacyPolicy.bind(this)} />
          <Button title="Log Out" onPress={this._signOutAsync} />
        </View>
        <CloseableModal 
          visible={this.state.websiteModalVisible}
          animationType='slide'
          closeModal={() => this.setState({websiteModalVisible: false})}
        >
          <WebView source={{uri: 'http://website.kiuc.coop'}}/>
        </CloseableModal>
        <CloseableModal 
          visible={this.state.privacyPolicyVisible}
          animationType='slide'
          closeModal={() => this.setState({privacyPolicyVisible: false})}
        >
          <WebView source={{uri: 'http://website.kiuc.coop/sites/kiuc/files/documents/WattsAppPrivacyPolicy.pdf'}}/>
        </CloseableModal>
        <CloseableModal 
          visible={this.state.myProfileVisible}
          animationType='slide'
          closeModal={() => this.setState({myProfileVisible: false})}
        >
          <View>
            <Text selectable={true} style={[StyleSheets.HeaderText.subTitle, {textAlign: 'center', fontWeight: '500'}]}>
              My Profile
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={StyleSheets.Info.text}> Name: {' '}</Text>
              <TextInput 
                placeholder={this.state.name} 
                onChangeText={(text) => this.setState({newName: text})} 
                value={this.state.newName}
                style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={StyleSheets.Info.text}> Phone Number: {' '}</Text>
              <TextInput 
                placeholder={this.state.phone} 
                onChangeText={(text) => this.setState({newPhone: text})} 
                value={this.state.newPhone}
                style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={StyleSheets.Info.text}> Email: {' '}</Text>
              <TextInput 
                placeholder={this.state.email} 
                onChangeText={(text) => this.setState({newEmail: text})} 
                value={this.state.newEmail}
                style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
                autoCapitalize='none'
              />
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', height: 100}}>
              <SubmitButton onPress={this.submitChanges.bind(this)} title='Save Changes'/>
            </View>
          </View>
        </CloseableModal>
          
      </View>
    );
  }

  _signOutAsync = async () => {
    const keys = ['username', 'password']
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.log(error);
    }
    
    this.props.navigation.navigate('Auth');
  };
}