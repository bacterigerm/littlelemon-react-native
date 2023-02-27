import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from './src/Onboarding';
import Home from './src/Home';
import Profile from './src/Profile';

import Splash from './src/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useEffect, useState} from 'react';
import {AppProvider} from './src/user';

const Stack = createNativeStackNavigator();
export default function App() {

    const [isloading, SetIsloading] = useState(true);
    const [isloggedin, SetIsloggedin] = useState(false);

    let username = ""
    let email = ""

    useEffect(() => {
        // Populating preferences from storage using AsyncStorage.multiGet
        (async () => {
            try {
                const receivedname = await AsyncStorage.getItem("username");
                if (receivedname !== null) {
                    SetIsloggedin(true)
                    username = receivedname
                }
                const receivedemail = await AsyncStorage.getItem("email");
                if (receivedemail !== null) {
                    username = receivedemail
                }
            } catch (e) {
                alert(`An error occurred: ${e.message}`);
            } finally {
                SetIsloading(false)
            }
        })();
    }, []);


    if (isloading) {
        // We haven't finished reading from AsyncStorage yet
        return <Splash/>;
    }

    return (
        <AppProvider>
            <View style={styles.container}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={isloggedin ? 'Home' : 'Onboarding'}>
                        <Stack.Screen name="Home" component={Home}/>
                        <Stack.Screen name="Profile" component={Profile}/>
                        <Stack.Screen name="Onboarding" component={Onboarding}/>


                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </AppProvider>
    );

}
/*
 
{isloggedin?<SaveUser localusername={username} localemail={email}></SaveUser>:<></>
  }
  */

/*
      <NavigationContainer>
<Stack.Navigator>
  <Stack.Screen name="Onboarding" component={Onboarding}  />
</Stack.Navigator>
</NavigationContainer>*/

/*<Stack.Navigator initialRouteName="Onboarding">
<Stack.Screen name="Onboarding" 
component={Onboarding} 
initialParams = {{
  user: {user}, 
  onChangeUser: {onChangeUser}, email: {email}, onChangeEmail: {onChangeEmail}}} 
/>
</Stack.Navigator>

    
*/
/*
<NavigationContainer>
<Stack.Navigator initialRouteName="Onboarding">
<Stack.Screen name="Onboarding" 
component={Onboarding} 
initialParams = {{
  user: {user}, 
  onChangeUser: {onChangeUser}, email: {email}, onChangeEmail: {onChangeEmail}}} 
/>
</Stack.Navigator>
    </NavigationContainer>
/*

        initialParams={
          text:text
          onChangeText:onChangeText,
          email:email 
          onChangeEmail:onChangeEmail}*/


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#edefee',
    },
});


/*


https://docs.expo.dev/versions/latest/sdk/splash-screen/
const [appIsReady, setAppIsReady] = useState(false);
    useEffect(() => {
        async function prepare() {
          try {
            // Pre-load fonts, make any API calls you need to do here
            await Font.loadAsync({
                'karla': require('../assets/fonts/Karla-Regular.ttf'),
              })
          } catch (e) {
            console.warn(e);
          } finally {
            // Tell the application to render
            setAppIsReady(true);
          }
        }
    
        prepare();
      }, []);

      const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
          // This tells the splash screen to hide immediately! If we call this after
          // `setAppIsReady`, then we may see a blank screen while the app is
          // loading its initial state and rendering its first pixels. So instead,
          // we hide the splash screen once we know the root view has already
          // performed layout.
          await SplashScreen.hideAsync();
        }
      }, [appIsReady]);
    
      if (!appIsReady) {
        return null;
      }*/