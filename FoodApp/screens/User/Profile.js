import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { icons, COLORS, SIZES } from '../../constants';
import { IconButton } from '../../components';
import { MyUserContext, MyDispatchContext } from '../../configs/MyUserContext';
import { BASE_URL, authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const [avatar, setAvatar] = useState('https://nguyenmax007.pythonanywhere.com' + `${user.avatar}`);

    const handleChooseAvatar = () => {
        launchImageLibrary({ noData: true }, (response) => {
            if (response.assets) {
                setAvatar(response.assets[0].uri);
                handleSaveAvatar(response.assets[0].uri);
            }
        });
    };

    const handleSaveAvatar = async (newAvatar) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', {
                uri: newAvatar,
                type: 'image/jpeg',
                name: 'avatar.jpg'
            });

            const res = await authApis(token).put(endpoints['current-user'], formData);
            dispatch({ type: 'update', payload: res.data });
            Alert.alert('Success', 'Avatar updated successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update avatar');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon={icons.back}
                    containerStyle={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: SIZES.radius,
                        borderColor: COLORS.gray2,
                    }}
                    iconStyle={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.gray2,
                    }}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle}>PROFILE</Text>
                <TouchableOpacity>
                    <Text style={styles.editText}>✎</Text>
                </TouchableOpacity>
            </View>
            {/* Profile Info */}
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={handleChooseAvatar}>
                    <Image source={{ uri: avatar }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.profileName}>{`${user?.first_name || ''} ${user?.last_name || ''}`}</Text>
                <Text style={styles.profileBio}>{user?.email || ''}</Text>
            </View>
            {/* Profile Details */}
            <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Email</Text>
                <Text style={styles.detailText}>{user?.email || ''}</Text>

                <Text style={styles.detailTitle}>Username</Text>
                <Text style={styles.detailText}>{user?.username || ''}</Text>
            </View>
            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('OnBoarding')}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editText: {
        fontSize: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    profileBio: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginHorizontal: 30,
    },
    detailSection: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    detailText: {
        fontSize: 14,
        color: 'gray',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#FF6F42',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    }
});

export default ProfileScreen;