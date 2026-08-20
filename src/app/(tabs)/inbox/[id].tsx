import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAuditById, updateAuditStatus, deleteAudit } from '../../../store/thunks/auditThunks';
import { clearSelectedAudit } from '../../../store/slices/auditsSlice';
import { COLORS } from '../../../constants/colors';
import BentoCard from '../../../components/BentoCard';
import Button from '../../../components/Button';
import StatusBadge from '../../../components/StatusBadge';
import { LoadingState, ErrorState } from '../../../components/States';
import showConfirmDialog from '../../../components/ConfirmDialog';
import { AuditStatus } from '../../../types/audit';

export default function InboxDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auditId = Number(id);

  const { selectedAudit, loadingDetail, updating, deleting, error } = useAppSelector(
    (state) => state.audits
  );

  useEffect(() => {
    dispatch(fetchAuditById(auditId));
    return () => {
      dispatch(clearSelectedAudit());
    };
  }, [dispatch, auditId]);

  const handleStatusChange = (status: AuditStatus) => {
    if (selectedAudit) {
      dispatch(updateAuditStatus({ id: selectedAudit.id, status }));
    }
  };

  const handleDelete = () => {
    if (!selectedAudit) return;
    showConfirmDialog({
      title: 'Delete Lead',
      message: `Are you sure you want to permanently delete the audit lead for "${selectedAudit.company}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        const res = await dispatch(deleteAudit(selectedAudit.id));
        if (deleteAudit.fulfilled.match(res)) {
          router.back();
        }
      },
    });
  };

  const handleOpenStore = async () => {
    if (!selectedAudit || !selectedAudit.company) return;
    let url = selectedAudit.company.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('[Linking] Failed to redirect:', err);
    }
  };

  if (loadingDetail && !selectedAudit) {
    return <LoadingState message="Fetching message details..." />;
  }

  if (error && !selectedAudit) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchAuditById(auditId))} />;
  }

  if (!selectedAudit) {
    return <ErrorState message="Message details not found." onRetry={() => router.back()} />;
  }

  const fullName = `${selectedAudit.firstName} ${selectedAudit.lastName || ''}`.trim();
  
  let bottleneck = 'Not specified';
  let notes = 'None provided';
  if (selectedAudit.message) {
    const lines = selectedAudit.message.split('\n');
    const bottleneckLine = lines.find((l: string) => l.startsWith('Biggest Store Bottleneck:') || l.startsWith('Biggest Bottleneck:'));
    if (bottleneckLine) {
      bottleneck = bottleneckLine.split(':')[1]?.trim() || bottleneck;
    }
    const notesIdx = selectedAudit.message.indexOf('Additional Notes:');
    if (notesIdx !== -1) {
      notes = selectedAudit.message.substring(notesIdx + 17).trim() || notes;
    }
  }

  const statusOptions: AuditStatus[] = ['new', 'contacted', 'archived'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Top Header Card */}
      <BentoCard style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.companyTitle}>{selectedAudit.company || 'Shopify Store'}</Text>
          <StatusBadge status={selectedAudit.status} />
        </View>
        <Text style={styles.headerSubtitle}>Submitted: {new Date(selectedAudit.createdAt).toLocaleDateString()}</Text>
        
        <Button
          title="Open Shopify Store URL ↗"
          onPress={handleOpenStore}
          variant="secondary"
          style={styles.openUrlBtn}
        />
      </BentoCard>

      {/* Leads Fields details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lead Information</Text>
        
        <BentoCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Name</Text>
            <Text style={styles.value}>{fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Work Email</Text>
            <Text style={styles.value}>{selectedAudit.email}</Text>
          </View>
          {selectedAudit.phone ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{selectedAudit.phone}</Text>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Main Bottleneck</Text>
            <Text style={[styles.value, styles.bottleneckValue]}>{bottleneck}</Text>
          </View>
        </BentoCard>
      </View>

      {/* Additional Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <BentoCard style={styles.notesCard}>
          <Text style={styles.notesText}>{notes}</Text>
        </BentoCard>
      </View>

      {/* Action Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lead Moderation</Text>
        
        <BentoCard style={styles.actionCard}>
          <Text style={styles.actionLabel}>Update Lead Status</Text>
          
          <View style={styles.statusButtonsContainer}>
            {statusOptions.map((st) => (
              <TouchableOpacity
                key={st}
                disabled={updating}
                onPress={() => handleStatusChange(st)}
                style={[
                  styles.statusButton,
                  selectedAudit.status === st && styles.activeStatusButton
                ]}
              >
                {updating && selectedAudit.status !== st ? (
                  <ActivityIndicator size="small" color={COLORS.text} />
                ) : (
                  <Text
                    style={[
                      styles.statusButtonText,
                      selectedAudit.status === st && styles.activeStatusButtonText
                    ]}
                  >
                    {st}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title={deleting ? "Deleting..." : "Delete Lead Messages"}
            onPress={handleDelete}
            variant="danger"
            isLoading={deleting}
            style={styles.deleteBtn}
          />
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
    padding: 20,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 20,
  },
  headerCard: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 20,
  },
  openUrlBtn: {
    height: 44,
    borderRadius: 22,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  infoCard: {
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  bottleneckValue: {
    color: COLORS.primary,
  },
  notesCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  notesText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  actionCard: {
    padding: 20,
    gap: 20,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  activeStatusButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  activeStatusButtonText: {
    color: '#FFFFFF',
  },
  deleteBtn: {
    height: 48,
    borderRadius: 24,
  },
});
