import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints, authApis } from '../../configs/APIs';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import IconButton from '../../components/IconButton'; // Import IconButton

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            const fetchOrders = async () => {
                try {
                    const response = await authApis(token).get(endpoints.userOrders);
                    setOrders(response.data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    }, [token]);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/(\.\d{2})/, '');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
                <Text style={styles.headerTitle}>Order History</Text>
            </View>
            {/* Order List */}
            <FlatList
                data={orders}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.orderItem}
                        onPress={() => {
                            console.log('Navigating to DeliveryStatus with orderId:', item.id);
                            navigation.navigate('DeliveryStatus', {
                                orderId: item.id,
                                status: item.status,
                                createdAt: item.created_at,
                                id: item.id
                            });
                        }}
                    >
                        <Text style={styles.orderId}>Order ID: {item.id}</Text>
                        <Text style={styles.orderAmount}>Total Amount: {formatCurrency(item.total_amount)}</Text>
                        <Text style={styles.orderStatus}>Status: {item.status}</Text>
                        <Text style={styles.orderDate}>Order Date: {new Date(item.created_at).toLocaleDateString()}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ height: 200 }} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    backIcon: {
        width: 25,
        height: 25,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.primary,
        flex: 1,
    },
    orderItem: {
        padding: SIZES.padding,
        marginVertical: SIZES.radius,
        backgroundColor: COLORS.lightGray2,
        borderRadius: SIZES.radius,
    },
    orderId: {
        ...FONTS.h3,
        marginBottom: SIZES.base,
    },
    orderAmount: {
        ...FONTS.body4,
        color: COLORS.gray,
        marginBottom: SIZES.base,
    },
    orderStatus: {
        ...FONTS.body4,
        color: COLORS.gray,
        marginBottom: SIZES.base,
    },
    orderDate: {
        ...FONTS.body4,
        color: COLORS.gray,
    },
});

export default OrderHistory;