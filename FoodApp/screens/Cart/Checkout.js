import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { COLORS, FONTS, SIZES, icons } from "../../constants";
import TextButton from "../../components/TextButton";

const Checkout = ({ route, navigation }) => {
    const { store, quantities, total } = route.params;
    const [selectedPayment, setSelectedPayment] = useState(null);

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

    const handleConfirmOrder = () => {
        if (selectedPayment === "cod") {
            navigation.replace("Success");
        } else {
            alert("Vui lòng chọn phương thức thanh toán!");
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
                        borderColor: selectedPayment === "cod" ? COLORS.primary : COLORS.gray2,
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.base,
                        backgroundColor: selectedPayment === "cod" ? COLORS.lightGray1 : COLORS.white,
                    }}
                    onPress={() => setSelectedPayment("cod")}
                >
                    <Image source={icons.cash} style={{ width: 24, height: 24, marginRight: SIZES.radius }} />
                    <Text style={{ flex: 1, ...FONTS.body3 }}>Thanh toán khi nhận hàng</Text>
                    {selectedPayment === "cod" && <Image source={icons.check} style={{ width: 20, height: 20, tintColor: COLORS.primary }} />}
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