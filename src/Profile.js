import {Image, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
//import 'react-initials-avatar/lib/ReactInitialsAvatar.css';
import Splash from './Splash';
import TopBar from './TopBar';

import {AppContext} from './user';

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

const LogOutButton = ({onPress, children, disabled}) => {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.logout, disabled && styles.disabled]}
            disabled={disabled}
        >
            <Text>{children}</Text>
        </Pressable>
    );
};


const Profile = ({navigation}) => {
    const [isloading, SetIsloading] = useState(true);

    const [username, SetUsername] = useState("");
    const [lastname, SetLastname] = useState("");
    const [email, SetEmail] = useState("");
    const [phone, SetPhone] = useState("");
    const [avatar, SetAvatar] = useState(null);

    const {dispatch, avatarimg, loggedin} = useContext(AppContext);


    useEffect(() => {
        // Populating preferences from storage using AsyncStorage.multiGet
        (async () => {
            if (loggedin) {
                try {
                    const receivedusername = await AsyncStorage.getItem("username");
                    const receivedlastname = await AsyncStorage.getItem("lastname");
                    const receivedemail = await AsyncStorage.getItem("email");
                    const receivedphone = await AsyncStorage.getItem("phone");
                    const receivedavatar = await AsyncStorage.getItem("avatar");

                    if (receivedusername !== null) {
                        SetUsername(receivedusername)
                    }
                    if (receivedlastname !== null) {
                        SetLastname(receivedlastname)
                    }
                    if (receivedemail !== null) {
                        SetEmail(receivedemail)
                    }
                    if (receivedphone !== null) {
                        SetPhone(receivedphone)
                    }
                    if (receivedavatar !== null) {
                        SetAvatar(receivedavatar)
                        dispatch({
                            type: 'SET_AVATAR',
                            payload: {avatarimg: receivedavatar}
                        })
                    }
                } catch (e) {
                    alert(`An error occurred: ${e.message}`);
                } finally {
                    SetIsloading(false)
                }
            } else {
                SetEmail("");
                SetLastname("");
                SetAvatar(null);
                SetPhone("");
                SetUsername("");


                dispatch({
                    type: 'SET_AVATAR',
                    payload: {avatarimg: null}
                });
                try {

                    AsyncStorage.clear();
                } catch (e) {
                }
                navigation.navigate('Onboarding')
            }
        })();
    }, [loggedin]);

    const saveUser = async () => {
        try {
            await AsyncStorage.setItem("username", username)
            await AsyncStorage.setItem("email", email)
            await AsyncStorage.setItem("lastname", lastname)
            await AsyncStorage.setItem("phone", phone)
            await AsyncStorage.setItem("avatar", avatar)

        } catch (e) {
            // Handle error
        } finally {
            dispatch({
                type: 'SET_USERNAME',
                payload: {name: username}
            });
            dispatch({
                type: 'SET_LASTNAME',
                payload: {lastname: lastname}
            });
            dispatch({
                type: 'SET_EMAIL',
                payload: {lastname: email}
            });
            dispatch({
                type: 'SET_AVATAR',
                payload: {avatarimg: avatar}
            });
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            canceled: false,
            cancelled: false
        });

        if (!result.canceled) {
            SetAvatar(result.assets[0].uri);
        }

    };


    const loadUser = async () => {
        try {
            const receivedusername = await AsyncStorage.getItem("username");
            const receivedlastname = await AsyncStorage.getItem("lastname");
            const receivedemail = await AsyncStorage.getItem("email");
            const receivedphone = await AsyncStorage.getItem("phone");
            const receivedavatar = await AsyncStorage.getItem("avatar");

            if (receivedusername !== null) {
                SetUsername(receivedusername)
            } else SetUsername("");
            if (receivedlastname !== null) {
                SetLastname(receivedlastname)
            } else SetLastname("");
            if (receivedemail !== null) {
                SetEmail(receivedemail)
            } else SetEmail("");
            if (receivedphone !== null) {
                SetPhone(receivedphone)
            } else SetPhone("");
            if (receivedavatar !== null) {
                SetAvatar(receivedavatar)
                dispatch({
                    type: 'SET_AVATAR',
                    payload: {avatarimg: receivedavatar}
                })
            } else SetAvatar(null);
        } catch (e) {
            alert(`An error occurred: ${e.message}`);
        } finally {
        }
    }


    if (isloading) {
        // We haven't finished reading from AsyncStorage yet
        /*
          try {
            loadUser()  
          } catch {
            alert("error")
          } finally {
            SetIsloading(false)
          }*/
        return <Splash/>;
    }


    return (
        <>
            <TopBar navigation={navigation}/>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row', flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{flexDirection: 'column', flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
                        {avatar && <Image
                            style={[styles.image, {width: 60, height: 60, borderRadius: 60}]}
                            source={{uri: avatar}}
                            resizeMode="contain"
                            accessible={true}
                            accessibilityLabel={'Avatar'}
                        />}
                        {avatar === null &&
                            <Text style={{
                                backgroundColor: '#F4CE14',
                                color: "#000000",
                                fontSize: 20,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: 45
                            }}> {username ? `${username[0]}${lastname ? lastname[0] : ""}` : ""} </Text>}

                    </View>

                    <Button children="Pick image" onPress={pickImage}/>
                    <Button children="Remove" onPress={() => SetAvatar(null)} disabled={avatar === null}/>
                </View>
                <Text>First name (required)</Text>
                <TextInput style={styles.inputbox}
                           label="First Name"
                           mode="outlined"
                           onChangeText={SetUsername}
                           value={username}
                           multiline={false}
                           keyboardType="ascii-capable"
                />


                <Text>Last name</Text>
                <TextInput style={styles.inputbox}
                           label="First Name"
                           mode="outlined"
                           onChangeText={SetLastname}
                           value={lastname}
                           multiline={false}
                           keyboardType="ascii-capable"
                />
                <Text>Email address (required)</Text>
                <TextInput style={styles.inputbox}
                           label="First Name"
                           mode="outlined"
                           onChangeText={SetEmail}
                           value={email}
                           multiline={false}
                           keyboardType="email-address"
                           textContentType="emailAddress"
                />

                <Text>Phone number</Text>
                <TextInput style={styles.inputbox}
                           label="Phone number"
                           mode="outlined"
                           onChangeText={SetPhone}
                           value={phone}
                           multiline={false}
                           keyboardType="phone-pad"
                           textContentType="emailAddress"
                />

                <LogOutButton children='Log out' onPress={() => dispatch({
                    type: 'SET_LOGGEDIN',
                    payload: {loggedin: false}
                })} disabled={false}/>
                <View style={{flexDirection: 'row', flex: 0.2, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button children='Discard changes' onPress={loadUser} disabled={false}/>
                    <Button children='Save changes' onPress={saveUser}
                            disabled={username === "" || email === ""}/>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontSize: 21,
        borderWidth: 1
    },
    image: {
        height: 40,
        padding: 10,
        width: "100%",
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

    buttonWrapper: {
        borderRadius: 8,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        margin: 10,
    },

    logout: {
        borderRadius: 8,
        backgroundColor: '#F4CE14',
        flexDirection: 'row',
        alignContent: 'stretch',
        justifyContent: 'center',
        padding: 12,
        margin: 20,
        alignSelf: 'stretch'
    },

    disabled: {
        backgroundColor: 'grey',
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        color: 'white',
    }
})

export default Profile;