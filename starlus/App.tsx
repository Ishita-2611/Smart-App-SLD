import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window'); // Screen width for menu slide animation

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0]; // Slide animation for menu

  const menuItems = [
    { key: 'Speech to Text' },
    { key: 'Handwriting Recognition' },
    { key: 'Multilingual' },
    { key: 'Notes' },
    { key: 'Calculator' },
  ];

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width : 0, // Slide out or in
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuOpen(!menuOpen);
    });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSignUp(false); // Reset to Sign-In screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>
            {isSignUp ? 'Create an Account' : 'Welcome Back!'}
          </Text>

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {isSignUp ? 'REGISTER' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleMenu}>
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
            <Text style={styles.greeting}>Hey StudentXYZ</Text>
            <Image
              style={styles.profileImage}
              source={{
                uri: 'https://via.placeholder.com/40',
              }}
            />
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textArea}>
            <Text>Write something here...</Text>
          </View>

          {/* Sliding Menu */}
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.menuTitle}>Menu</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  console.log(item.key);
                  toggleMenu(); // Close menu on selection
                }}
              >
                <Text style={styles.menuItemText}>{item.key}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0f6',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#eaf0f6',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#007BFF',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  mainContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#007BFF',
  },
  menuIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textArea: {
    flex: 1,
    margin: 20,
    backgroundColor: '#ADD8E6',
    borderRadius: 8,
    padding: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.8, // 80% width of the screen
    backgroundColor: '#fff',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;
