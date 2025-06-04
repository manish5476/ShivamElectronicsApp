import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
// app/_layout.tsx
// import { Redirect, Slot, SplashScreen } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { authService } from '../src/api/AuthService';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [isReady, setIsReady] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const isAuth = await authService.isAuthenticated();
//       setIsAuthenticated(isAuth);
//       setIsReady(true);
//       SplashScreen.hideAsync();
//     };
//     checkAuth();
//   }, []);

//   if (!isReady) return null;

//   if (isAuthenticated === false) return <Redirect href="/login" />;
//   if (isAuthenticated === true) return <Redirect href="/home" />;

//   return <Slot />;
// }
