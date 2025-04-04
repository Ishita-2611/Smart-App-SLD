import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type RootStackParamList = {
  SpeechToText: undefined;
};

type SpeechToTextScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SpeechToText'
>;

interface SpeechToTextScreenProps {
  navigation: SpeechToTextScreenNavigationProp;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

const SpeechToTextScreen: React.FC<SpeechToTextScreenProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const { colors } = useTheme();

  const startRecording = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsRecording(true);
      const uri = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording time: ', e.currentPosition);
        return;
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);

      // Create form data
      const formData = new FormData();
      formData.append('audio_file', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });

      // Upload to backend
      const response = await axios.post(
        'http://localhost:8000/api/speech/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTranscribedText(response.data.transcribed_text);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Speech to Text Converter</Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={isRecording ? stopRecording : startRecording}
              style={[
                styles.button,
                { backgroundColor: isRecording ? '#ff4444' : colors.primary },
              ]}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </View>
          {transcribedText ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Transcribed Text:</Text>
              <Card style={styles.resultCard}>
                <Card.Content>
                  <Text style={styles.transcribedText}>{transcribedText}</Text>
                </Card.Content>
              </Card>
            </View>
          ) : null}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: '#fff',
  },
  transcribedText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SpeechToTextScreen; 