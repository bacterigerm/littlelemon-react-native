import {Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {useContext, useEffect, useState} from 'react';
import {AppContext} from './user';

import useFonts from './usefonts';
import {SearchBar} from "react-native-elements";
import Splash from './Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';


const url = `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json`;
const sections = ['starters', 'mains', 'desserts'];

const Home = ({navigation}) => {

    const [isloading, SetIsloading] = useState(true);
    const [loaddata, setLoaddata] = useState(true);
    const {dispatch} = useContext(AppContext);
    const [data, setData] = useState([]);
    const [rawdata, setRawData] = useState([])
    const [searchBarText, setSearchBarText] = useState('');

    const [filter, setFilter] = useState(0);


    useEffect(() => {
        // Populating preferences from storage using AsyncStorage.multiGet
        (async () => {
            try {

                await useFonts();
                const receivedusername = await AsyncStorage.getItem("username");
                const receivedlastname = await AsyncStorage.getItem("lastname");
                const receivedemail = await AsyncStorage.getItem("email");
                const receivedavatar = await AsyncStorage.getItem("avatar");

                if (receivedusername !== null) {
                    dispatch({
                        type: 'SET_USERNAME',
                        payload: {name: receivedusername}
                    });
                }
                if (receivedlastname !== null) {
                    dispatch({
                        type: 'SET_LASTNAME',
                        payload: {lastname: receivedlastname}
                    });
                }
                if (receivedemail !== null) {
                    dispatch({
                        type: 'SET_EMAIL',
                        payload: {lastname: receivedemail}
                    });
                }
                if (receivedavatar !== null) {
                    dispatch({
                        type: 'SET_AVATAR',
                        payload: {avatarimg: receivedavatar}
                    });
                }
            } catch (e) {
                alert(`An error occurred: ${e.message}`);
            } finally {
                dispatch({
                    type: 'SET_LOGGEDIN',
                    payload: {loggedin: true}
                });
                SetIsloading(false)
            }

        })();


        newdata = [];
        (async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                newdata = await json.menu.map((item, index) => {
                    return ({'id': index, ...item})
                });
            } catch (e) {
                Alert.alert(e.message);
            } finally {
                ;
            }
        })().finally(
            () => {
                setRawData(newdata);
                setLoaddata(false);
            }
        )
    }, []);


    useEffect(
        () => {
            setData(rawdata.filter((item) => {
                return (
                    ((!searchBarText) ||
                        searchBarText && item.name.toLowerCase().includes(searchBarText.toLowerCase())
                    )
                    &&
                    ((filter === 0) || (filter !== 0) && (item.category === sections[filter - 1]))
                );
            }));
        }, [rawdata]);

    useEffect(
        () => {

            setData(rawdata.filter((item) => {
                return (
                    ((!searchBarText) ||
                        searchBarText && item.name.toLowerCase().includes(searchBarText.toLowerCase())
                    )
                    &&
                    ((filter === 0) || (filter !== 0) && (item.category === sections[filter - 1]))
                );
            }))
        }, [searchBarText, filter]);


    if (isloading || loaddata) {
        return <Splash/>;
    }

    const Item = ({title, description, price, imageurl}) => {
        const correction = (imageurl === "lemonDessert.jpg") ? "lemonDessert 2.jpg" : imageurl;
        return (<View style={styles.item}>
            <View style={{flexDirection: 'column', flex: 2}}>
                <Text style={[styles.title, {fontWeight: 'bold'}]}>{title}</Text>
                <Text style={[styles.title, {fontSize: 15}]}>{description}</Text>
                <Text style={styles.title}>${price}</Text>
            </View>
            <Image style={{width: 150, height: 150, flex: 1}}
                   resizeMode="contain"
                   source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${correction}?raw=true`}}
                   Alt="Alternative text"/>
        </View>);
    };

//  Alert.alert(`data size: ${data.size}`)

    const Filter = ({index, text}) => {
        return (
            <Pressable onPress={() => setFilter((index === filter) ? 0 : index)}>
                <Text style={[styles.filters, (index === filter) && {backgroundColor: "#F4CE14"}]}>
                    {text}</Text>
            </Pressable>)
    };
    return (
        <>
            <SafeAreaView style={styles.container}>
                <TopBar navigation={navigation}/>
                <View style={styles.hero}>
                    <Text style={{padding: 5, fontSize: 50, color: "#F4CE14", fontFamily: "markazi"}}>
                        Little Lemon
                    </Text>
                    <View style={{flexDirection: "row", alignItems: "stretch", justifyContent: "space-between"}}>

                        <View style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "stretch",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{padding: 5, fontSize: 40, color: "white", fontFamily: "markazi"}}>
                                Chicago
                            </Text>
                            <Text style={{padding: 5, fontSize: 20, color: "white", fontFamily: "karla"}}>
                                We are a family owned restaurant, focused on traditional recipes served with a twist
                            </Text>
                        </View>

                        <Image style={{padding: 0, margin: 0, flex: 1, width: 200, height: 200}}
                               resizeMode="contain"
                               accessible={true}
                               source={require("./img/Hero.png")}/>
                    </View>
                    <SearchBar
                        placeholder="Search"
                        placeholderTextColor="white"
                        onChangeText={(value) => setSearchBarText(value)}
                        value={searchBarText}
                        round={true}
                        iconColor="grey"
                        containerStyle={{
                            elevation: 0,
                            borderWidth: 0,
                            backgroundColor: "#495E57",
                            alignSelf: "center",
                            width: "80%"
                        }}
                        inputContainerStyle={{
                            fontSize: 20, color: 'White'
                        }}
                    />
                </View>
                <Text style={{fontWeight: "bold", fontFamily: "karla", margin: 10, fontSize: 30}}>
                    ORDER FOR DELIVERY!
                </Text>
                <View style={{margin: 5, flexDirection: 'row', alignItems: "stretch", justifyContent: "space-around"}}>
                    <Filter text="Starters" index={1}/>
                    <Filter text="Mains" index={2}/>
                    <Filter text="Desserts" index={3}/>
                </View>

                <FlatList
                    data={data}
                    renderItem={({item}) => <Item title={item.name} price={item.price} description={item.description}
                                                  imageurl={item.image}/>}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                    height: 1,
                                    width: "100%",
                                    backgroundColor: "#607D8B",
                                }}
                            />
                        );
                    }}
                />
            </SafeAreaView>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#EDEFEE',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    hero: {
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: '#495E57',
    },
    filters: {
        fontSize: 24,
        padding: 5,
        backgroundColor: "#DCDEDD",
        borderRadius: 15,
        fontFamily: "karla",
        fontWeight: "bold",
        color: "#495E57"
    },
    sectionList: {
        width: '100%',
        paddingHorizontal: 2,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        color: '#495E57',
        fontFamily: "karla"
    },
    header: {
        fontSize: 24,
        paddingVertical: 8,
        color: '#FBDABB',
        backgroundColor: '#495E57',
        fontFamily: "karla"
    },
});
export default Home;