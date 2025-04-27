import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { LogOut, User, MapPin, Phone, Mail, ChevronRight, CreditCard as Edit2 } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { userData, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const ProfileItem = ({ icon, title, value }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        {icon}
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      <Text style={styles.profileItemValue}>{value}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuOptionLeft}>
        {icon}
        <Text style={styles.menuOptionTitle}>{title}</Text>
      </View>
      <ChevronRight size={20} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ 
              uri: userData.photoURL || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' 
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfile}>
            <Edit2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userData.name || 'User'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ProfileSection title="Personal Information">
          <ProfileItem 
            icon={<User size={20} color={Colors.light.textSecondary} />} 
            title="Full Name" 
            value={userData.name} 
          />
          <ProfileItem 
            icon={<Mail size={20} color={Colors.light.textSecondary} />} 
            title="Email" 
            value={userData.email} 
          />
          <ProfileItem 
            icon={<Phone size={20} color={Colors.light.textSecondary} />} 
            title="Phone" 
            value={userData.phone || 'Not provided'} 
          />
          {userData.role === 'farmer' && (
            <ProfileItem 
              icon={<MapPin size={20} color={Colors.light.textSecondary} />} 
              title="Pincode" 
              value={userData.location?.pincode || 'Not provided'} 
            />
          )}
        </ProfileSection>

        <ProfileSection title="Account">
          <MenuOption 
            icon={<Edit2 size={20} color={Colors.light.textSecondary} />} 
            title="Edit Profile" 
            onPress={handleEditProfile} 
          />
          
          {userData.role === 'farmer' && (
            <MenuOption 
              icon={<MapPin size={20} color={Colors.light.textSecondary} />} 
              title="Manage Location" 
              onPress={() => router.push('/manage-location')} 
            />
          )}
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <LogOut size={20} color="#FFFFFF" />
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        </ProfileSection>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Layout.spacing.xl,
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.m,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: Layout.spacing.xs,
  },
  roleBadge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.medium,
  },
  roleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  content: {
    padding: Layout.spacing.l,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Layout.spacing.m,
  },
  sectionContent: {
    backgroundColor: Colors.light.card,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: Layout.spacing.m,
  },
  profileItemValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: Layout.spacing.m,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.m,
    marginTop: Layout.spacing.m,
  },
  signOutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: Layout.spacing.s,
  },
});