import React from 'react';
import { StyleSheet, View } from 'react-native';

import HomePage from './screens/home';
import Connections from './screens/connections';

import AppTheme from './components/theme';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


// change navigation bar color
export default class App extends React.Component {

  constructor() {
    super();

    this.state = {
      areLightsOn: false,
    };
  }

  render() {

    return (
      <View style={styles.container}>

        <NavigationContainer initialRouteName="HomePage">
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="Connections" component={Connections} />
          </Stack.Navigator>
        </NavigationContainer>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.default,
  },
  NavigationContainer: {
    backgroundColor: AppTheme.default,
  },
})