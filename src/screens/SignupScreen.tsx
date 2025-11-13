import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../services/firebase';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSignup() {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha email e senha.');
    if (password.length < 6) return Alert.alert('Atenção', 'Senha deve ter 6+ caracteres.');

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await set(ref(db, `users/${cred.user.uid}`), {
        name: name,
        email: email,
      });
      await set(ref(db, `users/${cred.user.uid}/profile`), {
        email: email.trim(),
        interests: [],
        skills: [],
        goals: [],
        createdAt: Date.now(),
      });
      Alert.alert('Conta criada', 'Você já pode usar o app.');
    } catch (e: any) {
      Alert.alert('Erro ao criar', traduzErro(e?.code) || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput placeholder='Nome Completo' value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Senha (6+)" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {loading ? <ActivityIndicator /> : 
      <Button title="Cadastrar" onPress={onSignup} />}
    </View>
  );
}

function traduzErro(code?: string) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Este email já está cadastrado.';
    case 'auth/invalid-email': return 'Email inválido.';
    case 'auth/weak-password': return 'Senha fraca (use 6+ caracteres).';
    default: return '';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
});
