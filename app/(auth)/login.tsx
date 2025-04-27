import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account to continue</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.light.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.light.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.light.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.xl + Layout.spacing.m,
    paddingBottom: Layout.spacing.m,
  },
  backButton: {
    padding: Layout.spacing.s,
    marginRight: Layout.spacing.s,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.l,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: Layout.spacing.s,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: Layout.spacing.xl,
  },
  form: {
    marginTop: Layout.spacing.l,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.l,
    height: 56,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  inputIcon: {
    marginRight: Layout.spacing.m,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: Layout.spacing.s,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Layout.spacing.xl,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.medium,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.l,
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  registerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  registerLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
  },
});