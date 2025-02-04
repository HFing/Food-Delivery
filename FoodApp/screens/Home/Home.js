import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { FONTS, SIZES, COLORS, icons, dummyData } from '../../constants';
import { HorizontalFoodCard, VerticalFoodCard } from '../../components';
import { useNavigation } from '@react-navigation/native';

import FilterModel from './FilterModel';

const Section = ({ title, onPress, children }) => {
  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: SIZES.padding,
          marginTop: 30,
          marginBottom: 20,
        }}>
        <Text style={{ flex: 1, ...FONTS.h3 }}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: COLORS.primary, ...FONTS.body3 }}>Show all</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      {children}
    </View>
  );
};

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(1);
  const [selectedMenuType, setSelectedMenuType] = React.useState(1);
  const [recommended, setRecommended] = React.useState([]);
  const [popular, setPopular] = React.useState([]);
  const [menuList, setMenuList] = React.useState([]);
  const [showFilterModel, setShowFilterModel] = React.useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchPopularFoods();

  }, []);

  const fetchPopularFoods = async () => {
    try {
      const response = await fetch('https://nguyenmax007.pythonanywhere.com/foods/random-foods/');
      const data = await response.json();
      setPopular(data);
    } catch (error) {
      console.error('Error fetching popular foods:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);
  const fetchStores = async () => {
    try {
      const response = await fetch('https://nguyenmax007.pythonanywhere.com/stores/'); // Replace with actual API endpoint
      const data = await response.json();
      setRecommended(data); // Update recommended state with store data
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleChangeCategory = (categotyId, menuTypeId) => {
    //   Retrive the popular
    let selectedPopular = dummyData.menu.find((a) => a.name == 'Popular');
    // Retrive the recommended menu
    let selectedRecommend = dummyData.menu.find((a) => a.name == 'Recommended');
    // find the menu based on the menuTypeId
    let selectedMenu = dummyData.menu.find((a) => a.id == menuTypeId);
    // set popular menu based on categoryid
    setPopular(
      selectedPopular?.list.filter((a) => a.categories.includes(categotyId)),
    );
    //set the recommended menu based on the categoryid
    setRecommended(
      selectedRecommend?.list.filter((a) => a.categories.includes(categotyId)),
    );
    // set the menu based on the categoryid
    setMenuList(
      selectedMenu?.list.filter((a) => a.categories.includes(categotyId)),
    );
  };

  // render Search
  function renderSearch() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          marginVertical: SIZES.radius,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
          marginTop: 10, // Thêm khoảng cách 10px từ đỉnh màn hình
        }}>
        {/* menu icon */}
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={icons.menu}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.black,
            }}
          />
        </TouchableOpacity>
        {/* icon */}
        <Image
          source={icons.search}
          style={{ height: 20, width: 20, tintColor: COLORS.black }}
        />
        {/* text input */}
        <TextInput
          style={{ flex: 1, marginLeft: SIZES.radius, ...FONTS.body3 }}
          placeholder="Search food..."
        />
        {/* filter button */}
        <TouchableOpacity onPress={() => setShowFilterModel(true)}>
          <Image
            source={icons.filter}
            style={{ height: 20, width: 20, tintColor: COLORS.black }}
          />
        </TouchableOpacity>
      </View>
    );
  }



  function renderPopular() {
    return (
      <Section title="Hot Food Near You" onPress={() => console.log('show all')}>
        <FlatList
          data={popular}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <VerticalFoodCard
              containerStyle={{
                marginLeft: index == 0 ? SIZES.padding : 18,
                padding: 18,
                marginRight: index == popular.length - 1 ? SIZES.padding : 0,
              }}
              item={item}
              onPress={() => navigation.navigate("FoodDetail", { item })}
            />
          )}
        />
      </Section>
    );
  }

  function renderRecommendedSection() {
    return (
      <Section title="Stores Near You" onPress={() => console.log('Show all stores')}>
        <FlatList
          data={recommended} // Store data
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                height: 180,
                width: SIZES.width * 0.85,
                marginLeft: index === 0 ? SIZES.padding : 18,
                marginRight: index === recommended.length - 1 ? SIZES.padding : 0,
                paddingRight: SIZES.radius,
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
              }}
              onPress={() => navigation.navigate('StoreDetail', { item })} // Navigate to store details
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  marginTop: 15,
                  height: 120,
                  width: 120,
                  borderRadius: SIZES.radius,
                }}
              />
              <Text style={{ ...FONTS.h3, marginTop: 5 }}>{item.name}</Text>
              <Text style={{ ...FONTS.body4, color: COLORS.gray }}>{item.location}</Text>
            </TouchableOpacity>
          )}
        />
      </Section>
    );
  }



  function renderDelivaryTo() {
    return (
      <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
        <Text style={{ color: COLORS.primary, ...FONTS.body3 }}> DEIVERY TO</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: SIZES.base,
            alignItems: 'center',
          }}>
          <Text style={{ ...FONTS.h3 }}>{dummyData?.myProfile?.address}</Text>
          <Image style={{ marginLeft: SIZES.base, height: 20, width: 20 }} source={icons.down_arrow} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* Search */}
      {renderSearch()}
      {/* Filter */}
      {showFilterModel &&
        <FilterModel isVisible={showFilterModel} onClose={() => setShowFilterModel(false)} />
      }
      {/* List */}
      <FlatList
        data={menuList}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Delivary to */}
            {renderDelivaryTo()}
            {/* Popular */}
            {renderPopular()}
            {/* recommended */}
            {renderRecommendedSection()}

          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <HorizontalFoodCard
              containerStyle={{
                height: 130,
                alignItems: 'center',
                marginHorizontal: SIZES.padding,
                marginBottom: SIZES.radius,
              }}
              imageStyle={{
                marginTop: 20,
                height: 110,
                width: 110,
              }}
              item={item}
              onPress={() => console.log('ok')}
            />
          );
        }}
        ListFooterComponent={
          <View style={{ height: 200 }} />
        }
      />
    </View>
  );
};

export default Home;