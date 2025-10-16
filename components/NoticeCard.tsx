import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface NoticeCardProps {
  message: string;
}

export function NoticeCard({ message }: NoticeCardProps) {
  return (
    <View style={styles.noticeCard}>
      <AlertTriangle size={20} color="#dc2626" />
      <Text style={styles.noticeText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noticeCard: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  noticeText: {
    color: '#991b1b',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
