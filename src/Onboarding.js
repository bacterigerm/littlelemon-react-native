import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';

import {useContext, useEffect, useState} from 'react';

import useFonts from './usefonts';

import {AppContext} from './user';
import TopBar from './TopBar';
import Splash from './Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Button = ({onPress, children, disabled}) => {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.buttonWrapper, disabled && styles.disabled]}
            disabled={disabled}
        >
            <Text>{children}</Text>
        </Pressable>
    );
};


const Onboarding = ({navigation}) => {
    const {dispatch, username, email, loggedin} = useContext(AppContext);

    const [IsReady, SetIsReady] = useState(false);


    const [localusername, onChangeLocalUserName] = useState('');
    const [localemail, onChangeLocalEmail] = useState('');


    useEffect(() => {
        // Populating preferences from storage using AsyncStorage.multiGet
        (async () => {
            try {
                await useFonts();
            } catch (e) {
                alert(`An error occurred: ${e.message}`);
            } finally {
                SetIsReady(true)
                dispatch({
                    type: 'SET_LOGGEDIN',
                    payload: {loggedin: false}
                });
            }

        })();
    }, []);

    const saveUser = async (username, email) => {
        try {
            await AsyncStorage.setItem("username", username)
            await AsyncStorage.setItem("email", email)
        } catch (e) {
            // Handle error
        }
    }

    if (!IsReady) {
        return <Splash/>;
    }

    const submit = () => {
        dispatch({
            type: 'SET_LOGGEDIN',
            payload: {loggedin: true}
        });
        dispatch({
            type: 'SET_USERNAME',
            payload: {name: localusername}
        })
        dispatch({
            type: 'SET_EMAIL',
            payload: {email: localemail}
        })
        saveUser(localusername, localemail)
        navigation.navigate('Home')
    }

    return (
        <>

            <TopBar navigation={navigation}/>
            <View style={{
                flex: 1,
                alignContent: "space-between",
                backgroundColor: '#aaaaaa',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <Text style={styles.headerText}>
                    Let us get to know you</Text>
                <Text style={styles.baseText}>First name</Text>
                <TextInput style={styles.inputbox}
                           label="First name"
                           mode="outlined"
                           onChangeText={onChangeLocalUserName}
                           value={localusername}
                           multiline={false}
                           placeholder="Adam Smith"
                           keyboardType="ascii-capable"
                />

                <Text style={styles.baseText}>Your email</Text>
                <TextInput style={styles.inputbox}
                           label="Email"
                           mode="outlined"
                           onChangeText={onChangeLocalEmail}
                           value={localemail}
                           multiline={false}
                           placeholder="adam@smith.com"
                           keyboardType="email-address"
                           textContentType="emailAddress"
                />
            </View>

            <View style={{
                flex: 0.5,
                alignContent: "space-between",
                backgroundColor: '#edefee',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Button
                    title='submit'
                    onPress={() => {
                        onChangeLocalUserName("")
                        onChangeLocalEmail("")
                        submit()
                    }}
                    disabled={(localemail.length * localusername.length) === 0}
                >
                    Next
                </Button>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    baseText: {
        fontSize: 21,
        fontFamily: 'karla'
    },

    inputbox: {
        width: 200,
        justifyContent: "center", alignContent: "center",
        borderWidth: 1,
        alignContent: 'center',
        fontSize: 21,
        padding: 10,
        margin: 12,
        borderRadius: 5
    },
    headerText: {
        fontSize: 30,
        textAlign: "center",
        margin: 10,
        fontFamily: 'karla'
    },

    buttonWrapper: {
        borderRadius: 8,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
    },
    disabled: {
        backgroundColor: 'grey',
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        color: 'white',
    }
});
/*      */
/*
      <Text>First name</Text>
      
        onChangeText={props.onChangeText}
        
        value={props.text}
*/

export default Onboarding;