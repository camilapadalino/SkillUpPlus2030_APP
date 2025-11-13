import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function CourseCard({ item }: { item: any }) {
  const nav = useNavigation<any>();
  return (
    <TouchableOpacity style={styles.card} onPress={() => nav.navigate('TrackDetail', { id: item.id })}>
      <Image source={{ uri: item.banner || 'https://placehold.co/120x80' }} style={styles.img} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 12 },
  img: { width: 120, height: 80, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { color: '#555' },
});
