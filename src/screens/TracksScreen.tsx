import React from 'react';
import { Text, ScrollView } from 'react-native';
import CourseCard from '../components/CourseCard';
export default function TracksScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Trilhas recomendadas</Text>
      <CourseCard item={{ id: 'ia_basico', title: 'IA Básico', description: 'Fundamentos de IA', banner: '' }} />
    </ScrollView>
  );
}
