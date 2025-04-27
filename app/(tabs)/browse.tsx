import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import { CropCard } from '@/components/CropCard';
import { CategoryCard } from '@/components/CategoryCard';

export default function BrowseScreen() {
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all crops
      const cropsQuery = query(
        collection(db, 'crops'),
        orderBy('createdAt', 'desc')
      );
      const cropsSnapshot = await getDocs(cropsQuery);
      const cropsData = cropsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCrops(cropsData);
      setFilteredCrops(cropsData);

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

  useEffect(() => {
    filterCrops();
  }, [searchText, selectedCategory, crops]);

  const filterCrops = () => {
    let filtered = [...crops];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchText.toLowerCase()) ||
        crop.farmer?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(crop => crop.categoryId === selectedCategory);
    }

    setFilteredCrops(filtered);
  };

  const handleCropPress = (crop) => {
    router.push({
      pathname: `/crop-details/${crop.id}`,
      params: { id: crop.id }
    });
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.id === selectedCategory ? null : category.id);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory(null);
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
  const cropsToDisplay = filteredCrops.length > 0 ? filteredCrops : sampleCrops;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Crops</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops, farmers..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={Colors.light.textSecondary}
          />
          {searchText ? (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {(searchText || selectedCategory) && (
        <View style={styles.filtersAppliedContainer}>
          <Text style={styles.filtersAppliedText}>Filters applied</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ListHeaderComponent={() => (
          <>
            <FlatList
              horizontal
              data={categoriesToDisplay}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CategoryCard 
                  category={item}
                  onPress={() => handleCategoryPress(item)}
                />
              )}
              contentContainerStyle={styles.categoriesList}
              showsHorizontalScrollIndicator={false}
            />
            
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {loading ? 'Loading...' : `${cropsToDisplay.length} crops found`}
              </Text>
            </View>
          </>
        )}
        data={cropsToDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CropCard crop={item} onPress={() => handleCropPress(item)} />
        )}
        contentContainerStyle={styles.cropsList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.xl + Layout.spacing.xl,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.l,
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    height: 48,
    marginRight: Layout.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: Layout.spacing.s,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  filtersAppliedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filtersAppliedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  clearFiltersText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  categoriesList: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
  },
  resultsHeader: {
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  resultsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  cropsList: {
    paddingHorizontal: Layout.spacing.l,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});