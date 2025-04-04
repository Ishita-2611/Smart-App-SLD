import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SpeechToTextScreen from '../screens/features/SpeechToTextScreen';
import HandwritingRecognitionScreen from '../screens/features/HandwritingRecognitionScreen';
import CalculatorScreen from '../screens/features/CalculatorScreen';
import NotesScreen from '../screens/features/NotesScreen';
import ExamModeScreen from '../screens/features/ExamModeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

const AppNavigator = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerLeft: null }}
          />
          <Stack.Screen
            name="SpeechToText"
            component={SpeechToTextScreen}
            options={{ title: 'Speech to Text' }}
          />
          <Stack.Screen
            name="HandwritingRecognition"
            component={HandwritingRecognitionScreen}
            options={{ title: 'Handwriting Recognition' }}
          />
          <Stack.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{ title: 'Calculator' }}
          />
          <Stack.Screen
            name="Notes"
            component={NotesScreen}
            options={{ title: 'Notes' }}
          />
          <Stack.Screen
            name="ExamMode"
            component={ExamModeScreen}
            options={{ title: 'Exam Mode' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator; 