import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../screens/Home/Home';
import OnBoarding from '../screens/OnBoarding/OnBoarding';
import Profile from '../screens/User/Profile';
import { MyUserContext, MyDispatchContext } from '../configs/MyUserContext'; // Import MyUserContext và MyDispatchContext
import { BASE_URL } from '../configs/APIs'; // Import BASE_URL

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  console.log("User Context:", user);

  const avatarUrl = 'https://nguyenmax007.pythonanywhere.com' + `${user.avatar}`;


  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    dispatch({ type: 'logout' });
    navigation.replace('SignIn');
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.drawerContent}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.closeDrawer()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {/* User Profile Section */}
        <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>{user?.username || 'Guest'}</Text>
            <Text style={styles.profileText}>View Your Profile</Text>
          </View>
        </TouchableOpacity>
        {/* Menu Items */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>My Wallet</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Track Your Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Invite a Friend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Help Center</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const CustomDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FF6F42',
          width: 250,
        }
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="OnBoarding" component={OnBoarding} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FF6F42',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    fontSize: 24,
    color: 'white',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  profileText: {
    fontSize: 14,
    color: 'white',
  },
  drawerItem: {
    paddingVertical: 15,
  },
  drawerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default CustomDrawer;