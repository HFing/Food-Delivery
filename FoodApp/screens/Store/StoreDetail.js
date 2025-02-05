import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios, { endpoints } from '../../configs/APIs';
import { StepperInput, TextButton } from '../../components'; // Import StepperInput and TextButton

const StoreDetail = () => {
  const [store, setStore] = useState(null);
  const [menus, setMenus] = useState([]);
  const [foods, setFoods] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { storeId } = route.params;

  useEffect(() => {
    loadStoreDetails();
    loadStoreMenus();
  }, []);

  const loadStoreDetails = async () => {
    try {
      let res = await axios.get(endpoints.storeDetails(storeId));
      setStore(res.data);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const loadStoreMenus = async () => {
    try {
      console.log('Fetching store foods...');
      let res = await axios.get(endpoints.storeFoods(storeId));
      console.log('Store foods fetched:', res.data);

      const menuIds = [...new Set(res.data.map(food => food.menu))].filter(menuId => menuId !== null);
      console.log('Menu IDs:', menuIds);

      const menuPromises = menuIds.map(menuId => {
        console.log(`Fetching menu details for menu ID: ${menuId}`);
        return axios.get(endpoints.menuDetails(menuId));
      });

      const menuResponses = await Promise.all(menuPromises);
      console.log('Menu responses:', menuResponses);

      const menusWithFoods = menuResponses.map(menuRes => ({
        ...menuRes.data,
        foods: res.data.filter(food => food.menu === menuRes.data.id),
      }));
      console.log('Menus with Foods:', menusWithFoods);

      const foodsWithoutMenu = res.data.filter(food => food.menu === null);
      console.log('Foods without Menu:', foodsWithoutMenu);

      setMenus(menusWithFoods);
      setFoods(foodsWithoutMenu);
    } catch (error) {
      console.error('Error fetching store menus:', error);
    }
  };

  const handleQuantityChange = (id, change) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (!newQuantities[id]) {
        newQuantities[id] = 0;
      }
      newQuantities[id] += change;
      if (newQuantities[id] < 0) {
        newQuantities[id] = 0;
      }
      console.log('Quantities:', newQuantities); // Log quantities
      return newQuantities;
    });
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  const calculateTotal = () => {
    const totalFoods = foods.reduce((total, item) => {
      const quantity = quantities[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);

    const totalMenus = menus.reduce((total, menu) => {
      return total + menu.foods.reduce((menuTotal, item) => {
        const quantity = quantities[item.id] || 0;
        return menuTotal + (item.price * quantity);
      }, 0);
    }, 0);

    const total = totalFoods + totalMenus;
    console.log('Total:', total); // Log total
    return total;
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

  const renderFoods = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginBottom: SIZES.padding,
          paddingHorizontal: SIZES.padding,
        }}
        onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
      >
        <Image
          source={{ uri: `https://nguyenmax007.pythonanywhere.com${item.image}` }}
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
            {truncateDescription(item.description, 100)}
          </Text>
          <Text style={{ ...FONTS.h3, marginTop: SIZES.base }}>{Math.round(item.price)} VNĐ</Text>
          <Text style={{ ...FONTS.body4, color: COLORS.gray, marginTop: SIZES.base }}>
            Số lượng: {quantities[item.id] || 0}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SIZES.base }}>
            <StepperInput
              value={quantities[item.id] || 0}
              onAdd={() => handleQuantityChange(item.id, 1)}
              onMinus={() => handleQuantityChange(item.id, -1)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMenu = ({ item }) => {
    return (
      <View>
        <Text style={{ ...FONTS.h2, marginHorizontal: SIZES.padding, marginTop: SIZES.padding }}>
          {item.name}
        </Text>
        <FlatList
          data={item.foods}
          keyExtractor={(food) => food.id.toString()}
          renderItem={renderFoods}
          contentContainerStyle={{ paddingBottom: SIZES.padding }}
        />
      </View>
    );
  };

  const renderFooter = () => {
    const total = calculateTotal();
    const hasItems = Object.values(quantities).some(quantity => quantity > 0);

    if (!hasItems) {
      return null;
    }

    const checkoutData = { store: { ...store, foods: [...foods, ...menus.flatMap(menu => menu.foods)] }, quantities, total };
    console.log('Checkout Data:', checkoutData); // Log checkout data

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          height: 120,
          alignItems: 'center',
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.radius,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
        }}>
        <Text style={{ ...FONTS.h2, flex: 1 }}>Total: {Math.round(total)} VNĐ</Text>
        <TextButton
          buttonContainerStyle={{
            flex: 1,
            flexDirection: 'row',
            height: 60,
            marginLeft: SIZES.radius,
            paddingHorizontal: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          label="Thanh Toán"
          onPress={() => {
            console.log('Navigating to Checkout with data:', checkoutData); // Log data before navigating
            navigation.navigate("Checkout", checkoutData);
          }}
        />
      </View>
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
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderStoreInfo}
        renderItem={renderMenu}
        ListFooterComponent={() => (
          <View>
            {foods.length > 0 && (
              <View>
                <Text style={{ ...FONTS.h2, marginHorizontal: SIZES.padding, marginTop: SIZES.padding }}>
                  Other Foods
                </Text>
                <FlatList
                  data={foods}
                  keyExtractor={(food) => food.id.toString()}
                  renderItem={renderFoods}
                  contentContainerStyle={{ paddingBottom: SIZES.padding }}
                />
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
      {renderFooter()}
    </View>
  );
};

export default StoreDetail;