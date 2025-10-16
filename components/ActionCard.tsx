import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { LucideProps } from 'lucide-react-native';

interface ActionCardProps {
  href: string;
  icon: React.ElementType<LucideProps>;
  text: string;
}

export function ActionCard({ href, icon: Icon, text }: ActionCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.actionItem}>
        <Icon size={24} color="#0891b2" />
        <Text style={styles.actionText}>{text}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
