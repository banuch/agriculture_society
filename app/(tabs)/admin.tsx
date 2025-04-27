import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { X, Plus, Trash2, CreditCard as Edit } from 'lucide-react-native';

export default function AdminScreen() {
  const { userData } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (userData?.role !== 'admin') {
      Alert.alert('Access Denied', 'You do not have permission to access this page');
      return;
    }
    
    fetchCategories();
  }, [userData]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesCollection = collection(db, 'categories');
      const snapshot = await getDocs(categoriesCollection);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryImageUrl('');
    setModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryImageUrl(category.imageUrl);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this category? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'categories', categoryId));
              setCategories(categories.filter(c => c.id !== categoryId));
              Alert.alert('Success', 'Category deleted successfully');
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Error', 'Failed to delete category');
            }
          }
        }
      ]
    );
  };

  const saveCategory = async () => {
    if (!categoryName.trim() || !categoryImageUrl.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const categoryData = {
        name: categoryName.trim(),
        imageUrl: categoryImageUrl.trim(),
        updatedAt: new Date()
      };

      if (editingCategory) {
        // Update existing category
        await setDoc(doc(db, 'categories', editingCategory.id), categoryData, { merge: true });
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? { ...c, ...categoryData } : c
        ));
        Alert.alert('Success', 'Category updated successfully');
      } else {
        // Add new category
        categoryData.createdAt = new Date();
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        setCategories([...categories, { id: docRef.id, ...categoryData }]);
        Alert.alert('Success', 'Category added successfully');
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Failed to save category');
    }
  };

  // Sample categories if none are fetched
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
    }
  ];

  const categoriesToDisplay = categories.length > 0 ? categories : sampleCategories;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Crop Categories</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={categoriesToDisplay}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryImageUrl} numberOfLines={1}>{item.imageUrl}</Text>
              </View>
              <View style={styles.categoryActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditCategory(item)}
                >
                  <Edit size={18} color={Colors.light.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteCategory(item.id)}
                >
                  <Trash2 size={18} color={Colors.light.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={categoryImageUrl}
                onChangeText={setCategoryImageUrl}
                placeholder="Enter image URL"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: Colors.light.primaryDark,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
    backgroundColor: Colors.light.primaryDark,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    padding: Layout.spacing.l,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  categoryImageUrl: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    maxWidth: '80%',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.s,
  },
  editButton: {
    backgroundColor: Colors.light.primaryLight,
  },
  deleteButton: {
    backgroundColor: Colors.light.accentLight,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  formGroup: {
    marginBottom: Layout.spacing.l,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: Layout.spacing.s,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});