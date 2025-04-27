import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    imageUrl: string;
  };
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: category.imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: Layout.borderRadius.medium,
    marginRight: Layout.spacing.m,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    padding: Layout.spacing.s,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});