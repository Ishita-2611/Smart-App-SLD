import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Calculator: undefined;
};

type CalculatorScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Calculator'
>;

interface CalculatorScreenProps {
  navigation: CalculatorScreenNavigationProp;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const { colors } = useTheme();

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['C', '0', '=', '+'],
  ];

  const handlePress = async (value: string) => {
    switch (value) {
      case 'C':
        setDisplay('0');
        setExpression('');
        break;
      case '=':
        try {
          const token = await AsyncStorage.getItem('token');
          const sanitizedExpression = expression
            .replace('×', '*')
            .replace('÷', '/');

          const response = await axios.post(
            'http://localhost:8000/api/calculations/',
            { expression: sanitizedExpression },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setDisplay(response.data.result);
          setExpression('');
        } catch (error) {
          setDisplay('Error');
          setExpression('');
        }
        break;
      default:
        if (display === '0' || display === 'Error') {
          setDisplay(value);
          setExpression(value);
        } else {
          setDisplay(display + value);
          setExpression(expression + value);
        }
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.display}>
            <Text style={styles.displayText}>{display}</Text>
          </View>
          <View style={styles.buttonGrid}>
            {buttons.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          '=×÷+-'.includes(button)
                            ? colors.primary
                            : button === 'C'
                            ? '#ff4444'
                            : '#f0f0f0',
                      },
                    ]}
                    onPress={() => handlePress(button)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: '=×÷+-C'.includes(button)
                            ? '#fff'
                            : '#000',
                        },
                      ]}
                    >
                      {button}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  display: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  displayText: {
    fontSize: 36,
    textAlign: 'right',
  },
  buttonGrid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CalculatorScreen; 