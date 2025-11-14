import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Text } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';
import CourseCard from '../components/CourseCard';
import { colors } from '../theme/colors';

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

  const filtered = tracks.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Buscar trilhas..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Trilhas mais visitadas</Text>
          <Text style={styles.sectionSubtitle}>
            Usuários têm acessado mais estas trilhas recentemente.
          </Text>
        </View>

        {filtered.map(t => (
          <CourseCard key={t.id} item={t} />
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A7E8C', 
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#555',
    opacity: 0.9,
  },
});
