import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../services/firebase';
import { colors } from '../theme/colors';

type RecommendationItem = {
  timestamp?: string;
  input?: {
    interest?: string;
    skills?: string[];
    goals?: string[];
  };
  output?: any;
  source?: string;
};

type RecommendedTrack = {
  title?: string;
  description?: string;
  areas?: string[] | string;
};

export default function TracksScreen() {
  const [lastRec, setLastRec] = useState<RecommendationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      const r = ref(db, `users/${uid}/recommendations`);
      const unsub = onValue(
        r,
        snap => {
          const val = snap.val() || {};
          const arr: RecommendationItem[] = Object.values(val);

          if (!arr.length) {
            setLastRec(null);
            setLoading(false);
            return;
          }

          arr.sort((a, b) => {
            const ta = new Date(a.timestamp || 0).getTime();
            const tb = new Date(b.timestamp || 0).getTime();
            return tb - ta; 
          });

          setLastRec(arr[0]);
          setLoading(false);
        },
        error => {
          console.log('Erro ao ler recommendations:', error);
          setLastRec(null);
          setLoading(false);
        },
      );

      return () => unsub();
    } catch (e) {
      console.log('Erro inesperado em TracksScreen:', e);
      setLastRec(null);
      setLoading(false);
    }
  }, []);

  const tracks: RecommendedTrack[] = useMemo(() => {
    if (!lastRec || !lastRec.output) return [];

    const out = lastRec.output;

    if (Array.isArray(out)) {
      return out as RecommendedTrack[];
    }

    if (out && typeof out === 'object' && Array.isArray((out as any).items)) {
      return (out as any).items as RecommendedTrack[];
    }

    return [];
  }, [lastRec]);

  
  if (!auth.currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Trilhas recomendadas</Text>
        <Text style={styles.text}>
          Faça login para ver recomendações personalizadas.
        </Text>
      </View>
    );
  }

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[styles.text, { marginTop: 8 }]}>
          Carregando suas recomendações...
        </Text>
      </View>
    );
  }


  if (!lastRec || tracks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Trilhas recomendadas</Text>
        <Text style={styles.text}>
          Você ainda não possui trilhas recomendadas.
        </Text>
        <Text style={[styles.text, { marginTop: 4 }]}>
          Acesse a tela de{' '}
          <Text style={styles.highlight}>Autoavaliação (IA)</Text> pelo menu
          lateral para gerar suas primeiras recomendações.
        </Text>
      </View>
    );
  }

  const interest = lastRec.input?.interest;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trilhas recomendadas</Text>

      {interest ? (
        <Text style={styles.text}>
          Baseado no seu interesse em{' '}
          <Text style={styles.highlight}>{interest}</Text>.
        </Text>
      ) : (
        <Text style={styles.text}>
          Essas trilhas foram geradas a partir da sua última autoavaliação.
        </Text>
      )}

      {tracks.map((track, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>
            {track?.title || 'Trilha sem título'}
          </Text>
          {!!track?.description && (
            <Text style={styles.cardDesc}>{track.description}</Text>
          )}
          {track?.areas && (
            <Text style={styles.cardAreas}>
              Áreas:{' '}
              {Array.isArray(track.areas)
                ? track.areas.join(', ')
                : track.areas}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  highlight: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  cardAreas: {
    fontSize: 12,
    color: colors.primaryDark,
    marginTop: 6,
  },
});
