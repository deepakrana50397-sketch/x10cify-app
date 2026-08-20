import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchBlogs, updateBlog, deleteBlog } from '../../../store/thunks/blogsThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import ToggleRow from '../../../components/ToggleRow';
import Button from '../../../components/Button';
import showConfirmDialog from '../../../components/ConfirmDialog';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

export default function BlogsCmsScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, saving, deleting, error } = useAppSelector((state) => state.blogs);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchBlogs());
  };

  const handleToggle = (id: number, currentVal: 'draft' | 'published') => {
    const nextVal = currentVal === 'published' ? 'draft' : 'published';
    dispatch(updateBlog({ id, data: { status: nextVal } }));
  };

  const handleDelete = (id: number, title: string) => {
    showConfirmDialog({
      title: 'Delete Blog Post',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        dispatch(deleteBlog(id));
      },
    });
  };

  const renderBlogItem = ({ item }: { item: any }) => {
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.excerptText} numberOfLines={2}>{item.excerpt || 'No summary available.'}</Text>
        
        <View style={styles.controls}>
          <ToggleRow
            title="Blog Published"
            value={item.status === 'published'}
            onValueChange={() => handleToggle(item.id, item.status)}
            isLoading={saving}
            description="Toggle draft vs live publishing status on storefront blog listings."
          />
          <Button
            title="Delete Post"
            onPress={() => handleDelete(item.id, item.title)}
            variant="danger"
            isLoading={deleting}
            style={styles.deleteBtn}
          />
        </View>
      </BentoCard>
    );
  };

  if (loading && items.length === 0) {
    return <LoadingState message="Fetching blog entries..." />;
  }

  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Blogs" subtitle="Manage storefront articles & news" />

      <FlatList
        data={items}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Blogs Found"
            description="No articles are currently configured."
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
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  excerptText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 16,
  },
  controls: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    gap: 12,
  },
  deleteBtn: {
    height: 40,
    borderRadius: 20,
    marginTop: 4,
  },
});
