import { auth, db } from './firebase';
import { ref, set, push } from 'firebase/database';
import { AI_API_KEY, AI_ENDPOINT } from '@env';

type Profile = { interest: string; skills: string[]; goals: string[] };
type RecItem = { title: string; description: string; areas?: string[] };


function localFallback(profile: Profile): RecItem[] {
  const i = (profile.interest || '').toLowerCase();
  if (i.includes('ia')) {
    return [
      { title: 'Fundamentos de IA', description: 'Conceitos básicos de IA e ML', areas: ['ML', 'Python'] },
      { title: 'Prática com Python + Pandas', description: 'Manipulação de dados e análise', areas: ['Python', 'Dados'] },
      { title: 'Introdução a Redes Neurais', description: 'Perceptron, ativações e treino', areas: ['NN', 'Keras'] },
    ];
  }
  if (i.includes('mobile')) {
    return [
      { title: 'React Native Básico', description: 'Componentes, navegação e estilo', areas: ['RN', 'Expo'] },
      { title: 'APIs e Estado', description: 'Fetch, hooks e contexto', areas: ['Hooks', 'REST'] },
      { title: 'Publicação', description: 'Build e publicação de app', areas: ['Android', 'iOS'] },
    ];
  }
  return [
    { title: 'Lógica de Programação', description: 'Raciocínio, variáveis e estruturas', areas: ['Algoritmos'] },
    { title: 'Soft Skills Essenciais', description: 'Comunicação e colaboração', areas: ['Soft Skills'] },
    { title: 'Projeto Guiado', description: 'Entregar um mini-projeto prático', areas: ['Projeto'] },
  ];
}

export async function recommendTracksWithChatGPT(profile: Profile) {
  // Tenta IA. Se falhar, usa fallback.
  let output: any;
  let source: 'openai' | 'fallback' = 'openai';
  let errorMsg: string | undefined;

  try {
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é um orientador educacional. Responda em JSON válido.' },
        {
          role: 'user',
          content: [
            'Gere 3–5 trilhas curtas e práticas alinhadas à empregabilidade.',
            `Interesse: ${profile.interest}`,
            `Skills: ${profile.skills.join(', ') || 'não informado'}`,
            `Metas: ${profile.goals.join(', ') || 'não informado'}`,
            'Formato JSON (array): [{"title":"","description":"","areas":["",""]}]',
          ].join('\n'),
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    };

    const res = await fetch(
      AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    console.log('OpenAI raw:', JSON.stringify(data, null, 2));

    if (!res.ok) {
      throw new Error(data?.error?.message || `HTTP ${res.status}`);
    }

    const content = data?.choices?.[0]?.message?.content?.trim() || '';
    try {
      const parsed = JSON.parse(content);
      output = Array.isArray(parsed) ? parsed : parsed?.items ?? parsed;
    } catch {
      output = content || localFallback(profile);
      if (typeof output === 'string') source = 'fallback';
    }
  } catch (e: any) {
    source = 'fallback';
    errorMsg = String(e?.message || e);
    console.warn('IA indisponível, usando fallback:', errorMsg);
    output = localFallback(profile);
  }

  const uid = auth.currentUser?.uid;
  if (uid) {
    const recRef = push(ref(db, `users/${uid}/recommendations`));
    await set(recRef, {
      timestamp: new Date().toISOString(),
      input: profile,
      output,
      source,                  // "openai" ou "fallback".
      error: errorMsg || null,
    });
  }

  return output;
}
