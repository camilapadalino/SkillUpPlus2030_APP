// src/screens/TrackDetailScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, set, update } from 'firebase/database';
import { db, auth } from '../services/firebase';
import ProgressBar from '../components/ProgressBar';

type Lesson = { title: string; duration?: number; content?: string };
type Track = { id: string; title: string; description?: string; lessons?: Record<string, Lesson> };

export default function TrackDetailScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const [track, setTrack] = useState<Track | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({}); // aulas concluídas do usuário

  // carrega dados da trilha
  useEffect(() => {
    const r = ref(db, `tracks/${id}`);
    return onValue(r, snap => setTrack(snap.val()));
  }, [id]);

  // carrega progresso do usuário nessa trilha
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const r = ref(db, `users/${uid}/progress/${id}`);
    return onValue(r, snap => setDone(snap.val() || {}));
  }, [id]);

  const lessons = useMemo(() => track?.lessons ? Object.entries(track.lessons) : [], [track]);
  const pct = useMemo(() => {
    if (!lessons.length) return 0;
    const doneCount = lessons.filter(([lid]) => done?.[lid]).length;
    return doneCount / lessons.length;
  }, [lessons, done]);

  const startCourse = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return Alert.alert('Faça login para iniciar.');
    // cria um resumo inicial
    await set(ref(db, `users/${uid}/progressSummary/${id}`), 0);
    Alert.alert('Trilha iniciada', 'Bom estudo!');
  };

  const toggleLesson = async (lessonId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return Alert.alert('Faça login para registrar progresso.');
    const next = !done?.[lessonId];
    // marca/desmarca a aula
    await update(ref(db, `users/${uid}/progress/${id}`), { [lessonId]: next });
    // atualiza o resumo
    const total = lessons.length || 1;
    const completed = lessons.filter(([lid]) => (lid === lessonId ? next : done?.[lid])).length;
    await set(ref(db, `users/${uid}/progressSummary/${id}`), completed / total);
  };

  if (!track) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{track.title}</Text>
      <Text style={styles.desc}>{track.description}</Text>

      <View style={styles.progressRow}>
        <Text style={{fontWeight:'600'}}>Progresso</Text>
        <Text>{Math.round(pct * 100)}%</Text>
      </View>
      <ProgressBar value={pct} />

      <View style={{ height: 12 }} />
      <Button title="Iniciar trilha" onPress={startCourse} />

      <Text style={[styles.title, {marginTop: 16}]}>Aulas</Text>
      {lessons.length === 0 ? (
        <Text>Sem aulas cadastradas ainda.</Text>
      ) : (
        lessons.map(([lid, l]) => (
          <TouchableOpacity key={lid} style={styles.lesson} onPress={() => toggleLesson(lid)}>
            <View style={{flex:1}}>
              <Text style={{fontWeight:'600'}}>{l.title}</Text>
              {!!l.duration && <Text style={{color:'#555'}}>{l.duration} min</Text>}
            </View>
            <Text style={{color: done?.[lid] ? '#16a34a' : '#aaa'}}>
              {done?.[lid] ? 'Concluída' : 'Concluir'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  desc: { color: '#444', marginBottom: 12 },
  lesson: {
    padding: 12,
    borderWidth: 1, borderColor: '#eee',
    borderRadius: 10, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }
});
