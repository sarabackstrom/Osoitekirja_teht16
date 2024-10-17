import { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { haeOsoitteet, lisaaOsoite } from "./Database";

export default function MapScreen({ route, navigation }) {
    const { region, hakusana } = route.params;
    const [osoitteet, setOsoitteet] = useState([]);

    useEffect(() => {
        const fetchOsoitteet = async () => {
            const data = await haeOsoitteet();
            setOsoitteet(data);
        };

        fetchOsoitteet();
    }, [navigation]);

    const handleLisaaOsoite = async () => {
        const osoite = {
            nimi: hakusana,
            lat: region.latitude,
            lon: region.longitude
        };

        await lisaaOsoite(osoite);
        const data = await haeOsoitteet();
        setOsoitteet(data);
        console.log(osoitteet)

        navigation.navigate('HomeScreen');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                style={styles.container}
                region={region}>
                <Marker
                    coordinate={{
                        latitude: region.latitude,
                        longitude: region.longitude
                    }}
                    title='Tätä hait'
                />
            </MapView>
            <Button
                title="Save location"
                onPress={handleLisaaOsoite}
                style= {styles.button}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        padding: 20
    }
});
