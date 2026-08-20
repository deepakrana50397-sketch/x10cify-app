import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideToast } from '../store/slices/appSlice';
import { COLORS } from '../constants/colors';

export default function Toast() {
  const dispatch = useAppDispatch();
  const { toastMessage, toastType } = useAppSelector((state) => state.app);
  const slideAnim = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (toastMessage) {
      // 1. Slide In Animation
      Animated.spring(slideAnim, {
        toValue: 20,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // 2. Auto-dismiss timeout
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDismiss = () => {
    // Slide Out Animation
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      dispatch(hideToast());
    });
  };

  if (!toastMessage) return null;

  const getThemeStyles = () => {
    switch (toastType) {
      case 'error':
        return {
          bg: '#FFE8E2',
          border: COLORS.primary,
          text: COLORS.primary,
          icon: '⚠️',
        };
      case 'success':
        return {
          bg: COLORS.accentMuted,
          border: COLORS.accent,
          text: '#5D7A1D',
          icon: '✓',
        };
      case 'info':
      default:
        return {
          bg: '#E3F2FD',
          border: '#2196F3',
          text: '#0D47A1',
          icon: 'ℹ️',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <SafeAreaView>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={handleDismiss}
          style={[
            styles.toast,
            { backgroundColor: theme.bg, borderColor: theme.border },
          ]}
        >
          <View style={styles.contentRow}>
            <Text style={styles.icon}>{theme.icon}</Text>
            <Text style={[styles.text, { color: theme.text }]} numberOfLines={2}>
              {toastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    paddingHorizontal: 20,
  },
  toast: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: COLORS.neutralDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
