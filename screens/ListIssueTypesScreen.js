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


class ListIssueTypesScreen extends Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Issue Types' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  constructor(props) {
    super(props);
    this.state = {
      types: [],
      triggerModalClose: false,
      newUserModalVisible: false,
      inputListSelector: []
    };
  }

  async componentDidMount() {
    await this.resetList();
  }

  async componentDidUpdate() {
    this.state.triggerModalClose = false;
  }

  listElement(item) {
    return (
      <View style={{margin: 10}}>
        <Text style={StyleSheets.Info.text}> 
          {item.issueType}
        </Text>
      </View>
    );
  }

  deleteIssueType(pk) {
    Alert.alert(
      'Delete Type',
      'Are you sure you want to delete this issue type?',
      [
        {text: 'Yes, delete type', onPress: (() => {this.confirmDelete(pk)}).bind(this)},
        {text: 'Cancel', onPress: () => {}}
      ],
      { cancelable: true }
    )
  }

  async confirmDelete(pk) {
    this.setLoading(true);
    await API_Services.deleteIssueType(pk);
    await this.resetList();
    this.setLoading(false);
  }

  async confirmSubmitNewType() {
    this.setLoading(true);
    await API_Services.createIssueType(this.state.newType);
    await this.resetList();
    this.setLoading(false);
  }

  async resetList() {
    this.setLoading(true);
    let response = await API_Services.getIssueTypes();
    let responseJSON = await response.json();
    types = API_Services.assignKey(responseJSON);
    this.setState({types: types});
    this.setLoading(false);
  }

  render() {
    return (
      <View style={{flex: 0.9}}>
        <View style={{alignItems: 'center', justifyContent: 'center', height: 100, margin: 10}}>
          <View style={{margin: 10}}>
            <View style={{ 
              borderColor: 'black',
              borderWidth: 5
            }}>
              <TextInput 
                placeholder={"Type a new issue type here"}
                onChangeText={(text) => this.setState({newType: text})} 
                value={this.state.newType}
                style={{ 
                        width: 300,
                        height: 50,
                        fontSize: 15,
                        padding: 10
                      }}
              />
            </View>
            
          </View>
          
          <SubmitButton onPress={this.confirmSubmitNewType.bind(this)} title='Create New Type' />
        </View>
        <View style={{flex: 0.9}}>
          <ListView
            listElement={this.listElement}
            data={this.state.types}
            onItemPress={this.deleteIssueType.bind(this)}
            color='rgba(255, 165, 0, '
            onRefresh={this.resetList.bind(this)}
          />
        </View>
        
      </View>
      
    );
  }
}

export default ListIssueTypesScreen;