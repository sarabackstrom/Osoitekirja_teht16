import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen'; 
import MapScreen from './components/MapScreen';
import { NavigationContainer } from '@react-navigation/native';
import { luoTietokanta } from './components/Database';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    luoTietokanta();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="MapScreen" component={MapScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
