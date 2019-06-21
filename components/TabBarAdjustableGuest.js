import React from 'react';
import SettingsScreen from '../screens/SettingsScreen';
import PhotoCaptureScreen from '../screens/PhotoCaptureScreen';
import IssueDescriptionScreen from '../screens/IssueDescriptionScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import Header from './Header';


const PostStack = createStackNavigator({
  PhotoCapture: PhotoCaptureScreen,
  IssueDescription: IssueDescriptionScreen
}, {
  initialRouteName: 'PhotoCapture',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
}, {
  initialRouteName: 'Settings',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const Tab = createBottomTabNavigator({ 
  Post: PostStack, 
  Settings: SettingsStack
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Post') {
        iconName = 'ios-cloud-upload';
      } else if (routeName === 'Settings') {
        iconName = 'ios-settings';
      } 

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#006b24',
    inactiveTintColor: 'gray',
  },
  animationEnabled: 'true'
});

export default class TabBarAdjustableGuest extends React.Component {

  static router = Tab.router;

  render() {
    
    const { navigation } = this.props;
    
    return (
      <Tab navigation={navigation} />
    );
    
  }
} 