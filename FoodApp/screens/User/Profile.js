import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { icons, COLORS, SIZES } from '../../constants';
import { IconButton } from '../../components';
import { MyUserContext, MyDispatchContext } from '../../configs/MyUserContext';
import { BASE_URL, authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const [username, setUsername] = useState(user?.username || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [avatar, setAvatar] = useState('https://nguyenmax007.pythonanywhere.com' + `${user.avatar}`);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChooseAvatar = () => {
        console.log('Choose Avatar');
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                setAvatar(response.assets[0].uri);
                handleSaveAvatar(response.assets[0].uri);
            }
        });
    };

    const handleSaveAvatar = async (newAvatar) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', {
                uri: newAvatar,
                type: 'image/jpeg',
                name: 'avatar.jpg'
            });

            const res = await authApis(token).put('/users/update-avatar/', formData);
            dispatch({ type: 'update', payload: res.data });
            setAvatar(newAvatar); // Update local state
            Alert.alert('Success', 'Avatar updated successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update avatar');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const data = {
                username: username,
                first_name: firstName,
                last_name: lastName
            };

            const res = await authApis(token).put('/users/update/', data);
            dispatch({ type: 'update', payload: res.data });
            setUsername(res.data.username); // Update local state
            setFirstName(res.data.first_name); // Update local state
            setLastName(res.data.last_name); // Update local state
            Alert.alert('Success', 'Profile updated successfully');
            setModalVisible(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
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
                    onPress={() => navigation.replace('')}
                />
                <Text style={styles.headerTitle}>PROFILE</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.editText}>✎</Text>
                </TouchableOpacity>
            </View>
            {/* Profile Info */}
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={handleChooseAvatar}>
                    <Image source={{ uri: avatar }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
            </View>
            {/* Profile Details */}
            <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>First Name</Text>
                <Text style={styles.detailText}>{firstName}</Text>

                <Text style={styles.detailTitle}>Last Name</Text>
                <Text style={styles.detailText}>{lastName}</Text>

                <Text style={styles.detailTitle}>Username</Text>
                <Text style={styles.detailText}>{username}</Text>
            </View>
            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('OnBoarding')}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            {loading && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalView, { width: width * 0.8 }]}>
                        <Text style={styles.modalText}>Edit Profile</Text>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First Name"
                        />
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last Name"
                        />
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleSaveProfile}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        textAlign: 'center',
        marginVertical: 5,
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
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonClose: {
        backgroundColor: '#FF6F42',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
    },
});

export default ProfileScreen;