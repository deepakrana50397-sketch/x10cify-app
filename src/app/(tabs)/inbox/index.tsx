import React, { useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAudits } from '../../../store/thunks/auditThunks';
import { setAuditFilter, setSearchQuery } from '../../../store/slices/auditsSlice';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import StatusBadge from '../../../components/StatusBadge';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';
import { AuditStatus } from '../../../types/audit';

export default function InboxListScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    items,
    activeFilter,
    searchQuery,
    loading,
    refreshing,
    error
  } = useAppSelector((state) => state.audits);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAudits());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchAudits());
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter !== 'all' && item.status !== activeFilter) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const companyMatch = item.company?.toLowerCase().includes(q);
      const nameMatch = `${item.firstName} ${item.lastName || ''}`.toLowerCase().includes(q);
      const emailMatch = item.email?.toLowerCase().includes(q);
      const messageMatch = item.message?.toLowerCase().includes(q);
      return companyMatch || nameMatch || emailMatch || messageMatch;
    }
    return true;
  });

  const renderAuditCard = ({ item }: { item: any }) => {
    const fullName = `${item.firstName} ${item.lastName || ''}`.trim();
    let bottleneck = 'Not specified';
    if (item.message) {
      const lines = item.message.split('\n');
      const bottleneckLine = lines.find((l: string) => l.startsWith('Biggest Store Bottleneck:') || l.startsWith('Biggest Bottleneck:'));
      if (bottleneckLine) {
        bottleneck = bottleneckLine.split(':')[1]?.trim() || bottleneck;
      }
    }

    return (
      <BentoCard
        onPress={() => router.push(`/(tabs)/inbox/${item.id}`)}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.companyName}>{item.company || 'Shopify Store'}</Text>
          <StatusBadge status={item.status} />
        </View>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Lead: </Text>{fullName} ({item.email})
          </Text>
          <Text style={styles.detailText} numberOfLines={1}>
            <Text style={styles.bold}>Bottleneck: </Text>{bottleneck}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Received: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.actionText}>Edit Status →</Text>
        </View>
      </BentoCard>
    );
  };

  const filterTabs: { label: string; value: 'all' | AuditStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Archived', value: 'archived' },
  ];

  if (loading && items.length === 0) {
    return <LoadingState message="Fetching client message leads..." />;
  }

  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Inbox" subtitle="Moderate client diagnostic leads" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={(val) => dispatch(setSearchQuery(val))}
          placeholder="Search store, email, contact..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => dispatch(setAuditFilter(tab.value))}
            style={[
              styles.tab,
              activeFilter === tab.value && styles.activeTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === tab.value && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        renderItem={renderAuditCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Messages"
            description="There are currently no messages in this category."
            actionTitle={searchQuery.trim().length > 0 ? "Clear Search" : "Refresh List"}
            onAction={
              searchQuery.trim().length > 0
                ? () => dispatch(setSearchQuery(''))
                : handleRefresh
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  details: {
    gap: 4,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
});
