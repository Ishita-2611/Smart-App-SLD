import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  ExamMode: undefined;
};

type ExamModeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ExamMode'
>;

interface ExamModeScreenProps {
  navigation: ExamModeScreenNavigationProp;
}

const ExamModeScreen: React.FC<ExamModeScreenProps> = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { colors } = useTheme();

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/notes/',
        {
          title,
          content,
          is_exam_mode: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error saving exam note:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Exam Mode</Text>
          <Text style={styles.description}>
            Use this mode to take notes during exams. All notes created here will
            be marked as exam notes for easy reference later.
          </Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Content"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={12}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            icon="content-save"
          >
            Save Exam Note
          </Button>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ExamModeScreen; 