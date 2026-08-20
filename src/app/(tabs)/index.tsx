import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardStats } from '../../store/thunks/dashboardThunks';
import { setAuditFilter } from '../../store/slices/auditsSlice';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import ScreenHeader from '../../components/ScreenHeader';
import BentoCard from '../../components/BentoCard';
import StatusBadge from '../../components/StatusBadge';
import { LoadingState, ErrorState } from '../../components/States';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    totalAudits,
    newAudits,
    contactedAudits,
    archivedAudits,
    recentAudits,
    loading,
    error
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  const handleStatPress = (filter: 'all' | 'new' | 'contacted' | 'archived') => {
    dispatch(setAuditFilter(filter));
    router.push('/(tabs)/inbox');
  };

  if (loading && totalAudits === 0) {
    return <LoadingState message="Fetching storefront KPI analytics..." />;
  }

  if (error && totalAudits === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
      }
    >
      
      {/* Header */}
      <ScreenHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Admin'}`}
      />

      {/* Bento KPIs Stats Grid */}
      <View style={styles.grid}>
        
        {/* Total Audits */}
        <BentoCard onPress={() => handleStatPress('all')} style={[styles.gridItem, styles.fullWidth]}>
          <Text style={styles.statLabel}>Total Audits</Text>
          <Text style={[styles.statValue, { color: COLORS.text }]}>{totalAudits}</Text>
          <Text style={styles.statAction}>View All Audits →</Text>
        </BentoCard>

        {/* New Leads */}
        <BentoCard onPress={() => handleStatPress('new')} style={styles.gridItem}>
          <View style={styles.cardHeader}>
            <Text style={styles.statLabel}>New Leads</Text>
            <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
          </View>
          <Text style={[styles.statValue, { color: '#5D7A1D' }]}>{newAudits}</Text>
        </BentoCard>

        {/* Contacted Leads */}
        <BentoCard onPress={() => handleStatPress('contacted')} style={styles.gridItem}>
          <View style={styles.cardHeader}>
            <Text style={styles.statLabel}>Contacted</Text>
            <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
          </View>
          <Text style={[styles.statValue, { color: '#0D47A1' }]}>{contactedAudits}</Text>
        </BentoCard>

      </View>

      {/* Recent Audits leads */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          <Text onPress={() => handleStatPress('all')} style={styles.sectionAction}>
            View All
          </Text>
        </View>

        {recentAudits.length === 0 ? (
          <BentoCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent audit requests found.</Text>
          </BentoCard>
        ) : (
          <View style={styles.list}>
            {recentAudits.map((item) => (
              <BentoCard
                key={item.id}
                onPress={() => router.push(`/(tabs)/inbox/${item.id}`)}
                style={styles.listItem}
              >
                <View style={styles.listItemHeader}>
                  <Text style={styles.listCompany}>{item.company}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listDate}>
                  Submitted: {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </BentoCard>
            ))}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    minHeight: 120,
    justifyContent: 'space-between',
  },
  fullWidth: {
    minWidth: '100%',
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: 4,
  },
  statAction: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  list: {
    gap: 12,
  },
  listItem: {
    padding: 16,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listCompany: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  listName: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  listDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
