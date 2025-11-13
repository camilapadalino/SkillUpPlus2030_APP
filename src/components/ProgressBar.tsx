import React from 'react';
import { View } from 'react-native';
export default function ProgressBar({ value = 0 }: { value?: number }) {
  return (
    <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
      <View style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, height: 8, backgroundColor: '#4f46e5', borderRadius: 4 }} />
    </View>
  );
}
