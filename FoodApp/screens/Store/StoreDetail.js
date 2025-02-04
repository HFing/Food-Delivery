import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from '../../configs/APIs';

const StoreDetail = () => {
  const [store, setStore] = useState(null);
  const [foods, setFoods] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { storeId } = route.params;

  useEffect(() => {
    loadStoreDetails();
    loadStoreFoods();
  }, []);

  const loadStoreDetails = async () => {
    try {
      let res = await axios.get(`/stores/${storeId}/`);
      setStore(res.data);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const loadStoreFoods = async () => {
    try {
      let res = await axios.get(`/stores/${storeId}/foods/`);
      console.log('API response data:', res.data); // Ghi log dữ liệu trả về
      setFoods(res.data);
    } catch (error) {
      console.error('Error fetching store foods:', error);
    }
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 40,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: SIZES.radius,
            borderColor: COLORS.gray2,
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
        <Text style={{ flex: 1, textAlign: 'center', ...FONTS.h2 }}>Store Details</Text>
        <View style={{ width: 40 }} />
      </View>
    );
  };

  const renderStoreInfo = () => {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginBottom: SIZES.padding,
          paddingHorizontal: SIZES.padding,
        }}>
        <Image
          source={{ uri: `https://nguyenmax007.pythonanywhere.com${store?.owner_avatar}` }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: SIZES.radius,
          }}
          resizeMode="cover"
        />
        <Text style={{ ...FONTS.h1, marginTop: SIZES.padding }}>{store?.name}</Text>
        <Text style={{ ...FONTS.body3, color: COLORS.darkGray, marginTop: SIZES.base }}>
          {store?.description}
        </Text>
      </View>
    );
  };

  const renderFoods = () => {
    return (
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginBottom: SIZES.padding,
              paddingHorizontal: SIZES.padding,
            }}
            onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: SIZES.radius,
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: SIZES.radius }}>
              <Text style={{ ...FONTS.h3 }}>{item.name}</Text>
              <Text style={{ ...FONTS.body4, color: COLORS.gray, marginTop: SIZES.base }}>
                {item.description}
              </Text>
              <Text style={{ ...FONTS.h3, marginTop: SIZES.base }}>{item.price} VNĐ</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: SIZES.padding }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      <FlatList
        ListHeaderComponent={
          <View>
            {renderStoreInfo()}
          </View>
        }
        ListFooterComponent={
          <View>
            {renderFoods()}
          </View>
        }
      />
    </View>
  );
};

export default StoreDetail;