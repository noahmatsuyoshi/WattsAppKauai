import React from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-community/async-storage';

export default class AdminScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Administration' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }
  
    render() {
      return (
        <View style={styles.container}>
          <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  
    _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    };
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });