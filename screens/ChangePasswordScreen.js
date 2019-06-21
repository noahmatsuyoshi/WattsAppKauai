import React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import API_Services from '../components/API_Services';
import Header from '../components/Header';

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      newPassword: '',
      newPasswordConfirm: ''
    };
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

  async changePassword() {
    let oldPassword = this.props.navigation.getParam('oldPassword', '');
    let response = await API_Services.changePassword(this.state.newPassword, this.state.newPasswordConfirm, oldPassword);
    let responseJSON = await response.json();
    if(Math.floor(response.status / 100) == 4) {
      let error = "";
      for(item in responseJSON) {
        error+=item + ": " + responseJSON[item] + '\n';
      }
      this.setState({error: error});
    } else {
      await API_Services.changeUserInfo(null, null, null, null, null, false);
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={[StyleSheets.Main.container, {flex: 1}]}>
        <View style={[StyleSheets.Container.container, {flex: 0.3}]}>
          <View style={[StyleSheets.Container.container, {flex: 0.8}]}>
            <Text style={StyleSheets.HeaderText.mainTitle}>
              Please change your password
            </Text>
          </View>
          
          
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.4}]}>
          <TextInput
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            placeholder="New Password"
            onChangeText={(newPassword) => this.setState({newPassword: newPassword})}
            onSubmitEditing = {this.changePassword.bind(this)}
            secureTextEntry = {true}
            autoCapitalize = 'none'
            autoCorrect = {false}
            

          />
          <TextInput
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            placeholder="Confirm new password"
            onChangeText={(newPassword) => this.setState({newPasswordConfirm: newPassword})}
            onSubmitEditing = {this.changePassword.bind(this)}
            secureTextEntry = {true}
            autoCapitalize = 'none'
            autoCorrect = {false}
          />
          <Button title="Change Password" onPress={this.changePassword.bind(this)} />
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.1}]}>
          <Text style={StyleSheets.Error.text}>
            {this.state.error}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });