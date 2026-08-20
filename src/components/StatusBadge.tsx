import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'archived' | 'published' | 'draft';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'new':
        return { bg: COLORS.accentMuted, text: '#5D7A1D' };
      case 'contacted':
        return { bg: '#E3F2FD', text: '#0D47A1' };
      case 'published':
        return { bg: '#E8F5E9', text: '#1B5E20' };
      case 'draft':
      case 'archived':
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  const colors = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
