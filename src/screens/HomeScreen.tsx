import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';
import CourseCard from '../components/CourseCard';
export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  useEffect(() => {
    const r = ref(db, 'tracks');
    return onValue(r, snap => {
      const val = snap.val() || {};
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      setTracks(list);
    });
  }, []);
  const filtered = tracks.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Buscar trilhas..." value={search} onChangeText={setSearch} style={styles.input} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filtered.map(t => (<CourseCard key={t.id} item={t} />))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  input: { margin: 16, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
});
