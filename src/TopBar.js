import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {useContext} from 'react';
import {AppContext} from './user';

const TopBar = ({navigation}) => {

    const {avatarimg, username, lastname, loggedin} = useContext(AppContext);
    return (
        <View style={styles.headerWrapper}>

            <Image
                style={[styles.image, {flex: 0.8}]}
                source={require('./img/yellowlogoandtext.png')}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
            />
            <Pressable onPress={() => navigation.navigate('Profile')}>
                {avatarimg && loggedin &&
                    <Image
                        style={[styles.image, {flex: 0.2}]}
                        source={{uri: avatarimg}}
                        resizeMode="contain"
                        accessible={true}
                        accessibilityLabel={'Little Lemon Logo'}
                    />
                }
                {avatarimg === null && loggedin &&
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
            </Pressable>


        </View>
    );
}


const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        backgroundColor: '#edefee',
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        height: 40,
        padding: 10,
        width: "100%",
    }
})

export default TopBar;