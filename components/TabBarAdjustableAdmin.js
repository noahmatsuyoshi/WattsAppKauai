import React from 'react';
import SettingsScreen from '../screens/SettingsScreenEmployee';
import MapScreen from '../screens/MapScreen';
import PhotoCaptureScreen from '../screens/PhotoCaptureScreen';
import IssueDescriptionScreen from '../screens/IssueDescriptionScreen';
import AdminScreen from '../screens/AdminScreen';
import ListViewScreen from '../screens/ListViewScreen';
import ViewUsersScreen from '../screens/ViewUsersScreen';
import ListIssueTypesScreen from '../screens/ListIssueTypesScreen';
import PushNotificationScreen from '../screens/PushNotificationScreen';
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

const MapStack = createStackNavigator({
  Map: MapScreen
}, {
  initialRouteName: 'Map',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const ListStack = createStackNavigator({
  ListView: ListViewScreen
}, {
  initialRouteName: 'ListView',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
}, {
  initialRouteName: 'Settings',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const ManageUsersStack = createStackNavigator({
  ViewUsers: ViewUsersScreen
}, {
  initialRouteName: 'ViewUsers',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const IssueTypesStack = createStackNavigator({
  ListIssueTypes: ListIssueTypesScreen
}, {
  initialRouteName: 'ListIssueTypes',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const PushNotificationsStack = createStackNavigator({
  PushNotification: PushNotificationScreen
}, {
  initialRouteName: 'PushNotification',
  defaultNavigationOptions: Header.defaultNavigationOptions
})

const AdminTab = createBottomTabNavigator({ 
  Users: ManageUsersStack, 
  "Issue Types": IssueTypesStack,
  "Push Notifications": PushNotificationsStack
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Users') {
        iconName = 'ios-people';
      } else if (routeName === 'Issue Types') {
        iconName = 'ios-color-filter';
      } else if (routeName === 'Push Notifications') {
        iconName = 'ios-notifications';
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'orange',
    inactiveTintColor: 'gray',
  },
  animationEnabled: 'true'
});

const Tab = createBottomTabNavigator({ 
  Post: PostStack, 
  Map: MapStack,
  List: ListStack,
  Admin: AdminTab,
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
      } else if (routeName === 'Map') {
        iconName = 'ios-map';
      } else if (routeName === 'List') {
        iconName = 'ios-list-box';
      } else if (routeName === 'Admin') {
        iconName = 'ios-glasses';
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

export default class TabBarAdjustableAdmin extends React.Component {

  static router = Tab.router;

  render() {
    
    const { navigation } = this.props;
    
    return (
      <Tab navigation={navigation} />
    );
    
  }
} 