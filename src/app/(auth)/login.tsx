import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAuthError } from '../../store/slices/authSlice';
import { login as loginThunk } from '../../store/thunks/authThunks';
import { COLORS } from '../../constants/colors';
import Button from '../../components/Button';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear slice errors when screen loads or changes
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSignIn = () => {
    setLocalError('');
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }
    dispatch(loginThunk({ email: email.trim(), password: password.trim() }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            
            {/* Logo */}
            <Text style={styles.logo}>
              x10cify<Text style={{ color: COLORS.primary }}>.</Text>
            </Text>

            {/* Header */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your admin control center</Text>

            {/* Inputs */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setLocalError('');
                    dispatch(clearAuthError());
                  }}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="name@x10cify.com"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    setLocalError('');
                    dispatch(clearAuthError());
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>

              {/* Errors */}
              {(localError || error) && (
                <Text style={styles.errorText}>
                  ⚠️ {localError || error}
                </Text>
              )}

              {/* Submit CTA */}
              <Button
                title="Sign In"
                onPress={handleSignIn}
                isLoading={isLoading}
                style={styles.button}
              />
            </View>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 32,
    shadowColor: COLORS.neutralDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  button: {
    marginTop: 12,
  },
});
