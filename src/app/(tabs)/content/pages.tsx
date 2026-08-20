import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPages, updatePage } from '../../../store/thunks/pagesThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import ToggleRow from '../../../components/ToggleRow';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

export default function PagesListScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, saving, error } = useAppSelector((state) => state.pages);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPages());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchPages());
  };

  const handleToggle = (id: number, currentVal: 'active' | 'inactive') => {
    const nextVal = currentVal === 'active' ? 'inactive' : 'active';
    dispatch(updatePage({ id, data: { status: nextVal } }));
  };

  const renderPageItem = ({ item }: { item: any }) => {
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.pageTitle}>{item.title}</Text>
          <Text style={styles.slugText}>/{item.slug}</Text>
        </View>
        
        <View style={styles.toggleRowContainer}>
          <ToggleRow
            title="Page Enabled"
            value={item.status === 'active'}
            onValueChange={() => handleToggle(item.id, item.status)}
            isLoading={saving}
            description="Controls whether this page is publicly accessible on the web."
          />
        </View>
      </BentoCard>
    );
  };

  if (loading && items.length === 0) {
    return <LoadingState message="Fetching site pages index..." />;
  }

  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Site Pages" subtitle="Enable/disable public page paths" />

      <FlatList
        data={items}
        renderItem={renderPageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Pages Found"
            description="No site page routes are configured in the database."
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
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  slugText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: 'System',
    fontWeight: '500',
  },
  toggleRowContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});
