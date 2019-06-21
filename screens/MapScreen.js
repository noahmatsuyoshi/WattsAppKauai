import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Button,
  TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
import Header from '../components/Header';
import API_Services from '../components/API_Services';
import IssueMoreInfoModal from '../components/IssueMoreInfoModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

export default class MapScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Map View' loading={loading}/>}
  }

  constructor(props) {
    super(props);
    this.state = {
      dimensions: Dimensions.get('screen'),
      modalVisible: false,
      focusedItem: null
    }
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.forceUpdate();
      }
    );
  }

  async componentDidMount() {
    if(!API_Services.issues) {
      await this.refreshIssueList();
    }
    
  }

  async refreshIssueList() {
    this.setLoading(true);
    await API_Services.getAllIssues();
    this.setState();
    this.setLoading(false);
  }
  
  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  openModal(pk) {
    this.setState({focusedItem: API_Services.issues.filter((item) => item.pk==pk)[0], modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false})
  }

  render() {
    return (
      <View style={styles.container}>
        {API_Services.issues ? 
        <View>
          <MapView 
            initialRegion={{
              latitude: 22.09643,
              longitude: -159.52612,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
            style={{height: this.state.dimensions.height, width: this.state.dimensions.width}}
          >
            {API_Services.issues.map(marker => {
              marker.latlng = {
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude)
              }
              return (<MapView.Marker
                coordinate={marker.latlng}
                key={marker.key}
              >
                <MapView.Callout onPress={() => this.openModal(marker.key)}>
                  <View style={{height:250, width:150}}>
                    <Text style={{fontSize:18, margin: 3}}>
                      Type: {marker.issueType}
                    </Text>
                    <Image 
                      style={{flex:1}}
                      source={{ uri: 'data:image/jpg;base64,'+marker.thumbnail }}
                    />
                  </View>
                </MapView.Callout>
              </MapView.Marker>)
              })}
          </MapView> 
          <TouchableOpacity
            onPress={this.refreshIssueList.bind(this)}
            style={{
              position: 'absolute', 
              top: 80, 
              left: 10,
              width: 50,
              height: 50,
              backgroundColor: 'white',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            color='black'
            
          >
            <Ionicons name='ios-refresh' size={40} color='#006b24' />
          </TouchableOpacity>
          
        </View> : <View />}

        {this.state.modalVisible ? 
          <IssueMoreInfoModal 
          modalVisible={this.state.modalVisible}
          closeModal={this.closeModal.bind(this)}
          focusedItem={this.state.focusedItem}
          /> : <View />}
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