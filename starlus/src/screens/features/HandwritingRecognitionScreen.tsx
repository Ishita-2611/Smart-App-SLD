import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

type RootStackParamList = {
  HandwritingRecognition: undefined;
};

type HandwritingRecognitionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HandwritingRecognition'
>;

interface HandwritingRecognitionScreenProps {
  navigation: HandwritingRecognitionScreenNavigationProp;
}

const HandwritingRecognitionScreen: React.FC<HandwritingRecognitionScreenProps> = () => {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const { colors } = useTheme();

  const selectImage = async (useCamera: boolean) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = useCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.assets && result.assets[0]?.uri) {
        setImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'handwritten.jpg',
      });

      const response = await axios.post(
        'http://localhost:8000/api/handwritten/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setRecognizedText(response.data.recognized_text);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Handwriting Recognition</Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => selectImage(true)}
              style={styles.button}
            >
              Take Photo
            </Button>
            <Button
              mode="contained"
              onPress={() => selectImage(false)}
              style={styles.button}
            >
              Choose from Gallery
            </Button>
          </View>
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}
          {recognizedText ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Recognized Text:</Text>
              <Card style={styles.resultCard}>
                <Card.Content>
                  <Text style={styles.recognizedText}>{recognizedText}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
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
  recognizedText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HandwritingRecognitionScreen; 