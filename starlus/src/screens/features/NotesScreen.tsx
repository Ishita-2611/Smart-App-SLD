import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  FAB,
  TextInput,
  Portal,
  Modal,
  Button,
} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Notes: undefined;
};

type NotesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notes'
>;

interface NotesScreenProps {
  navigation: NotesScreenNavigationProp;
}

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_exam_mode: boolean;
}

const NotesScreen: React.FC<NotesScreenProps> = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExamMode, setIsExamMode] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/notes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/notes/',
        {
          title,
          content,
          is_exam_mode: isExamMode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisible(false);
      setTitle('');
      setContent('');
      setIsExamMode(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {notes.map((note) => (
          <Card key={note.id} style={styles.noteCard}>
            <Card.Content>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteContent} numberOfLines={3}>
                {note.content}
              </Text>
              {note.is_exam_mode && (
                <View style={styles.examModeTag}>
                  <Text style={styles.examModeText}>Exam Mode</Text>
                </View>
              )}
              <Text style={styles.noteDate}>
                {new Date(note.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
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
            numberOfLines={6}
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={() => setIsExamMode(!isExamMode)}
            style={[
              styles.examModeButton,
              {
                backgroundColor: isExamMode ? colors.primary : '#f0f0f0',
              },
            ]}
          >
            <Text style={{ color: isExamMode ? '#fff' : '#000' }}>
              Exam Mode
            </Text>
          </Button>
          <View style={styles.modalButtons}>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => setVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noteCard: {
    margin: 8,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  examModeTag: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  examModeText: {
    color: '#fff',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  examModeButton: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default NotesScreen; 