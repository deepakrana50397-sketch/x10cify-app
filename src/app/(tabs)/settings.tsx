import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/thunks/authThunks';
import { COLORS } from '../../constants/colors';
import ScreenHeader from '../../components/ScreenHeader';
import BentoCard from '../../components/BentoCard';
import Button from '../../components/Button';
import showConfirmDialog from '../../components/ConfirmDialog';
import { CONFIG } from '../../constants/config';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isOnline = useAppSelector((state) => state.app.isOnline);

  const handleLogout = () => {
    showConfirmDialog({
      title: 'Sign Out',
      message: 'Are you sure you want to log out of your admin session?',
      confirmText: 'Sign Out',
      onConfirm: () => {
        dispatch(logout());
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader title="Settings" subtitle="System controls & profile" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          
          {/* Profile Card */}
          <Text style={styles.sectionLabel}>Active Profile</Text>
          <BentoCard style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>{user?.name || 'Administrator'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'admin@x10cify.com'}</Text>
              </View>
            </View>
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Authorization Role</Text>
              <Text style={styles.roleValue}>{user?.role || 'Admin'}</Text>
            </View>
          </BentoCard>

          {/* System Diagnostics */}
          <Text style={styles.sectionLabel}>System Diagnostics</Text>
          <BentoCard style={styles.card}>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>API Endpoint URL</Text>
              <Text style={styles.diagValue} numberOfLines={1}>
                {CONFIG.API_URL}
              </Text>
            </View>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>Connection State</Text>
              <Text
                style={[
                  styles.diagValue,
                  { color: isOnline ? COLORS.success : COLORS.error, fontWeight: '800' }
                ]}
              >
                {isOnline ? 'CONNECTED' : 'OFFLINE'}
              </Text>
            </View>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>Client Version</Text>
              <Text style={styles.diagValue}>{CONFIG.APP_VERSION}</Text>
            </View>
          </BentoCard>

          {/* Logout CTA */}
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutBtn}
          />

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 110,
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
    marginTop: 12,
  },
  card: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accentMuted,
    borderWidth: 1,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5D7A1D',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  roleValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  diagLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  diagValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    maxWidth: '60%',
  },
  logoutBtn: {
    height: 52,
    borderRadius: 26,
    marginTop: 24,
  },
});
