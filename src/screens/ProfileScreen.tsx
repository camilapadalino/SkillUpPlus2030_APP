import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { auth, db } from '../services/firebase';
import { ref, get, set } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


export default function ProfileScreen() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [skills, setSkills] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  }

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const snapUser = await get(ref(db, `users/${user.uid}`));
        if (snapUser.exists()) {
          const u = snapUser.val();
          setName(u.name || '');
        }
        const snap = await get(ref(db, `users/${user.uid}/profile`));
        if (snap.exists()) {
          const data = snap.val();
          setInterest(data.interest || '');
          setSkills(
            Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
          );
          setGoals(
            Array.isArray(data.goals) ? data.goals.join(', ') : data.goals || '',
          );
        }
      } catch (e) {
        console.warn('Erro ao carregar perfil', e);
      }
    }
    load();
  }, [user]);

  async function handleSave() {
    if (!user) return Alert.alert('Erro', 'Usuário não autenticado.');

    setLoading(true);
    try {
      const profile = {
        interest,
        skills: skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        goals: goals
          .split(',')
          .map(g => g.trim())
          .filter(Boolean),
      };

      await set(ref(db, `users/${user.uid}/profile`), profile);
      Alert.alert('Perfil', 'Dados salvos com sucesso!');
    } catch (e: any) {
      Alert.alert('Erro', String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.userName}>👤 {name}</Text>

        <Text style={styles.label}>Área de interesse</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Desenvolvimento Back-end, IA, Mobile..."
          value={interest}
          onChangeText={setInterest}
        />

        <Text style={styles.label}>Habilidades (separe por vírgula)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Java, lógica, comunicação..."
          value={skills}
          onChangeText={setSkills}
        />

        <Text style={styles.label}>Metas (separe por vírgula)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex.: crescer na área, conseguir estágio..."
          value={goals}
          onChangeText={setGoals}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>SAIR DO PERFIL</Text>
        </TouchableOpacity>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
  },
  userName: {
  fontSize: 22,
  fontWeight: '700',
  marginBottom: 16,
  color: '#111827'
  },
  textArea: {
    minHeight: 80,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logoutButton: {
  backgroundColor: '#E11D48',
  padding: 14,
  borderRadius: 999,
  marginTop: 50,
  alignItems: 'center',
  },
logoutText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  },

});
