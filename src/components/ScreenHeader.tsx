import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../store/hooks';
import { COLORS } from '../constants/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function ScreenHeader({ title, subtitle, rightElement }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isOnline = useAppSelector((state) => state.app.isOnline);
  const user = useAppSelector((state) => state.auth.user);
  
  const isAdmin = user?.role === 'admin';

  // Dynamic colors based on admin role
  const gradientColors = isAdmin ? (['#FF8C42', '#FF5722'] as const) : (['#FFFFFF', '#FAF9F6'] as const);
  const logoTextColor = isAdmin ? '#FFFFFF' : COLORS.text;
  const logoDotColor = isAdmin ? '#000000' : '#FF8C42';
  const titleTextColor = isAdmin ? '#FFFFFF' : COLORS.text;
  const subtitleTextColor = isAdmin ? 'rgba(255, 255, 255, 0.85)' : COLORS.textMuted;
  const dividerBgColor = isAdmin ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)';
  const statusBadgeBg = isAdmin ? 'rgba(255, 255, 255, 0.15)' : '#F5F5F5';
  const statusBadgeText = isAdmin ? '#FFFFFF' : COLORS.textMuted;
  const borderCardColor = isAdmin ? '#E6732B' : COLORS.border;

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerCard, { borderColor: borderCardColor }]}
      >
        {/* 1. Centered Nav bar logo & optional rightElement */}
        <View style={styles.brandRow}>
          {/* Logo container absolutely centered in the row */}
          <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: logoTextColor }]}>
              x10cify<Text style={{ color: logoDotColor }}>.</Text>
            </Text>
          </View>
          
          {/* Right action aligned (if custom rightElement is supplied) */}
          {rightElement && (
            <View style={styles.rightActionContainer}>
              {rightElement}
            </View>
          )}
        </View>

        {/* Thin divider line */}
        <View style={[styles.divider, { backgroundColor: dividerBgColor }]} />

        {/* 2. Nav bar title block & status badge */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: titleTextColor }]} numberOfLines={1}>
              {title}
            </Text>
            
            {/* Show network status badge next to title if no custom rightElement is present */}
            {!rightElement && (
              <View style={[styles.statusBadge, { backgroundColor: statusBadgeBg }]}>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
                <Text style={[styles.statusText, { color: statusBadgeText }]}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            )}
          </View>
          {subtitle && <Text style={[styles.subtitle, { color: subtitleTextColor }]} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: COLORS.background,
  },
  headerCard: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 48,
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  rightActionContainer: {
    zIndex: 10,
  },
  textContainer: {
    justifyContent: 'center',
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
});
