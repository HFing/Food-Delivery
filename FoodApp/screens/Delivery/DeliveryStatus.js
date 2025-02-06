import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView
} from 'react-native';

import { Header2, Linedevider, TextButton } from '../../components'
import { FONTS, COLORS, SIZES, icons, constants } from '../../constants';

const DeliveryStatus = ({ route, navigation }) => {
    const { orderId, status, createdAt, id } = route.params; // Nhận tham số orderId, status, createdAt và id từ route


    const [currentStep, setCurrentStep] = React.useState(() => {
        switch (status) {
            case 'pending':
                return 0;
            case 'confirmed':
                return 1;
            case 'shipped':
                return 2;
            default:
                return 0;
        }
    });

    const renderHeader = () => {
        return (
            <Header2
                title="DELIVERY STATUS"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.padding,
                    marginTop: 40
                }}
            />
        )
    }

    const renderInfo = () => {
        return (
            <View style={{
                marginTop: SIZES.radius,
                paddingHorizontal: SIZES.padding
            }}>
                <Text style={{ textAlign: 'center', color: COLORS.gray, ...FONTS.body4 }}>
                    Estimated Delivery
                </Text>
                <Text style={{ textAlign: 'center', ...FONTS.h2 }}>{new Date(createdAt).toLocaleDateString()}</Text>
            </View>
        )
    }

    const renderTrackOrder = () => {
        const trackOrderStatus = [
            { title: 'Pending', sub_title: 'Chưa xác nhận' },
            { title: 'Confirmed', sub_title: 'Đã xác nhận' },
            { title: 'Shipped', sub_title: 'Đã vận chuyển' }
        ];

        return (
            <View style={{
                marginTop: SIZES.padding,
                paddingVertical: SIZES.padding,
                borderRadius: SIZES.radius,
                borderWidth: 2,
                borderColor: COLORS.lightGray2,
                backgroundColor: COLORS.white2
            }}>
                {/* Track order */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    paddingHorizontal: SIZES.padding
                }}>
                    <Text style={{ ...FONTS.h3 }}>Track Order</Text>
                    <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>{id}</Text>
                </View>

                <Linedevider lineStyle={{ backgroundColor: COLORS.lightGray2 }} />

                {/* Status */}
                <View style={{ marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}>
                    {trackOrderStatus.map((item, index) => {
                        return (
                            <View key={`StatusList-${index}`}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: -5
                                }}>
                                    <Image
                                        source={icons.check_circle}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            tintColor: index <= currentStep
                                                ? COLORS.primary : COLORS.lightGray1
                                        }}
                                    />

                                    <View style={{ marginLeft: SIZES.radius }}>
                                        <Text style={{ ...FONTS.h3 }}>{item.title}</Text>
                                        <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>{item.sub_title}</Text>
                                    </View>
                                </View>

                                {index < trackOrderStatus.length - 1 &&
                                    <View>
                                        {index < currentStep &&
                                            <View style={{
                                                height: 50,
                                                width: 3,
                                                marginLeft: 18,
                                                backgroundColor: COLORS.primary,
                                                zIndex: -1
                                            }}>
                                            </View>
                                        }

                                        {index >= currentStep &&
                                            <Image
                                                source={icons.dotted_line}
                                                resizeMode="cover"
                                                style={{
                                                    width: 4,
                                                    height: 50,
                                                    marginLeft: 17
                                                }}
                                            />
                                        }
                                    </View>
                                }
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            <View style={{
                marginTop: SIZES.radius,
                marginBottom: SIZES.padding
            }}>
                {currentStep < 2 &&
                    <View style={{
                        flexDirection: 'row',
                        height: 55
                    }}>
                        {/* Cancel */}
                        <TextButton
                            buttonContainerStyle={{
                                flex: 1,
                                borderRadius: SIZES.base,
                                backgroundColor: COLORS.lightGray2
                            }}
                            label="Home"
                            labelStyle={{
                                color: COLORS.primary
                            }}
                            onPress={() => navigation.navigate("Home")}
                        />
                    </View>
                }
                {currentStep >= 2 &&
                    <TextButton
                        buttonContainerStyle={{
                            height: 55,
                            borderRadius: SIZES.base
                        }}
                        label="DONE"
                        onPress={() => navigation.navigate("Home")}
                    />
                }
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: SIZES.padding,
                backgroundColor: COLORS.white
            }}
        >
            {/* Header */}
            {renderHeader()}
            {/* Info */}
            {renderInfo()}
            {/* Track Order */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderTrackOrder()}
            </ScrollView>
            {/* Footer */}
            {renderFooter()}
        </View>
    )
}

export default DeliveryStatus;