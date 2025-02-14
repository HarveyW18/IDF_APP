import React from 'react';
import { Slot } from 'expo-router';

export default function ViewLayout() {
  // Le composant <Slot /> permet de charger les sous-pages comme auth/login
  return <Slot />;
}
