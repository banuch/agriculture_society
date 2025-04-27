import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useRouter } from 'expo-router';
import { Search, MapPin, Phone, Tag } from 'lucide-react-native';
import { CropCard } from '@/components/CropCard';
import { CategoryCard } from '@/components/CategoryCard';

export default function HomeScreen() {
  const { userData } = useAuth();
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch featured crops
      const cropsQuery = query(
        collection(db, 'crops'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const cropsSnapshot = await getDocs(cropsQuery);
      const cropsData = cropsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeaturedCrops(cropsData);

      // Fetch categories
      const categoriesQuery = query(collection(db, 'categories'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample categories if none are fetched from database
  const sampleCategories = [
    {
      id: '1',
      name: 'Vegetables',
      imageUrl: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg'
    },
    {
      id: '2',
      name: 'Fruits',
      imageUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'
    },
    {
      id: '3',
      name: 'Grains',
      imageUrl: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg'
    },
    {
      id: '4',
      name: 'Dairy',
      imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg'
    }
  ];

  // Sample crops if none are fetched from database
  const sampleCrops = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      price: 40,
      quantity: 25,
      unit: 'kg',
      imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      farmer: {
        name: 'Raj Kumar',
        location: {
          pincode: '110001'
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
        name: 'Suresh Singh',
        location: {
          pincode: '110002'
        }
      }
    },
    {
      id: '3',
      name: 'Green Chillies',
      price: 60,
      quantity: 10,
      unit: 'kg',
      imageUrl: 'https://images.pexels.com/photos/5945754/pexels-photo-5945754.jpeg',
      farmer: {
        name: 'Amit Patel',
        location: {
          pincode: '110003'
        }
      }
    }
  ];

  const categoriesToDisplay = categories.length > 0 ? categories : sampleCategories;
  const cropsToDisplay = featuredCrops.length > 0 ? featuredCrops : sampleCrops;

  // Navigate to browse with category filter
  const handleCategoryPress = (category) => {
    router.push({
      pathname: '/browse',
      params: { category: category.id }
    });
  };

  // Navigate to crop details
  const handleCropPress = (crop) => {
    router.push({
      pathname: `/(tabs)/crop-details/${crop.id}`,
      params: { id: crop.id }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome{userData ? ', ' + userData.name.split(' ')[0] : ''}
            </Text>
            <Text style={styles.subtitle}>
              {userData?.role === 'farmer' ? 'Sell your crops directly' : 'Find fresh crops from farmers'}
            </Text>
          </View>
          
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg' }}
            style={styles.headerImage}
          />
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color={Colors.light.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search crops, farmers...</Text>
        </TouchableOpacity>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <FlatList
            horizontal
            data={categoriesToDisplay}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <CategoryCard 
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
          />
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Crops</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/browse')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {cropsToDisplay.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onPress={() => handleCropPress(crop)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.xl + Layout.spacing.xl,
    paddingBottom: Layout.spacing.l,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
    marginHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: Layout.spacing.m,
  },
  categoriesSection: {
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Layout.spacing.m,
  },
  categoriesList: {
    paddingRight: Layout.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  featuredSection: {
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.xl,
  },
});