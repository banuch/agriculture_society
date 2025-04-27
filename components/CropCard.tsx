import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { MapPin, Phone } from 'lucide-react-native';

interface CropCardProps {
  crop: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    imageUrl: string;
    farmer: {
      name: string;
      location: {
        pincode: string;
      };
    };
  };
  onPress: () => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: crop.imageUrl }} style={styles.image} />
      
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.name}>{crop.name}</Text>
          <Text style={styles.price}>₹{crop.price}/{crop.unit}</Text>
          <Text style={styles.quantity}>Available: {crop.quantity} {crop.unit}</Text>
        </View>
        
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{crop.farmer.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.light.textSecondary} />
            <Text style={styles.pincode}>{crop.farmer.location.pincode}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.callButton}>
        <Phone size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: Layout.borderRadius.medium,
    borderBottomLeftRadius: Layout.borderRadius.medium,
  },
  contentContainer: {
    flex: 1,
    padding: Layout.spacing.m,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Layout.spacing.xs,
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.light.primary,
    marginBottom: Layout.spacing.xs,
  },
  quantity: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  farmerInfo: {
    marginTop: Layout.spacing.s,
    paddingTop: Layout.spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  farmerName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pincode: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  callButton: {
    backgroundColor: Colors.light.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: Layout.spacing.m,
    bottom: Layout.spacing.m,
  },
});