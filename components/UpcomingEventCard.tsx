import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UpcomingEventCardProps {
  title: string;
  details: string;
  location: string;
}

export function UpcomingEventCard({ title, details, location }: UpcomingEventCardProps) {
  return (
    <View style={styles.upcomingCard}>
      <Text style={styles.upcomingTitle}>{title}</Text>
      <Text style={styles.upcomingDetails}>{details}</Text>
      <Text style={styles.upcomingLocation}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  upcomingCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  upcomingDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  upcomingLocation: {
    fontSize: 14,
    color: '#64748b',
  },
});
