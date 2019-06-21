import React from 'react';
import {
  Button,
  Picker,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import API_Services from '../components/API_Services';
import Header from '../components/Header';
import SubmitButton from '../components/SubmitButton';


export default class IssueDescriptionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    let loading;
    if(navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return {headerTitle: <Header title='Describe the Issue' loading={loading}/>}
  }

  setLoading(loading) {
    this.props.navigation.setParams({loading: loading});
  }

  state = {
    description: '',
    types: [],
    type: "",
    otherType: '',
    latitude: '',
    longitude: '',
    error: ''
  }

  async componentDidMount() {
    let types = await API_Services.getIssueTypes();
    types = await types.json();
    this.state.type = types[0];
    //types = API_Services.assignKey(types);
    this.setState({types: this.createTypesPickerItems(types)});
    
    
  }

  createTypesPickerItems(typeList) {
    let pickerList = [];
    for(let element of typeList) {
        pickerList.push(
            <Picker.Item label={element.issueType} value={element.issueType} key={element.pk}/>
        )
    }
    return pickerList;
  }

  submit = () => {
    this.setLoading(true);
    navigator.geolocation.getCurrentPosition(this.positionRetrieved.bind(this), this.positionRetrieveError.bind(this));
  }

  positionRetrieved = async (response) => {
    const type = this.state.type == 'Other' ? this.state.otherType : this.state.type;
    const description = this.state.description;
    await API_Services.postIssue(description, type, Math.round(response.coords.latitude*10000)/10000, Math.round(response.coords.longitude*10000)/10000, this.props.navigation.getParam("picture"), API_Services.userName, API_Services.userPhone, API_Services.userEmail);
    this.setLoading(false);
    this.props.navigation.navigate({routeName: 'PhotoCapture'});
  }

  positionRetrieveError = (error) => {
    this.setState({error: error});
  }

    render() {
      return (
        <ScrollView contentContainerStyle={[StyleSheets.Container.downward, StyleSheets.Main.container]}>
          <Text style={StyleSheets.Info.text}>
            Decription of the issue:
          </Text>
          <TextInput
            placeholder='Type a description of the issue here'
            onChangeText={(description) => this.setState({description: description})}
            value={this.state.description}
            multiline={true}
            blurOnSubmit={true}
          />
          <View style={{height: 20}} />
          <Text style={StyleSheets.Info.text}>
            Choose what type of issue this is:
          </Text>
          <Picker
            selectedValue={this.state.type}
            onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
            {this.state.types}
          </Picker>
          {this.state.type == 'Other' ? 
            <TextInput 
              placeholder='Type "Other" issue type' 
              onChangeText={(text) => this.setState({otherType: text})}
              style={StyleSheets.Info.text}
            /> : 
            <View />
          }
          <Text style={StyleSheets.Error.text}>
            {this.state.error}
          </Text>
          <View style={{alignItems: 'center'}}>
            <SubmitButton onPress={this.submit} title='Post Issue'/>
          </View>
          

        </ScrollView>
      );
    }
      
  }