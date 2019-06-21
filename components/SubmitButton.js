import React, { Component } from 'react';
import { 
    View, 
    Text,
    TouchableHighlight
} from 'react-native';
import StyleSheets from '../styles/StyleSheets';

class SubmitButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableHighlight 
        underlayColor='#004a19' 
        onPress={this.props.onPress} 
        style={{
          height: 40, 
          width: 200,
          borderRadius: 12,
          backgroundColor: '#006b24',
          justifyContent: 'center',
        }}
      >
          <Text style={[StyleSheets.Info.text, {textAlign: 'center', color: 'white', fontWeight: '500'}]}>
              {this.props.title}
          </Text>
        
      </TouchableHighlight>
    );
  }
}

export default SubmitButton;
