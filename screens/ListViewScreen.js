import React from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  TouchableHighlight,
  RefreshControl,
  Linking,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import Header from '../components/Header';
import API_Services from '../components/API_Services';
import StyleSheets from '../styles/StyleSheets';
import SubmitButton from '../components/SubmitButton';
import ExitButton from '../components/ExitButton';

export default class ListViewScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let loading;
    if (navigation.state.params == undefined) {
      loading = false;
    } else {
      loading = navigation.state.params.loading;
    }
    return { headerTitle: <Header title='List of Posted Issues' loading={loading} /> }
  }

  

  setLoading(loading) {
    this.props.navigation.setParams({ loading: loading });
  }

  constructor(props) {
    super(props);
    this.state = {
      issues: []
    }
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.forceUpdate();
      }
    );
  }

  async refreshIssueList() {
    this.setLoading(true);
    await API_Services.getAllIssues();
    this.setState();
    this.setLoading(false);
  }

  async componentDidMount() {
    if(!API_Services.issues) {
      await this.refreshIssueList();
    }
    
  }

  changeResolveStatus(item) {
    Alert.alert(
    'Confirm Resolve',
    'Are you sure you want to mark this issue as ' + (item.resolved ? 'unresolved?' : 'resolved?'),
    [
        {text: 'Yes', onPress: (() => this.confirmChangeResolveStatus(item)).bind(this)},
        {text: 'Cancel', onPress: () => {}}
    ],
    { cancelable: true }
    )
  }

  async changeNotes(item) {
    await API_Services.changeNotes(item.pk, item.notes);
  }

  async confirmChangeResolveStatus(item) {
      await API_Services.changeResolveStatus(item.pk, !item.resolved);
      await API_Services.getAllIssues();
      this.setState({triggerModalClose: true});
  }

  listElement(item) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          borderColor: 'white',
          borderRadius: 10,
          margin: 5
        }}
      >

        <Image
          source={{ uri: 'data:image/jpg;base64,'+item.thumbnail }}
          style={{
            flex: 0.3,
            width: 100,
            height: 100,
            resizeMode: 'contain'
          }}
        />
        <View style={{ flex: 0.7, height: 100, padding: 5 }}>
          <Text numberOfLines={5}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  }

  modalElement(item) {
    return (
      <View>
        <Image
          style={{ height: 400 }}
          source={{ uri: 'data:image/jpg;base64,'+item.image }}
        />
        <Text style={StyleSheets.HeaderText.subTitle} selectable={true}>
          Description:
        </Text>
        <Text style={StyleSheets.Info.text} selectable={true}>
          {item.description} {'\n'}
        </Text>
        <Text style={StyleSheets.HeaderText.subTitle} selectable={true}>
          Type: {item.issueType} {'\n'}
        </Text>
        <Text style={StyleSheets.HeaderText.subTitle} selectable={true}>
          Post Creator Contact Info:
        </Text>
        <Text style={StyleSheets.Info.text} selectable={true}> 
          {'   '} Name: {item.posterName} {'\n'}
        </Text>
        <View 
        style={{
          flex: 1, 
          flexDirection: 'row', 
          alignContent: 'center', 
          alignItems: 'center',
          height:40}}
        >
          <Text style={StyleSheets.Info.text}>
            {'   '} Phone Number:
          </Text>
          <Button 
          title={item.posterPhone} 
          onPress={() => {Linking.openURL("tel: " + item.posterPhone)}}
          />
        </View>
        <Text style={StyleSheets.Info.text} selectable={true}>
          {'   '} Email: {item.posterEmail} {'\n'}
        </Text>
        <KeyboardAvoidingView 
        behavior='position' 
        keyboardVerticalOffset={0}
        contentContainerStyle={{
          backgroundColor: 'white'
        }}>
          <Text style={StyleSheets.HeaderText.subTitle}>
            Notes:
          </Text>
          <View style={{ 
          borderColor: 'black',
          borderWidth: 5
          }}>
            <TextInput 
              placeholder={"Notes"}
              onChangeText={(text) => {
                item.notes = text;
                this.forceUpdate();
              }}
              value={item.notes}
              style={{ 
                width: "100%",
                height: 100,
                fontSize: 15,
                padding: 10
              }}
              onBlur={() => this.changeNotes(item)}
              multiline={true}
            />
          </View>
          
        </KeyboardAvoidingView>
        <Text style={StyleSheets.HeaderText.subTitle}>
          {item.resolved ? "Resolved" : "Unresolved"}
        </Text>
        {item.resolved ? 
        <SubmitButton onPress={(() => this.changeResolveStatus(item)).bind(this)} title='Unresolve Issue' /> :
        <SubmitButton onPress={(() => this.changeResolveStatus(item)).bind(this)} title='Resolve Issue' />
        }
      </View>
    );
  }

  render() {
    return (
      <View>
        <ListView
        listElement={this.listElement}
        modalElement={this.modalElement.bind(this)}
        data={API_Services.issues}
        color='rgba(0, 107, 36, '
        triggerModalClose={this.state.triggerModalClose}
        onRefresh={this.refreshIssueList.bind(this)}
        />
      </View>
      
    );
  }
}

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      focusedItem: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.triggerModalClose) {
      this.setState({ modalVisible: false });
    }
  }

  async onItemPress(pk) {
    let response = await API_Services.getOneIssue(pk);
    let pressedItem = await response.json();
    this.state.focusedItem = pressedItem;
    this.setState({ modalVisible: true });
    if(this.props.onItemPress) {
      this.props.onItemPress(pk);
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={StyleSheets.Main.container}>
        <RefreshControl
        onRefresh={async () => {
          this.setState({refreshing: true});
          await this.props.onRefresh();
          this.setState({refreshing: false});
        }}
        refreshing={this.state.refreshing}
        />
        <FlatList
          data={this.props.data}
          renderItem={({ item }) =>
            <ListItem
              element={this.props.listElement}
              onItemPress={this.onItemPress.bind(this)}
              item={item}
              color={this.props.color}
            />}
        />
        {this.props.modalElement ? 
        <MoreInfoModal
          visible={this.state.modalVisible}
          item={this.state.focusedItem}
          element={this.props.modalElement}
          onModalClose={() => {
            this.props.onModalClose;
            this.state.modalVisible = false;
          }}
        /> : <View />}
      </ScrollView>
    );
  }
}

class ListItem extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, borderColor: 'white', borderWidth: 5, borderRadius: 10 }}>
        <View style={{ borderColor: this.props.color + '1.0)', borderWidth: 2, borderRadius: 10 }}>
          <TouchableHighlight
            onPress={() => this.props.onItemPress(this.props.item.pk)}
            underlayColor={this.props.color + '0.2)'}
            style={{
              backgroundColor: this.props.color + '0.1)',
              borderRadius: 10
            }}
          >
            {this.props.element(this.props.item)}
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class MoreInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: this.props.visible,
      item: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.item = nextProps.item;
    this.state.modalVisible = nextProps.visible;

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setModalVisible(false);
    this.props.onModalClose(); 
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.closeModal();
        }}>
        {this.state.item === undefined ? <View /> : <ScrollView>
          <View style={{ marginTop: 22 }}>
            <View style={StyleSheets.Main.container}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View />
                <ExitButton onPress={() => this.closeModal()} />
              </View>
              {this.props.element(this.state.item)}
            </View>
          </View>
        </ScrollView>}
      </Modal>
    );
  }
}