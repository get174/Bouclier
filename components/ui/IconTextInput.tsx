import React from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface IconTextInputProps extends TextInputProps {
  icon: LucideIcon;
  label: string;
}

export default function IconTextInput({ icon: Icon, label, ...props }: IconTextInputProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Icon size={20} color="#64748b" />
        <TextInput
          style={styles.input}
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#334155',
  },
});
