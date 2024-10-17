import { Alert, View, Button, StyleSheet, Text, TextInput, FlatList } from "react-native";
import { useEffect, useState  } from 'react';
import { deleteItem, haeOsoitteet, luoTietokanta } from "./Database";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen({ navigation, route }) {
    const [hakusana, setHakusana] = useState('');
    const [loading, setLoading] = useState(false);
    const [osoitteet, setOsoitteet] = useState([]);

  useEffect(() => {
        const fetchOsoitteet = async () => {
            const data = await haeOsoitteet();
            setOsoitteet(data);
        };

        fetchOsoitteet();

        //tämä addListener ei ole omaa osaamista vaan Chatgpt neuvoi käyttämään. Yritin ratkaista osoitteiden päivittymisen, mutta en itse osannut. Omassa ratkaisussa osoitteet päivittyivät vain refreshin jälkeen.

        const unsubscribe = navigation.addListener('focus', fetchOsoitteet); // Kutsuu fetchOsoitteet, kun komponentti saa fokuksen

        return unsubscribe; // Puhdistaa kuuntelijan, kun komponentti poistuu
    }, [navigation]);

    const handleFetch = () => {
        setLoading(true);
        fetch(`https://geocode.maps.co/search?q=${hakusana}&api_key=66e9726dcbade034290534nhz528a20`)
            .then(response => {
                if (!response.ok) throw new Error("Error in fetch:" + response.statusText);
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    const location = data[0];
                    const newRegion = {
                        latitude: parseFloat(location.lat),
                        longitude: parseFloat(location.lon),
                        latitudeDelta: 0.0322,
                        longitudeDelta: 0.0221,
                    };
                    navigation.navigate('MapScreen', {region: newRegion, hakusana});
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleDeleteItem = async (id) => {
        await deleteItem(id); 
        const data = await haeOsoitteet(); 
        setOsoitteet(data); 
    };
 const showAlert = (id) =>  
    Alert.alert(
    'Do you want to remove the address',
    'This address will be deleted permanently',
    [
    {
    text: 'Cancel',
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel',
    },
    { text: 'OK', onPress: () => handleDeleteItem(id)
    },
    ],
    { cancelable: false }
    );
    
    const handleNaytaKartalla = async (item) => {
        const newRegion = {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
        };
        navigation.navigate('MapScreen', {region: newRegion, hakusana: item.hakusana});
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text1}>PLACEFINDER</Text>
            <TextInput
            style={styles.textinput}
                placeholder='Type in address'
                onChangeText={text => setHakusana(text)}
                value={hakusana}
            />
            <Button
                title="Show on map"
                onPress={handleFetch}
            />
            <FlatList
                data={osoitteet}
                ItemSeparatorComponent={() => <View style={{height: 10}} />}
                renderItem={({ item }) => (
                    <View style={styles.list}>
                    <Text onLongPress={() => showAlert(item.id)}>{item.hakusana}</Text>
                    <Text onPress={() => handleNaytaKartalla(item)} style= {{color: 'grey'}}>Show on map</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f1f1'
    },
    button: {
        padding: 10
    },
    list: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        width: '100%',
        backgroundColor: 'white'
   },
   textinput: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    width: '90%',
    padding: 5
   },
   text1: {
    justifyContent: 'flex-start',
    width: '90%',
    paddingTop: 20,
    paddingBottom: 10,
    color: 'grey'
   }
});