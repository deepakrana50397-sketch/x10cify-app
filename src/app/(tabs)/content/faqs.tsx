import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCmsCollection, updateCmsCollectionItem } from '../../../store/thunks/cmsCollectionsThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import ToggleRow from '../../../components/ToggleRow';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

export default function FaqsCmsScreen() {
  const dispatch = useAppDispatch();
  const { faqs, loading, saving, error } = useAppSelector((state) => state.cmsCollections);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCmsCollection('faqs'));
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchCmsCollection('faqs'));
  };

  const handleToggle = (id: number, currentVal: boolean) => {
    dispatch(updateCmsCollectionItem({ resource: 'faqs', id, data: { visible: !currentVal } }));
  };

  const renderFaqItem = ({ item }: { item: any }) => {
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.questionText}>Q: {item.question || 'Untitled Question'}</Text>
        </View>
        <Text style={styles.answerText} numberOfLines={3}>A: {item.answer || 'No answer provided.'}</Text>
        
        <View style={styles.toggleContainer}>
          <ToggleRow
            title="FAQ Visible"
            value={item.visible}
            onValueChange={() => handleToggle(item.id, item.visible)}
            isLoading={saving}
            description="Toggle visibility of this FAQ accordion on the storefront."
          />
        </View>
      </BentoCard>
    );
  };

  if (loading && faqs.length === 0) {
    return <LoadingState message="Fetching FAQs listing..." />;
  }

  if (error && faqs.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="FAQs" subtitle="Manage storefront FAQ accordion items" />

      <FlatList
        data={faqs}
        renderItem={renderFaqItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No FAQs Found"
            description="No storefront FAQs are currently configured."
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
    marginBottom: 6,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  answerText: {
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
