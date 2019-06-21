import React from 'react';
import {
  Alert,
  Text,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Image
} from 'react-native';
import MapView from 'react-native-maps';
import Header from '../components/Header';
import API_Services from '../components/API_Services';
import StyleSheets from '../styles/StyleSheets';
import CloseableModal from '../components/CloseableModal';
import SubmitButton from '../components/SubmitButton';

export default class MapScreen extends React.Component {

    changeResolveStatus() {
        Alert.alert(
        'Confirm Resolve',
        'Are you sure you want to mark this issue as ' + (this.props.focusedItem.resolved ? 'unresolved?' : 'resolved?'),
        [
            {text: 'Yes', onPress: this.confirmChangeResolveStatus.bind(this)},
            {text: 'Cancel', onPress: () => {}}
        ],
        { cancelable: true }
        )
    }

    async confirmChangeResolveStatus() {
        await API_Services.changeResolveStatus(this.props.focusedItem.pk, !this.props.focusedItem.resolved);
        await API_Services.getAllIssues();
        this.props.closeModal();
    }

    render() {
        return (
            <CloseableModal 
            visible={this.props.modalVisible}
            closeModal={this.props.closeModal.bind(this)}
            animationType="slide"
            >
                <ScrollView>
                    <Image
                    style={{ height: 400 }}
                    source={{ uri: 'data:image/jpg;base64,'+this.props.focusedItem.image }}
                    />
                    <Text style={StyleSheets.HeaderText.subTitle}>
                    Description:
                    </Text>
                    <Text style={StyleSheets.Info.text}>
                    {this.props.focusedItem.description} {'\n'}
                    </Text>
                    <Text style={StyleSheets.HeaderText.subTitle}>
                    Type: {this.props.focusedItem.issueType} {'\n'}
                    </Text>
                    <Text style={StyleSheets.HeaderText.subTitle}>
                    Post Creator Contact Info:
                    </Text>
                    <Text style={StyleSheets.Info.text}>
                    {'   '} Name: {this.props.focusedItem.posterName} {'\n'}
                    {'   '} Phone Number: {this.props.focusedItem.posterPhone} {'\n'}
                    {'   '} Email: {this.props.focusedItem.posterEmail} {'\n'}
                    </Text>
                    <Text style={StyleSheets.HeaderText.subTitle}>
                    {this.props.focusedItem.resolved ? "Resolved" : "Unresolved"}
                    </Text>
                    {this.props.focusedItem.resolved ? 
                    <SubmitButton onPress={this.changeResolveStatus.bind(this)} title='Unresolve Issue' /> :
                    <SubmitButton onPress={this.changeResolveStatus.bind(this)} title='Resolve Issue' />
                    }
                    
                </ScrollView>
            
            </CloseableModal>
        )
    }
}