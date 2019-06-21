import React, { Component } from 'react';
import { 
    View, 
    Text,
    TouchableHighlight
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class ExitButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onPress() {
    this.props.onPress();
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress.bind(this)} underlayColor='yellow'>
        <View style={{height: 35, width: 35, alignItems: 'center', justifyContent: 'center'}}>
            <Ionicons name='ios-exit' size={30} color='red' />
        </View>
      </TouchableHighlight>
    );
  }
}

export default ExitButton;
