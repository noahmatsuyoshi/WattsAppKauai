import React from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    TextInput,
    Dimensions,
    Button,
    Image,
    StyleSheet
} from 'react-native';
import CloseableModal from './CloseableModal';
import API_Services from './API_Services';
import StyleSheets from '../styles/StyleSheets';
import AsyncStorage from '@react-native-community/async-storage';

export default class Header extends React.Component {
    static defaultNavigationOptions = {
        headerStyle: {
            backgroundColor: '#006b24',
        },
        headerTintColor: '#fff'
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            signInResponse: null
        }
        API_Services.setHeaderInstance(this);
    }

    async startSignIn() {
      this.setState({modalVisible: true});
      while(this.state.modalVisible) {
        await API_Services.sleep(2000);
      }
      return this.state.signInResponse;
    }

    closeModal() {
      this.setState({modalVisible: false});
    }

    render() {
        return (
            <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between',
                width: Dimensions.get('window').width - 20
            }}>
                <ActivityIndicator animating={false} />
                <View>
                    <Text style={{textAlign: 'center', fontSize: 18, color: 'white', fontWeight: '500'}}>
                        {this.props.title}
                    </Text>
                </View>
                <View>
                    <ActivityIndicator 
                        animating={this.props.loading == true} 
                    />
                </View>
                <CloseableModal
                    visible={this.state.modalVisible}
                    animationType='slide'
                    closeModal={this.closeModal}
                >
                    <SignInScreen 
                        header={this}
                        ref = {(c) => {this.state.signInScreen = c}}
                    />
                </CloseableModal>
                
                
                
            </View>
        );
    }
}


class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '', 
      password: '', 
      error: '',
      signingIn: false
    };
    
  }

  async componentDidMount() {
    let username = await AsyncStorage.getItem('username');
    let password = await AsyncStorage.getItem('password');
    this.setState({username: username, password: password});
    if(this.state.username != '' && this.state.password != '') {
        this._signInAsync();
    }
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
            

          />
          <TextInput
            style={[StyleSheets.LoginBox.box, StyleSheets.LoginBox.text]}
            placeholder="Password"
            onChangeText={(newPassword) => this.setState({password: newPassword})}
            onSubmitEditing = {this._signInAsync}
            secureTextEntry = {true}
            autoCapitalize = 'none'
            autoCorrect = {false}
          />
          <Button title="Login" onPress={this._signInAsync} />
        </View>
        <View style={[StyleSheets.Container.container, {flex: 0.1}]}>
          <Text style={StyleSheets.Error.text}>
            {this.state.error}
          </Text>
        </View>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('username', this.state.username);
    await AsyncStorage.setItem('password', this.state.password);
    let response = await API_Services.Login(this.state.username, this.state.password);
    if(API_Services.accessToken == undefined) {
      this.setState({error: response.description});
    } else {
      this.props.header.setState({modalVisible: false, signInResponse: response});
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