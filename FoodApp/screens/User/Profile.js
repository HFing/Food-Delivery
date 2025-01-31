import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { icons, COLORS, SIZES } from '../../constants';
import { IconButton } from '../../components';

const ProfileScreen = () => {
    const navigation = useNavigation();
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
                <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                <Text style={styles.profileName}>John Snow</Text>
                <Text style={styles.profileBio}>A passionate software developer.</Text>
            </View>
            {/* Profile Details */}
            <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Email</Text>
                <Text style={styles.detailText}>john.snow@example.com</Text>

                <Text style={styles.detailTitle}>Phone</Text>
                <Text style={styles.detailText}>+123 456 7890</Text>

                <Text style={styles.detailTitle}>Location</Text>
                <Text style={styles.detailText}>Winterfell, Westeros</Text>
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