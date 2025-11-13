// src/screens/ODSScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const odsData = [
  {
    id: 4,
    title: 'ODS 4 — Educação de Qualidade',
    color: '#3b82f6',
    bullets: [
      'Trilhas de aprendizagem personalizadas para cada perfil.',
      'Uso de IA para orientar estudos e sugerir conteúdos.',
      'Estimula aprendizagem contínua em habilidades digitais.',
    ],
  },
  {
    id: 8,
    title: 'ODS 8 — Trabalho Decente e Crescimento Econômico',
    color: '#22c55e',
    bullets: [
      'Foco em habilidades com alta empregabilidade (tech, dados, inovação).',
      'Apoia quem quer primeiro emprego, estágio ou transição de carreira.',
      'Ajuda a planejar uma trajetória profissional sustentável.',
    ],
  },
  {
    id: 9,
    title: 'ODS 9 — Indústria, Inovação e Infraestrutura',
    color: '#f97316',
    bullets: [
      'Integra tecnologias atuais: apps mobile, Firebase e IA generativa.',
      'Estimula projetos e soluções digitais baseadas em dados.',
      'Mostra, na prática, como construir produtos digitais inovadores.',
    ],
  },
  {
    id: 10,
    title: 'ODS 10 — Redução das Desigualdades',
    color: '#a855f7',
    bullets: [
      'Facilita o acesso a conteúdos de qualificação para diferentes perfis.',
      'Permite que cada pessoa monte sua própria trilha de estudo.',
      'Apoia inclusão digital e social por meio da requalificação profissional.',
    ],
  },
];

export default function ODSScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Conexão com os ODS</Text>
      <Text style={styles.subheading}>
        O SkillUpPlus 2030+ apoia a Agenda 2030 da ONU, especialmente os ODS 4, 8, 9 e 10 — 
        educação, trabalho decente, inovação e redução das desigualdades.
      </Text>

      {odsData.map(ods => (
        <View key={ods.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.chip,
                { borderColor: ods.color, backgroundColor: ods.color + '15' },
              ]}
            >
              <Text style={[styles.chipText, { color: ods.color }]}>
                ODS {ods.id}
              </Text>
            </View>
            <Text style={styles.cardTitle}>{ods.title}</Text>
          </View>

          {ods.bullets.map((b, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: ods.color }]}>•</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.footer}>
        Assim, o app não é só um catálogo de cursos, mas um orientador de jornada profissional
        alinhado com os desafios globais até 2030.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f3f4f6',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  subheading: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  bulletDot: {
    fontSize: 16,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
  },
  footer: {
    marginTop: 12,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
});
