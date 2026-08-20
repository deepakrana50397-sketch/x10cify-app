import React from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

interface ToggleRowProps {
  title: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  isLoading?: boolean;
  description?: string;
}

export default function ToggleRow({
  title,
  value,
  onValueChange,
  isLoading = false,
  description,
}: ToggleRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
      ) : (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
          thumbColor={value ? '#FFFFFF' : '#F5F5F5'}
          ios_backgroundColor="#E0E0E0"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  loader: {
    paddingHorizontal: 12,
  },
});
