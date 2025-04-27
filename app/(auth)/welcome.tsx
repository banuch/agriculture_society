import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ArrowRight, Sprout, Chrome as Home, ShoppingBasket } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg' }} 
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Kisan Connect</Text>
          <Text style={styles.subtitle}>Connect Farmers with Buyers</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Kisan Connect</Text>
        <Text style={styles.descriptionText}>
          The marketplace where farmers can sell their crops directly to buyers without middlemen.
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Sprout size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Farmers post crop details and set their own prices</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <ShoppingBasket size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Buyers browse crops by location and connect directly</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Home size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureText}>Local marketplace supporting Indian farmers</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    height: '40%',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: Layout.spacing.xl,
    left: Layout.spacing.l,
    right: Layout.spacing.l,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    padding: Layout.spacing.l,
  },
  welcomeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: Layout.spacing.s,
  },
  descriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: Layout.spacing.l,
    lineHeight: 24,
  },
  featuresContainer: {
    marginTop: Layout.spacing.l,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.m,
  },
  featureText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  buttonContainer: {
    padding: Layout.spacing.l,
    position: 'absolute',
    bottom: Layout.spacing.xl,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.medium,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: Layout.spacing.s,
  },
});