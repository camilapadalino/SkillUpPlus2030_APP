import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../services/firebase';

type RecommendationItem = {
  timestamp?: string;
  input?: {
    interest?: string;
    skills?: string[];
    goals?: string[];
  };
  output?: any;
  source?: 'openai' | 'fallback' | string;
  error?: string | null;
};

export default function RecommendationsScreen() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const r = ref(db, `users/${uid}/recommendations`);
    const unsub = onValue(r, snap => {
      const val = snap.val() || {};
      const arr: RecommendationItem[] = Object.values(val);
      // ordena por data (mais recente primeiro)
      arr.sort((a, b) => {
        const ta = new Date(a.timestamp || 0).getTime();
        const tb = new Date(b.timestamp || 0).getTime();
        return tb - ta;
      });
      setItems(arr);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando histórico...</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center' }}>
          Nenhuma recomendação gerada ainda.{'\n'}
          Use a tela de Autoavaliação para gerar suas primeiras trilhas.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Histórico de Recomendações</Text>

      {items.map((item, index) => {
        const date = item.timestamp
          ? new Date(item.timestamp).toLocaleString()
          : 'Data não informada';

        const interest = item.input?.interest || '—';
        const skills = (item.input?.skills || []).join(', ') || '—';
        const goals = (item.input?.goals || []).join(', ') || '—';

        const sourceLabel =
          item.source === 'openai'
            ? 'IA (OpenAI)'
            : item.source === 'fallback'
            ? 'Sugestão local'
            : '—';

        // tenta exibir quantidade de trilhas sugeridas
        let count = 0;
        if (Array.isArray(item.output)) count = item.output.length;
        else if (Array.isArray((item.output as any)?.items))
          count = (item.output as any).items.length;

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.chip}>{sourceLabel}</Text>

            <Text style={styles.label}>Interesse</Text>
            <Text style={styles.value}>{interest}</Text>

            <Text style={styles.label}>Skills</Text>
            <Text style={styles.value}>{skills}</Text>

            <Text style={styles.label}>Metas</Text>
            <Text style={styles.value}>{goals}</Text>

            <Text style={styles.label}>Trilhas sugeridas</Text>
            <Text style={styles.value}>
              {count > 0 ? `${count} trilhas` : 'Ver detalhes abaixo'}
            </Text>

            {/* resumo simples do output */}
            {Array.isArray(item.output) && (
              <View style={{ marginTop: 8 }}>
                {item.output.slice(0, 3).map((r: any, i: number) => (
                  <View key={i} style={styles.track}>
                    <Text style={styles.trackTitle}>{r.title || 'Sem título'}</Text>
                    {!!r.description && (
                      <Text style={styles.trackDesc}>{r.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {!!item.error && (
              <Text style={styles.error}>
                Obs.: houve um erro na chamada da IA: {item.error}
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    color: '#4b5563',
  },
  value: {
    fontSize: 13,
    color: '#111827',
  },
  track: {
    marginTop: 4,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  trackDesc: {
    fontSize: 12,
    color: '#4b5563',
  },
  error: {
    marginTop: 6,
    fontSize: 11,
    color: '#b91c1c',
  },
});
