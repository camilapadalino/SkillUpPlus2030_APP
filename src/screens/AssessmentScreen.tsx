import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { ref, set } from 'firebase/database';
import { auth, db } from '../services/firebase';
import { recommendTracksWithChatGPT } from '../services/ai';

export default function AssessmentScreen() {
  const [interest, setInterest] = useState('');
  const [skills, setSkills] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleSubmit = async () => {
  if (!interest || !skills || !goals) {
    return Alert.alert('Campos obrigatórios', 'Preencha interesse, skills e metas.');
  }
  setLoading(true);
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Usuário não autenticado.');

    const profile = {
      interest,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      goals: goals.split(',').map(g => g.trim()).filter(Boolean),
    };

    await set(ref(db, `users/${uid}/profile`), profile);

    const result = await recommendTracksWithChatGPT(profile);

    setRecommendations(result);
    Alert.alert(
      'Recomendações geradas',
      Array.isArray(result)
        ? `Foram sugeridas ${result.length} trilhas.`
        : 'Sugestões prontas!'
    );
  } catch (e: any) {
    Alert.alert('Aviso', String(e?.message || 'Não foi possível gerar agora.'));
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Autoavaliação</Text>
      <Text style={styles.label}>Área de interesse</Text>
      <TextInput
        placeholder="Ex: Desenvolvimento Mobile, IA, UX..."
        style={styles.input}
        value={interest}
        onChangeText={setInterest}
      />

      <Text style={styles.label}>Principais habilidades</Text>
      <TextInput
        placeholder="Separe por vírgulas (ex: React, lógica, trabalho em equipe)"
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
      />

      <Text style={styles.label}>Metas profissionais</Text>
      <TextInput
        placeholder="Separe por vírgulas (ex: crescer na área, empreender, liderar projetos)"
        style={styles.input}
        value={goals}
        onChangeText={setGoals}
      />

      <Button title={loading ? 'Gerando...' : 'Gerar recomendações'} onPress={handleSubmit} disabled={loading} />

      {recommendations && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Sugestões da IA:</Text>
          {Array.isArray(recommendations)
            ? recommendations.map((r: any, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.cardText}>{r.description}</Text>
                  <Text style={styles.cardText}>Áreas: {r.areas || '—'}</Text>
                </View>
              ))
            : <Text style={styles.cardText}>{JSON.stringify(recommendations, null, 2)}</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { marginTop: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginTop: 6 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  card: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontWeight: '700' },
  cardText: { color: '#444', marginTop: 4 },
});
