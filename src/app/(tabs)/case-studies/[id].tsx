import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCaseStudyById, updateCaseStudy } from '../../../store/thunks/caseStudyThunks';
import { clearSelectedCaseStudy } from '../../../store/slices/caseStudiesSlice';
import { COLORS } from '../../../constants/colors';
import BentoCard from '../../../components/BentoCard';
import Button from '../../../components/Button';
import { LoadingState, ErrorState } from '../../../components/States';

export default function EditCaseStudyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const studyId = Number(id);

  const { selectedCaseStudy, loading, saving, error } = useAppSelector((state) => state.caseStudies);

  // Local Form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchCaseStudyById(studyId));
    return () => {
      dispatch(clearSelectedCaseStudy());
    };
  }, [dispatch, studyId]);

  // Load backend details into form state
  useEffect(() => {
    if (selectedCaseStudy) {
      setTitle(selectedCaseStudy.title || '');
      setClientName(selectedCaseStudy.clientName || '');
      setCategory(selectedCaseStudy.category || '');
      setYear(selectedCaseStudy.year || '');
      setDescription(selectedCaseStudy.description || '');
    }
  }, [selectedCaseStudy]);

  const handleSave = async () => {
    if (!title.trim() || !clientName.trim() || !category.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = await dispatch(
      updateCaseStudy({
        id: studyId,
        data: {
          title: title.trim(),
          clientName: clientName.trim(),
          category: category.trim(),
          year: year.trim(),
          description: description.trim(),
        },
      })
    );

    if (updateCaseStudy.fulfilled.match(res)) {
      router.back();
    }
  };

  if (loading && !selectedCaseStudy) {
    return <LoadingState message="Fetching case study details..." />;
  }

  if (error && !selectedCaseStudy) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchCaseStudyById(studyId))} />;
  }

  if (!selectedCaseStudy) {
    return <ErrorState message="Case study not found." onRetry={() => router.back()} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Case Study</Text>
          <Text style={styles.subtitle}>Modifying: {selectedCaseStudy.clientName}</Text>
        </View>

        {/* Form Card */}
        <BentoCard style={styles.formCard}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              value={clientName}
              onChangeText={setClientName}
              placeholder="e.g. Muddy Bites"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Storefront Conversion Optimization"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Speed & Conversion Engineering"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              placeholder="e.g. 2026"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description Summary</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholder="Enter brief description summary..."
              placeholderTextColor={COLORS.textMuted}
              style={[styles.input, styles.textarea]}
            />
          </View>

          {error && <Text style={styles.errorText}>⚠️ {error}</Text>}

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="secondary"
              style={styles.actionBtn}
            />
            <Button
              title={saving ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              isLoading={saving}
              style={styles.actionBtn}
            />
          </View>

        </BentoCard>

      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  formCard: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
