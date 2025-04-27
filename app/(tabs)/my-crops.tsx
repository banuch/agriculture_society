import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Plus, CircleAlert as AlertCircle } from 'lucide-react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { router } from 'expo-router';
import { CropCard } from '@/components/CropCard';

export default function MyCropsScreen() {
  const { user, userData } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCrops();
  }, [user]);

  const fetchMyCrops = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'crops'),
        where('farmerId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const cropsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setCrops(cropsData);
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert('Error', 'Failed to load your crops');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = () => {
    router.push('/add-crop');
  };

  const handleCropPress = (crop) => {
    router.push({
      pathname: `/crop-details/${crop.id}`,
      params: { id: crop.id, isOwner: true }
    });
  };

  // Sample crops for preview
  const sampleCrops = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      price: 40,
      quantity: 25,
      unit: 'kg',
      imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      farmer: {
        name: userData?.name || 'Farmer',
        location: {
          pincode: userData?.location?.pincode || '110001'
        }
      }
    },
    {
      id: '2',
      name: 'Fresh Potatoes',
      price: 30,
      quantity: 50,
      unit: 'kg',
      imageUrl: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
      farmer: {
        name: userData?.name || 'Farmer',
        location: {
          pincode: userData?.location?.pincode || '110001'
        }
      }
    }
  ];

  const cropsToDisplay = crops.length > 0 ? crops : sampleCrops;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Crops</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCrop}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {cropsToDisplay.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AlertCircle size={64} color={Colors.light.textSecondary} />
          <Text style={styles.emptyText}>You haven't added any crops yet</Text>
          <TouchableOpacity style={styles.addFirstCropButton} onPress={handleAddCrop}>
            <Text style={styles.addFirstCropButtonText}>Add Your First Crop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cropsToDisplay}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CropCard crop={item} onPress={() => handleCropPress(item)} />
          )}
          contentContainerStyle={styles.cropsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.xl + Layout.spacing.xl,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropsList: {
    padding: Layout.spacing.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  addFirstCropButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
  },
  addFirstCropButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});