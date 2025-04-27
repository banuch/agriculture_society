import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react-native';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (role === 'farmer' && !pincode) {
      Alert.alert('Error', 'Pincode is required for farmer registration');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, {
        name,
        role,
        phone,
        location: {
          pincode: pincode,
        },
      });
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please check your information and try again');
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
          <Text style={styles.headerTitle}>Register</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a farmer or buyer</Text>

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'farmer' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('farmer')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'farmer' && styles.roleButtonTextActive,
                ]}
              >
                Farmer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'buyer' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('buyer')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'buyer' && styles.roleButtonTextActive,
                ]}
              >
                Buyer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

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
              <Phone size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            {role === 'farmer' && (
              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Pincode"
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>
            )}

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

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Login</Text>
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
    marginBottom: Layout.spacing.m,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.l,
  },
  roleButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginHorizontal: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.medium,
  },
  roleButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  roleButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  form: {
    marginTop: Layout.spacing.m,
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
  registerButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.medium,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.l,
  },
  registerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
  },
});