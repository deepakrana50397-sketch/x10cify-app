import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import BentoCard from '../../../components/BentoCard';
import { Ionicons } from '@expo/vector-icons';

interface DirectoryItem {
  name: string;
  route: string;
  description: string;
  icon: keyof typeof Ionicons.prototype.placeholder | any;
  color: string;
  badgeCount?: number;
}

export default function ContentHubScreen() {
  const router = useRouter();

  const directories: DirectoryItem[] = [
    {
      name: 'Site Pages',
      route: '/(tabs)/content/pages',
      description: 'Manage landing pages meta settings and visibility.',
      icon: 'document-text',
      color: '#E3F2FD',
    },
    {
      name: 'Blogs & Articles',
      route: '/(tabs)/content/blogs',
      description: 'Write, moderate, and publish storefront articles.',
      icon: 'book',
      color: '#FFF3E0',
    },
    {
      name: 'Services list',
      route: '/(tabs)/content/services',
      description: 'Shopify audits, CRO, speed optimization CMS categories.',
      icon: 'sparkles',
      color: '#E8F5E9',
    },
    {
      name: 'Industries list',
      route: '/(tabs)/content/industries',
      description: 'Configure active client industries sections.',
      icon: 'business',
      color: '#F3E5F5',
    },
    {
      name: 'Case Studies',
      route: '/(tabs)/case-studies', // Reuses the case studies list page
      description: 'Toggle client portfolio case studies visibility.',
      icon: 'folder-open',
      color: '#FFFDE7',
    },
    {
      name: 'FAQs list',
      route: '/(tabs)/content/faqs',
      description: 'Moderate customer speed and CRO FAQs accordions.',
      icon: 'help-circle',
      color: '#E0F7FA',
    },
    {
      name: 'Homepage Sections',
      route: '/(tabs)/content/sections', // Relocated section switches
      description: 'Toggle hero, comparisons, sections visibility.',
      icon: 'desktop',
      color: '#FFEBEE',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader title="Content Hub" subtitle="Manage storefront layouts & CMS" />

      <View style={styles.grid}>
        {directories.map((item) => (
          <BentoCard
            key={item.name}
            onPress={() => router.push(item.route as any)}
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={22} color={COLORS.neutralDark} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </BentoCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 110,
  },
  grid: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingRight: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
});
