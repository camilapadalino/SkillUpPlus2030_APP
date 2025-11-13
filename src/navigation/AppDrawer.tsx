// src/navigation/AppDrawer.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AppTabs from './AppTabs';
import AssessmentScreen from '../screens/AssessmentScreen';
import ODSScreen from '../screens/ODSScreen';
import { colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: colors.primaryDark,
        drawerInactiveTintColor: colors.muted,
        drawerActiveBackgroundColor: colors.primaryLight + '22',
        drawerLabelStyle: { fontSize: 14, fontWeight: '500' },
        sceneContainerStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={AppTabs}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Autoavaliação"
        component={AssessmentScreen}
        options={{ title: 'Autoavaliação (IA)' }}
      />
      <Drawer.Screen
        name="ODS"
        component={ODSScreen}
        options={{ title: 'ODS e Impacto' }}
      />
    </Drawer.Navigator>
  );
}
