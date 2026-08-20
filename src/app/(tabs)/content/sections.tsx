import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchWebsiteSections, toggleWebsiteSection } from '../../../store/thunks/websiteThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import ToggleRow from '../../../components/ToggleRow';
import { LoadingState, ErrorState } from '../../../components/States';

export default function HomepageSectionsScreen() {
  const dispatch = useAppDispatch();
  const { sections, loading, updating, error } = useAppSelector((state) => state.website);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWebsiteSections());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchWebsiteSections());
  };

  const handleToggle = (id: number, currentVal: boolean) => {
    dispatch(toggleWebsiteSection({ id, visible: !currentVal }));
  };

  if (loading && sections.length === 0) {
    return <LoadingState message="Fetching layout sections..." />;
  }

  if (error && sections.length === 0) {
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
      <ScreenHeader title="Homepage Builder" subtitle="Toggle landing page sections visibility" />

      <View style={styles.section}>
        <BentoCard style={styles.card}>
          {sections.map((item) => {
            let description = 'Toggles visibility on the storefront.';
            if (item.sectionId === 'hero') description = 'Main hero introduction title banner.';
            if (item.sectionId === 'wrong_vs_right') description = 'Problem wall comparisons section.';
            if (item.sectionId === 'clients') description = 'Brand partner logo marquee.';
            if (item.sectionId === 'work') description = 'Optimized case studies grid cards.';
            if (item.sectionId === 'faq') description = 'Frequently asked conversion FAQ accordions.';
            if (item.sectionId === 'cta') description = 'Bottom conversion request form trigger.';

            return (
              <ToggleRow
                key={item.id}
                title={item.title || item.sectionId}
                value={item.visible}
                onValueChange={() => handleToggle(item.id, item.visible)}
                isLoading={updating}
                description={description}
              />
            );
          })}
        </BentoCard>
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
  section: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  card: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
});
