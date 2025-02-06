import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { HorizontalFoodCard, VerticalFoodCard } from '../../components';
import { useNavigation } from '@react-navigation/native';
import axios, { endpoints } from '../../configs/APIs'; // Import axios and endpoints from APIs.js

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
  const [recommended, setRecommended] = React.useState([]);
  const [popular, setPopular] = React.useState([]);
  const [menuList, setMenuList] = React.useState([]);
  const [showFilterModel, setShowFilterModel] = React.useState(false);
  const [loading, setLoading] = React.useState(true); // State to track loading
  const [searchQuery, setSearchQuery] = React.useState(''); // State to track search query
  const [searchResults, setSearchResults] = React.useState([]); // State to track search results

  const navigation = useNavigation();

  useEffect(() => {
    loadPopularFoods();
    loadStores();
  }, []);

  const loadPopularFoods = async () => {
    try {
      let res = await axios.get(endpoints.popularFoods);
      setPopular(res.data);
    } catch (error) {
      console.error('Error fetching popular foods:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const loadStores = async () => {
    try {
      let res = await axios.get(endpoints.stores);
      setRecommended(res.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      let res = await axios.get(endpoints.searchFoods, {
        params: {
          query: searchQuery
        }
      });
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setLoading(false);
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
          marginTop: 50,
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
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
              onPress={() => navigation.navigate("StoreDetail", { storeId: item.store })}
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
          data={recommended}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                height: 200,
                width: SIZES.width * 0.9,
                marginLeft: index === 0 ? SIZES.padding : 18,
                marginRight: index === recommended.length - 1 ? SIZES.padding : 0,
                padding: 15,
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 6,
              }}
              onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
            >
              {/* Hình ảnh của cửa hàng */}
              <Image
                source={{ uri: `https://nguyenmax007.pythonanywhere.com${item.owner_avatar}` }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
              {/* Tên cửa hàng */}
              <Text style={{ ...FONTS.h3, fontWeight: 'bold', marginBottom: 3 }}>{item.name}</Text>
              {/* Đánh giá và khoảng cách */}
              <Text style={{ ...FONTS.body4, color: COLORS.gray }}>
                ⭐ {item.rating || '4.5'} · {item.distance || '1.2km'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Section>
    );
  }

  function renderSearchResults() {
    if (searchResults.length === 0) {
      return null;
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
            item={{
              ...item,
              image: `https://nguyenmax007.pythonanywhere.com${item.image}` // Đảm bảo URL hình ảnh được định dạng đúng
            }}
            onPress={() => navigation.navigate("StoreDetail", { storeId: item.store })}
          />
        )}
        ListFooterComponent={<View style={{ height: 200 }} />}
      />
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
      {searchResults.length > 0 ? (
        renderSearchResults()
      ) : (
        <FlatList
          data={menuList}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
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
                onPress={() => navigation.navigate("StoreDetail", { storeId: item.storeId })}
              />
            );
          }}
          ListFooterComponent={
            <View style={{ height: 200 }} />
          }
        />
      )}
    </View>
  );
};

export default Home;