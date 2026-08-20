import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchReviews, updateReviewStatus, deleteReview } from '../../../store/thunks/reviewsThunks';
import { fetchChangeRequests, approveChangeRequest, rejectChangeRequest } from '../../../store/thunks/changeRequestsThunks';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import Button from '../../../components/Button';
import StatusBadge from '../../../components/StatusBadge';
import showConfirmDialog from '../../../components/ConfirmDialog';
import { LoadingState, EmptyState, ErrorState } from '../../../components/States';

type WorkflowTab = 'reviews' | 'changes';

export default function WorkflowsScreen() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<WorkflowTab>('reviews');

  const { items: reviews, loading: loadingReviews, updating: updatingReviews, deleting: deletingReviews } = useAppSelector((state) => state.reviews);
  const { items: changeRequests, loading: loadingChanges, processing: processingChanges } = useAppSelector((state) => state.changeRequests);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // 1. Fetch data on Tab change / mount
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'reviews') {
        dispatch(fetchReviews());
      } else {
        dispatch(fetchChangeRequests());
      }
    }
  }, [dispatch, activeTab, isAuthenticated]);

  const handleRefresh = () => {
    if (activeTab === 'reviews') {
      dispatch(fetchReviews());
    } else {
      dispatch(fetchChangeRequests());
    }
  };

  // --- REVIEWS HANDLERS ---
  const handleApproveReview = (id: number) => {
    dispatch(updateReviewStatus({ id, status: 'approved' }));
  };

  const handleDeleteReview = (id: number, name: string) => {
    showConfirmDialog({
      title: 'Delete Review',
      message: `Are you sure you want to permanently delete the review from "${name}"?`,
      confirmText: 'Delete',
      onConfirm: () => {
        dispatch(deleteReview(id));
      },
    });
  };

  // --- CHANGES HANDLERS ---
  const handleApproveChange = (id: number) => {
    showConfirmDialog({
      title: 'Approve Change Request',
      message: 'Are you sure you want to execute and apply this change request to the database?',
      confirmText: 'Approve',
      onConfirm: () => {
        dispatch(approveChangeRequest(id));
      },
    });
  };

  const handleRejectChange = (id: number) => {
    showConfirmDialog({
      title: 'Reject Change Request',
      message: 'Enter rejection reason:',
      confirmText: 'Reject',
      onConfirm: () => {
        // Trigger a simple rejection thunk
        dispatch(rejectChangeRequest({ id, reason: 'Rejected by administrator via mobile app.' }));
      },
    });
  };

  // --- RENDER ITEMS ---
  const renderReviewItem = ({ item }: { item: any }) => {
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.reviewerName}>{item.clientName}</Text>
          <Text style={styles.ratingText}>{stars}</Text>
        </View>
        <Text style={styles.companySub}>{item.clientCompany}</Text>
        <Text style={styles.reviewContent}>"{item.reviewText}"</Text>
        
        <View style={styles.actionRow}>
          {item.status !== 'approved' && (
            <Button
              title="Approve"
              onPress={() => handleApproveReview(item.id)}
              isLoading={updatingReviews}
              style={[styles.actionBtn, styles.approveBtn]}
            />
          )}
          <Button
            title="Delete"
            onPress={() => handleDeleteReview(item.id, item.clientName)}
            variant="danger"
            isLoading={deletingReviews}
            style={styles.actionBtn}
          />
        </View>
      </BentoCard>
    );
  };

  const renderChangeItem = ({ item }: { item: any }) => {
    const requestedBy = item.requestedByName ? `${item.requestedByName} (${item.requestedByEmail})` : 'Employee';
    return (
      <BentoCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.entityTitle}>Request ID: #{item.id}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.changeMeta}><Text style={styles.bold}>Resource: </Text>{item.entityType.toUpperCase()} (ID: {item.entityId})</Text>
        <Text style={styles.changeMeta}><Text style={styles.bold}>Requested By: </Text>{requestedBy}</Text>
        <Text style={styles.dateMeta}>Submitted: {new Date(item.createdAt).toLocaleDateString()}</Text>

        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            <Button
              title="Approve"
              onPress={() => handleApproveChange(item.id)}
              isLoading={processingChanges}
              style={[styles.actionBtn, styles.approveBtn]}
            />
            <Button
              title="Reject"
              onPress={() => handleRejectChange(item.id)}
              variant="secondary"
              isLoading={processingChanges}
              style={styles.actionBtn}
            />
          </View>
        )}
      </BentoCard>
    );
  };

  const isLoading = activeTab === 'reviews' ? loadingReviews : loadingChanges;
  const dataList = activeTab === 'reviews' ? reviews : changeRequests;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Workflows" subtitle="Client reviews & approval change requests" />

      {/* Segmented Tab Controls */}
      <View style={styles.tabsSelector}>
        <TouchableOpacity
          onPress={() => setActiveTab('reviews')}
          style={[styles.selectorTab, activeTab === 'reviews' && styles.activeSelectorTab]}
        >
          <Text style={[styles.selectorTabText, activeTab === 'reviews' && styles.activeSelectorTabText]}>
            Reviews ({reviews.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('changes')}
          style={[styles.selectorTab, activeTab === 'changes' && styles.activeSelectorTab]}
        >
          <Text style={[styles.selectorTabText, activeTab === 'changes' && styles.activeSelectorTabText]}>
            Approvals ({changeRequests.filter(c => c.status === 'pending').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={dataList}
        renderItem={activeTab === 'reviews' ? renderReviewItem : renderChangeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            title="Workflows Clear"
            description={
              activeTab === 'reviews'
                ? "No reviews are currently in the moderation queue."
                : "No pending change requests need your approval."
            }
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
  tabsSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    gap: 12,
  },
  selectorTab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeSelectorTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectorTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeSelectorTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingText: {
    fontSize: 13,
    color: '#FFB300',
  },
  companySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
    fontWeight: '600',
  },
  reviewContent: {
    fontSize: 13,
    color: COLORS.neutralDark,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
  },
  approveBtn: {
    backgroundColor: COLORS.accent,
  },
  entityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  changeMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  dateMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 12,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.text,
  },
});
