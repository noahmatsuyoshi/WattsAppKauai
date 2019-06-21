import { 
  createStackNavigator, 
  createSwitchNavigator, 
  createAppContainer,
} from 'react-navigation';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import SignInScreen from './screens/SignInScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import TabBarAdjustableAdmin from './components/TabBarAdjustableAdmin';
import TabBarAdjustableEmployee from './components/TabBarAdjustableEmployee';
import TabBarAdjustableGuest from './components/TabBarAdjustableGuest';
import Header from './components/Header';

const AppTabsAdmin = TabBarAdjustableAdmin;
const AppTabsEmployee = TabBarAdjustableEmployee;
const AppTabsGuest = TabBarAdjustableGuest;
const AuthStack = createStackNavigator(
  { 
    SignIn: SignInScreen,
    ChangePassword: ChangePasswordScreen
  }, 
  {defaultNavigationOptions: Header.defaultNavigationOptions}
);

/*
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AppAdmin: AppTabsAdmin,
    AppEmployee: AppTabsEmployee,
    AppGuest: AppTabsGuest,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
*/

// Security testing mode
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AppAdmin: AppTabsAdmin,
    AppEmployee: AppTabsAdmin,
    AppGuest: AppTabsAdmin,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
