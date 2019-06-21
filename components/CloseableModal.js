import React from 'react';
import {
  View,
  ScrollView,
  Modal,
  TouchableHighlight
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';
import ExitButton from './ExitButton';

/**
 * Props: bool visible,
 * string animationType,
 * function closeModal
 * 
 */

export default class CloseableModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: this.props.visible
      }
    }
  
    closeModal() {
      this.props.onModalClose(); 
    }
  
    render() {
      return (
        <Modal
          animationType={this.props.animationType}
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {
            this.props.closeModal();
          }}>
          {this.props.children === undefined ? <View /> : <View style={{flex: 1}}>
            <View style={{ marginTop: 22, flex: 1}}>
              <View style={[StyleSheets.Main.container, {flex: 1}]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 0.1}}>
                  <View />
                  <ExitButton onPress={() => this.props.closeModal()} />
                </View>
                <View style={{flex: 0.9}}>
                  {this.props.children}
                </View>
                
              </View>
            </View>
          </View>}
          
        </Modal>
      );
    }
  }