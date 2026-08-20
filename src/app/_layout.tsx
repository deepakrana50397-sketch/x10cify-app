import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession } from '../store/thunks/authThunks';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerLogoutHandler } from '../services/api';
import { logout } from '../store/thunks/authThunks';
import { StatusBar } from 'expo-status-bar';
import Toast from '../components/Toast';
import NetInfo from '@react-native-community/netinfo';
import { setOnlineStatus } from '../store/slices/appSlice';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import apiClient from '../services/api';

// Configure foreground notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.log('[Push] Simulator detected. Registering mock token for development testing.');
    return 'ExponentPushToken[SimulatorDeveloperMockToken]';
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('[Push] Permission denied for push notifications.');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('[Push] Expo push token retrieved:', token);
    return token;
  } catch (error) {
    console.error('[Push] Failed to retrieve Expo push token:', error);
    return null;
  }
}

async function registerPushTokenOnServer(token: string) {
  try {
    await apiClient.post('/admin/push-token', { token });
    console.log('[Push] Push token synced with Express backend server.');
  } catch (error) {
    console.error('[Push] Express push token registration failed:', error);
  }
}

function AppNavigationGuard() {
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const router = useRouter();

  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);
  const isOnline = useAppSelector((state) => state.app.isOnline);

  const [progress, setProgress] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  // 1. Session Restoration on Launch
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // 2. Animate progress bar from 0% to 100%
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnimationDone(true);
          return 100;
        }
        return prev + 2;
      });
    }, 20); // Animates to 100% in 1 second (50 steps * 20ms)

    return () => clearInterval(interval);
  }, []);

  // 3. Register API 401 Interceptor Action
  useEffect(() => {
    registerLogoutHandler(() => {
      dispatch(logout());
    });
  }, [dispatch]);

  // 4. Subscribe to Network Connection Status changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setOnlineStatus(state.isConnected ?? false));
    });
    return () => unsubscribe();
  }, [dispatch]);

  // 5. Register Push Notifications on Authentication
  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          registerPushTokenOnServer(token);
        }
      });
    }
  }, [isAuthenticated]);

  // 6. Navigation Guard Rules
  useEffect(() => {
    if (isInitializing || !animationDone) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user to login screen
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated user away from login to index tabs page
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitializing, animationDone, segments]);

  const handleRetryConnection = async () => {
    const state = await NetInfo.fetch();
    dispatch(setOnlineStatus(state.isConnected ?? false));
  };

  // Welcome Startup Screen (percentage + progress bar, no other text)
  if (isInitializing || !animationDone) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.loaderContent}>
          <Text style={styles.progressText}>{progress}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    );
  }

  // Offline Overlay Screen
  if (!isOnline) {
    return (
      <View style={styles.offlineContainer}>
        <View style={styles.offlineContent}>
          <View style={styles.offlineIconBg}>
            <Ionicons name="cloud-offline-outline" size={48} color="#FF5722" />
          </View>
          <Text style={styles.offlineTitle}>No Internet Connection</Text>
          <Text style={styles.offlineText}>
            You are currently offline. Please verify your Wi-Fi or cellular network connection to continue managing x10cify.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetryConnection}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <Toast />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar style="dark" />
        <AppNavigationGuard />
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FAFAF8', // Website off-white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContent: {
    alignItems: 'center',
    gap: 16,
  },
  progressText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
  progressBarBg: {
    width: 200,
    height: 8,
    backgroundColor: '#E5E5E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 4,
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  offlineContent: {
    alignItems: 'center',
    maxWidth: 280,
    gap: 16,
  },
  offlineIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  offlineText: {
    fontSize: 13,
    color: '#70706A',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  retryButton: {
    height: 48,
    backgroundColor: '#000000',
    paddingHorizontal: 28,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
