import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { COLORS, FONTS, SIZES, icons } from "../../constants";
import TextButton from "../../components/TextButton";
import { MyUserContext } from "../../configs/MyUserContext";
import { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkout = ({ route, navigation }) => {
    const { store, quantities, total } = route.params;
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [token, setToken] = useState(null);
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
            console.log('Stored Token:', storedToken); // Log the stored token to ensure it's being retrieved correctly
        };

        fetchToken();

        // Log the data received from route.params
        console.log('Store:', store);
        console.log('Quantities:', quantities);
        console.log('Total:', total);
    }, [store, quantities, total]);

    const renderSelectedFoods = () => {
        return Object.keys(quantities).map((foodId) => {
            const food = store.foods.find((item) => item.id === parseInt(foodId));
            if (!food) return null;

            return (
                <View key={food.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SIZES.base }}>
                    <Text style={{ ...FONTS.body3 }}>{food.name} x {quantities[food.id]}</Text>
                    <Text style={{ ...FONTS.body3 }}>{food.price * quantities[food.id]} VNĐ</Text>
                </View>
            );
        });
    };

    const handleConfirmOrder = async () => {
        if (!selectedPayment) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        const orderItems = Object.keys(quantities).map(foodId => {
            const food = store.foods.find((item) => item.id === parseInt(foodId));
            if (!food) {
                console.error(`Food item with ID ${foodId} does not exist.`);
                return null;
            }
            return {
                menu_item: parseInt(foodId),
                quantity: quantities[foodId]
            };
        }).filter(item => item !== null);

        if (orderItems.length === 0) {
            alert("Không có món ăn hợp lệ để đặt hàng.");
            return;
        }

        const orderData = {
            user: user.id, // Ensure user ID is included
            store: store.id,
            total_amount: total.toString(), // Convert total to string
            payment_method: selectedPayment,
            order_items: orderItems
        };

        try {
            const response = await authApis(token).post(endpoints.createOrder, orderData);
            if (response.status === 201) {
                navigation.replace("Success");
            }
        } catch (error) {
            console.error('Error response:', error.response); // Log the error response for debugging
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
            <View style={{ marginBottom: SIZES.padding }}>
                <Text style={{ ...FONTS.h3, marginBottom: SIZES.base }}>Cửa hàng</Text>
                <View style={{ flexDirection: "row", alignItems: "center", padding: SIZES.radius, borderWidth: 1, borderColor: COLORS.gray2, borderRadius: SIZES.radius }}>
                    <Image source={{ uri: `https://nguyenmax007.pythonanywhere.com${store.owner_avatar}` }} style={{ width: 24, height: 24, marginRight: SIZES.radius }} />
                    <Text style={{ flex: 1, ...FONTS.body3 }}>{store.name}</Text>
                </View>
            </View>

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