import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCmsCollection, updateCmsCollectionItem } from '../../../store/thunks/cmsCollectionsThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import ToggleRow from '../../../components/ToggleRow';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

export default function ServicesCmsScreen() {
  const dispatch = useAppDispatch();
  const { services, loading, saving, error } = useAppSelector((state) => state.cmsCollections);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCmsCollection('services'));
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchCmsCollection('services'));
  };

  const handleToggle = (id: number, currentVal: boolean) => {
    dispatch(updateCmsCollectionItem({ resource: 'services', id, data: { visible: !currentVal } }));
  };

  const renderServiceItem = ({ item }: { item: any }) => {
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.titleText}>{item.name || item.title || 'Untitled Service'}</Text>
          <Text style={styles.priceText}>{item.price ? `$${item.price}` : 'Free'}</Text>
        </View>
        <Text style={styles.descText} numberOfLines={2}>{item.description || 'No description provided.'}</Text>
        
        <View style={styles.toggleContainer}>
          <ToggleRow
            title="Service Visible"
            value={item.visible}
            onValueChange={() => handleToggle(item.id, item.visible)}
            isLoading={saving}
            description="Toggle visibility of this service on the storefront."
          />
        </View>
      </BentoCard>
    );
  };

  if (loading && services.length === 0) {
    return <LoadingState message="Fetching services listing..." />;
  }

  if (error && services.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Services" subtitle="Manage storefront service categories" />

      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Services Found"
            description="No storefront services are currently configured."
            actionTitle="Refresh"
            onAction={handleRefresh}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    flex: 1,
    paddingRight: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 16,
  },
  toggleContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});
