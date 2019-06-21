import React from 'react';
import {
  FlatList,
  View,
  ScrollView,
  Modal,
  TouchableHighlight,
  RefreshControl
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import ExitButton from './ExitButton';

export default class ListView extends React.Component {
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

  onItemPress(pk) {
    let pressedItem = this.props.data.find((e) => e.pk == pk);
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