import React, { Component } from 'react';
import { 
  Alert,
  View, 
  Text,
  TextInput,
  Switch,
  Modal,
  ScrollView
} from 'react-native';
import Header from '../components/Header';
import API_Services from '../components/API_Services';
import StyleSheets from '../styles/StyleSheets';
import ListView from '../components/ListView';
import SubmitButton from '../components/SubmitButton';
import DeleteButton from '../components/DeleteButton';
import ExitButton from '../components/ExitButton';


class ViewUsersScreen extends Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Users' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      oldUser: {},
      newName: '',
      newPhone: '',
      newEmail: '',
      newAdministrator: undefined,
      newPasswordChange: undefined,
      triggerModalClose: false,
      newUserModalVisible: false,
      inputListSelector: [],
      defaultEmail: true
    };
  }

  async componentDidMount() {
    this.setLoading(true);
    let response = await API_Services.getAllUsers();
    let responseJSON = await response.json();
    users = API_Services.assignKey(responseJSON);
    this.setState({users: users});
    this.setLoading(false);
  }

  async componentDidUpdate() {
    this.state.triggerModalClose = false;
  }

  listElement(item) {
    return (
      <View style={{margin: 10}}>
        <Text style={StyleSheets.Info.text}> 
          Name: {item.name} {'\n'}
          Phone Number: {item.phone} {'\n'}
          Email: {item.email} {'\n'}
          Administrator: {item.admin + ''} {'\n'}
          Password Change: {item.passwordChange + ''}
        </Text>
      </View>
    );
  }

  modalElement(item) {
    this.state.oldUser = item;
    return (
      <View>
        <Text style={[StyleSheets.HeaderText.subTitle, {textAlign: 'center', fontWeight: '500'}]}>
          Edit User
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={StyleSheets.Info.text}> Name: {' '}</Text>
          <TextInput 
            placeholder={item.name} 
            onChangeText={(text) => this.setState({newName: text})} 
            value={this.state.newName}
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={StyleSheets.Info.text}> Phone Number: {' '}</Text>
          <TextInput 
            placeholder={item.phone} 
            onChangeText={(text) => this.setState({newPhone: text})} 
            value={this.state.newPhone}
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={StyleSheets.Info.text}> Email: {' '}</Text>
          <TextInput 
            placeholder={item.email} 
            onChangeText={(text) => this.setState({newEmail: text})} 
            value={this.state.newEmail}
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            autoCapitalize='none'
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={StyleSheets.Info.text}> Administrator: {' '}</Text> 
          <Switch 
            onValueChange={(value) => this.setState({newAdministrator: value})} 
            value={
              this.state.newAdministrator != undefined ? 
              this.state.newAdministrator : 
              item.admin
            } 
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={StyleSheets.Info.text}> Password Change: {' '}</Text> 
          <Switch 
            onValueChange={(value) => this.setState({newPasswordChange: value})} 
            value={
              this.state.newPasswordChange != undefined ? 
              this.state.newPasswordChange : 
              item.passwordChange
            } 
          />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', height: 100}}>
          <SubmitButton onPress={this.submitChanges.bind(this)} title='Change User Info'/>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <DeleteButton onPress={this.deleteUser.bind(this)} title='Delete User'/>
        </View>
      </View>
    )
  }

  submitChanges() {
    Alert.alert(
      'Confirm Changes',
      'Are you sure you want to change this user\'s info?',
      [
        {text: 'Yes, submit changes', onPress: this.confirmChanges.bind(this)},
        {text: 'Cancel', onPress: () => {}}
      ],
      { cancelable: true }
    )
  }

  async confirmChanges() {
    this.setLoading(true);
    let data = {};
    if(this.state.newName != '') {
      data.name = this.state.newName;
    }
    if(this.state.newPhone != '') {
      data.phone = this.state.newPhone;
    }
    if(this.state.newEmail != '') {
      data.email = this.state.newEmail;
    }
    if(this.state.newAdministrator != undefined) {
      data.administrator = this.state.newAdministrator;
    }
    if(this.state.newPasswordChange != undefined) {
      data.passwordChange = this.state.newPasswordChange;
    }
    await API_Services.changeUserInfo(data.name, data.phone, data.email, this.state.oldUser.pk, data.administrator, data.passwordChange);
    this.triggerModalClose();
    await this.resetList();
    this.setLoading(false);
  }

  deleteUser() {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {text: 'Yes, delete user', onPress: this.confirmDelete.bind(this)},
        {text: 'Cancel', onPress: () => {}}
      ],
      { cancelable: true }
    )
  }

  async confirmDelete() {
    this.setLoading(true);
    await API_Services.deleteUser(this.state.oldUser.pk);
    this.triggerModalClose();
    await this.resetList();
    this.setLoading(false);
  }

  submitNewUser() {
    Alert.alert(
      'Confirm Create New User',
      'Are you sure you want to create this user?',
      [
        {text: 'Yes, create user', onPress: this.confirmSubmitNewUser.bind(this)},
        {text: 'Cancel', onPress: () => {}}
      ],
      { cancelable: true }
    )
  }

  async confirmSubmitNewUser() {
    this.setLoading(true);
    let data = {};
    data.email = this.state.newEmail;
    data.admin = this.state.newAdministrator != null ? this.state.newAdministrator : false;
    data.password1 = 'kiuc1234';
    data.password2 = 'kiuc1234';
    await API_Services.createUser(data);
    this.triggerModalClose();
    await this.resetList();
    this.setLoading(false);
  }

  createUser() {
    this.setState({newUserModalVisible: true, defaultEmail: true});
  }

  closeNewUserModal() {
    this.resetState();
    this.setState({newUserModalVisible: false});
  }

  createNewUserModal() {
    return <Modal
      animationType='fade'
      transparent={false}
      visible={this.state.newUserModalVisible}
      onRequestClose={() => {
        this.closeModal();
      }}
    > 
      <ScrollView>
        <View style={{ marginTop: 22 }}>
          <View style={StyleSheets.Main.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View />
              <ExitButton onPress={() => this.closeNewUserModal()} />
            </View>
            <View>
              <Text style={[StyleSheets.HeaderText.subTitle, {textAlign: 'center', fontWeight: '500'}]}>
                Create New User
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={StyleSheets.Info.text}> Email: {' '}</Text>
                <TextInput 
                  placeholder='Email' 
                  onChangeText={(text) => this.setState({newEmail: text})} 
                  value={this.state.newEmail}
                  style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
                  returnKeyType='next'
                  autoCapitalize='none'
                  ref={(input) => {this.state.inputListSelector[3] = input}}
                  onFocus={() => this.setState({defaultEmail: false})}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={StyleSheets.Info.text}> Administrator: {' '}</Text> 
                <Switch 
                  onValueChange={(value) => this.setState({newAdministrator: value})} 
                  value={ this.state.newAdministrator } 
                />
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center', height: 100}}>
                <SubmitButton onPress={this.submitNewUser.bind(this)} title='Submit New User'/>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  }

  resetState() {
    this.setState({
      newName: '',
      newPhone: '',
      newEmail: '',
      newAdministrator: undefined,
      newPasswordChange: undefined
    });
    
  }
  async resetList() {
    this.resetState();
    let response = await API_Services.getAllUsers();
    let responseJSON = await response.json();
    users = API_Services.assignKey(responseJSON);
    this.setState({users: users});
    return users;
  }

  triggerModalClose() {
    this.setState({triggerModalClose: true});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.9}}>
          <ListView
            triggerModalClose={this.state.triggerModalClose}
            onModalClose={this.resetState.bind(this)}
            listElement={this.listElement}
            modalElement={this.modalElement.bind(this)}
            data={this.state.users}
            color='rgba(255, 165, 0, '
            onRefresh={this.resetList.bind(this)}
          />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 0.1}}>
          <SubmitButton onPress={this.createUser.bind(this)} title='Create New User' />
        </View>
        {this.createNewUserModal()}
      </View>
      
    );
  }
}

export default ViewUsersScreen;