import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../config/api';

type RootStackParamList = {
  Home: undefined;
  SpeechToText: undefined;
  HandwritingRecognition: undefined;
  Calculator: undefined;
  Notes: undefined;
  ExamMode: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface UserProfile {
  user: {
    username: string;
    email: string;
  };
  bio: string;
  profile_picture: string | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profiles/');
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert(
        'Error',
        'Failed to load profile. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Speech to Text',
      icon: '🎤',
      route: 'SpeechToText',
      description: 'Convert your speech into text',
    },
    {
      title: 'Handwriting Recognition',
      icon: '✍️',
      route: 'HandwritingRecognition',
      description: 'Convert handwritten text to digital',
    },
    {
      title: 'Calculator',
      icon: '🔢',
      route: 'Calculator',
      description: 'Perform calculations',
    },
    {
      title: 'Notes',
      icon: '📝',
      route: 'Notes',
      description: 'Access your notes',
    },
    {
      title: 'Exam Mode',
      icon: '📚',
      route: 'ExamMode',
      description: 'Enter exam mode',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Image
              size={80}
              source={
                profile?.profile_picture
                  ? { uri: profile.profile_picture }
                  : require('../assets/default-avatar.png')
              }
            />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>
              {profile?.user.username || 'Loading...'}
            </Text>
            <Text style={styles.email}>{profile?.user.email}</Text>
          </View>
        </Card.Content>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        What would you like to do today?
      </Text>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => navigation.navigate(feature.route as keyof RootStackParamList)}
          >
            <Card>
              <Card.Content>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  featureCard: {
    width: '50%',
    padding: 8,
  },
  featureIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default HomeScreen; 