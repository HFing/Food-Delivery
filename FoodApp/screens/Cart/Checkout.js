import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { COLORS, FONTS, SIZES, icons } from "../../constants";
import TextButton from "../../components/TextButton";
import { MyUserContext } from "../../configs/MyUserContext";
import { authApis, endpoints, BASE_URL } from "../../configs/APIs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Checkout = ({ route, navigation }) => {
    const { storeId, quantities, total } = route.params;
    const [storeDetails, setStoreDetails] = useState(null);
    const [foods, setFoods] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [token, setToken] = useState(null);
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
        fetchStoreDetails();
        fetchSelectedFoods();
    }, [storeId, quantities, total]);

    const fetchStoreDetails = async () => {
        const url = `https://nguyenmax007.pythonanywhere.com${endpoints.storeDetails(storeId)}`;
        try {
            let res = await axios.get(url);
            setStoreDetails(res.data);
        } catch (error) {
            console.error('Error fetching store details:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const fetchSelectedFoods = async () => {
        const foodIds = Object.keys(quantities);
        const foodDetailsPromises = foodIds.map(foodId => {
            const url = `https://nguyenmax007.pythonanywhere.com${endpoints.foodDetails(foodId)}`;
            return axios.get(url);
        });

        try {
            const foodDetailsResponses = await Promise.all(foodDetailsPromises);
            const foodsData = foodDetailsResponses.map(response => response.data);
            setFoods(foodsData);
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    };

    const renderSelectedFoods = () => {
        return foods.map((food) => {
            const quantity = quantities[food.id];
            return (
                <View key={food.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SIZES.base }}>
                    <Text style={{ ...FONTS.body3 }}>{food.name} x {quantity}</Text>
                </View>
            );
        });
    };

    const handleConfirmOrder = async () => {
        if (!selectedPayment) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (!storeDetails) {
            alert("Dữ liệu cửa hàng không hợp lệ. Vui lòng thử lại.");
            return;
        }

        const orderItems = foods.map(food => ({
            food_item: food.id,
            quantity: quantities[food.id]
        }));

        const orderData = {
            user: user.id,
            store: parseInt(storeId, 10), // Ép kiểu storeId thành số nguyên
            total_amount: total.toString(),
            payment_method: selectedPayment,
            status: "pending",
            order_items: orderItems
        };

        try {
            const response = await authApis(token).post(endpoints.createOrder, orderData);
            if (response.status === 201) {
                navigation.replace("Success");
            } else {
                console.error('Failed to create order:', response.data);
                alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Error response:', error.response);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: SIZES.padding, backgroundColor: COLORS.white }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding }}>
                <TouchableOpacity
                    style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: SIZES.radius,
                        borderColor: COLORS.gray2,
                        marginRight: SIZES.padding,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.gray2,
                        }}
                    />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h2, textAlign: "center", flex: 1 }}>Thanh toán</Text>
                <View style={{ width: 40 }} /> {/* Placeholder for alignment */}
            </View>

            {/* Payment Methods */}
            <View style={{ marginBottom: SIZES.padding }}>
                <Text style={{ ...FONTS.h3, marginBottom: SIZES.base }}>Phương thức thanh toán</Text>

                {/* Thanh toán khi nhận hàng */}
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: SIZES.radius,
                        borderWidth: 1,
                        borderColor: selectedPayment === "cash" ? COLORS.primary : COLORS.gray2,
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.base,
                        backgroundColor: selectedPayment === "cash" ? COLORS.lightGray1 : COLORS.white,
                    }}
                    onPress={() => setSelectedPayment("cash")}
                >
                    <Image source={icons.cash} style={{ width: 24, height: 24, marginRight: SIZES.radius }} />
                    <Text style={{ flex: 1, ...FONTS.body3 }}>Thanh toán khi nhận hàng</Text>
                    {selectedPayment === "cash" && <Image source={icons.check} style={{ width: 20, height: 20, tintColor: COLORS.primary }} />}
                </TouchableOpacity>

                {/* VNPay */}
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: SIZES.radius,
                        borderWidth: 1,
                        borderColor: selectedPayment === "vnpay" ? COLORS.primary : COLORS.gray2,
                        borderRadius: SIZES.radius,
                        backgroundColor: selectedPayment === "vnpay" ? COLORS.lightGray1 : COLORS.white,
                    }}
                    onPress={() => setSelectedPayment("vnpay")}
                >
                    <Image source={icons.vnpay} style={{ width: 24, height: 24, marginRight: SIZES.radius }} />
                    <Text style={{ flex: 1, ...FONTS.body3 }}>Thanh toán qua VNPay</Text>
                    {selectedPayment === "vnpay" && <Image source={icons.check} style={{ width: 20, height: 20, tintColor: COLORS.primary }} />}
                </TouchableOpacity>
            </View>

            {/* Store Information */}
            {storeDetails && (
                <View style={{ marginBottom: SIZES.padding }}>
                    <Text style={{ ...FONTS.h3, marginBottom: SIZES.base }}>Cửa hàng</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", padding: SIZES.radius, borderWidth: 1, borderColor: COLORS.gray2, borderRadius: SIZES.radius }}>
                        <Image source={{ uri: `https://nguyenmax007.pythonanywhere.com${storeDetails?.owner_avatar}` }} style={{ width: 24, height: 24, marginRight: SIZES.radius }} />
                        <Text style={{ flex: 1, ...FONTS.body3 }}>{storeDetails?.name}</Text>
                    </View>
                </View>
            )}

            {/* Selected Foods */}
            <View style={{ marginBottom: SIZES.padding }}>
                <Text style={{ ...FONTS.h3, marginBottom: SIZES.base }}>Các món đã chọn</Text>
                {renderSelectedFoods()}
            </View>

            {/* Order Summary */}
            <View style={{ marginBottom: SIZES.padding }}>
                <Text style={{ ...FONTS.h3, marginBottom: SIZES.base }}>Tóm tắt đơn hàng</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SIZES.base }}>
                    <Text style={{ ...FONTS.body3 }}>Tổng phụ</Text>
                    <Text style={{ ...FONTS.body3 }}>{total} VNĐ</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SIZES.base }}>
                    <Text style={{ ...FONTS.body3 }}>Phí vận chuyển</Text>
                    <Text style={{ ...FONTS.body3 }}>₫0.00</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: SIZES.radius }}>
                    <Text style={{ ...FONTS.h3 }}>Tổng cộng</Text>
                    <Text style={{ ...FONTS.h3 }}>{total} VNĐ</Text>
                </View>
            </View>

            {/* Confirm Order Button */}
            <TextButton
                label="Xác nhận đặt hàng"
                buttonContainerStyle={{ height: 55, alignItems: "center", borderRadius: SIZES.radius, backgroundColor: COLORS.primary }}
                onPress={handleConfirmOrder}
            />
        </ScrollView>
    );
};

export default Checkout;