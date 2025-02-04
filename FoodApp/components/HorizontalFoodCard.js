import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS, SIZES, COLORS } from '../constants';

const HorizontalFoodCard = ({ containerStyle, imageStyle, item, onPress }) => {
  return (
    <TouchableOpacity style={{ ...styles.card, ...containerStyle }} onPress={onPress}>
      <Image source={{ uri: item.image }} style={{ ...styles.image, ...imageStyle }} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>{parseInt(item.price)} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: SIZES.padding,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: SIZES.radius,
    borderBottomLeftRadius: SIZES.radius,
  },
  info: {
    flex: 1,
    padding: SIZES.padding,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    marginVertical: SIZES.base,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
});

export default HorizontalFoodCard;