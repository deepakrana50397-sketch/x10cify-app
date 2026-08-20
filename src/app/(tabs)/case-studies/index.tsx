import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCaseStudies, toggleCaseStudyVisibility } from '../../../store/thunks/caseStudyThunks';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import Button from '../../../components/Button';
import ToggleRow from '../../../components/ToggleRow';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

export default function CaseStudiesListScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items, loading, updatingVisibility, error } = useAppSelector((state) => state.caseStudies);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCaseStudies());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchCaseStudies());
  };

  const handleToggleVisibility = (id: number, currentValue: boolean) => {
    dispatch(toggleCaseStudyVisibility({ id, visible: !currentValue }));
  };

  const renderCaseStudyItem = ({ item }: { item: any }) => {
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>{item.clientName || 'Brand Partner'}</Text>
          <Text style={styles.yearText}>{item.year || '2026'}</Text>
        </View>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>

        <View style={styles.controlsContainer}>
          <ToggleRow
            title="Visible on Website"
            value={item.visible}
            onValueChange={() => handleToggleVisibility(item.id, item.visible)}
            isLoading={updatingVisibility}
            description="Toggles displaying this case study on the public website."
          />
          
          <Button
            title="Edit Details"
            onPress={() => router.push(`/(tabs)/case-studies/${item.id}`)}
            variant="secondary"
            style={styles.editBtn}
          />
        </View>
      </BentoCard>
    );
  };

  if (loading && items.length === 0) {
    return <LoadingState message="Fetching case studies collection..." />;
  }

  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <ScreenHeader title="Case Studies" subtitle="Manage public portfolio studies" />

      {/* List */}
      <FlatList
        data={items}
        renderItem={renderCaseStudyItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Case Studies"
            description="No case studies are currently loaded in the database CMS."
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
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neutralDark,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  controlsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    gap: 12,
  },
  editBtn: {
    height: 44,
    borderRadius: 22,
    marginTop: 8,
  },
});
