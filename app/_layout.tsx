import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { useEffect } from "react";
import { authService } from "../src/api/AuthService";

interface DrawerIconProps {
  color: string;
  size: number;
}

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authService.isAuthenticated();
      const isLoginPage = segments[0] === "auth" && segments[1] === "login";

      if (!isAuthenticated && !isLoginPage) {
        // If not authenticated and not on login page, redirect to login
        router.replace("/auth/login");
      } else if (isAuthenticated && isLoginPage) {
        // If authenticated and on login page, redirect to customer list
        router.replace("/customers/index");
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#09122C',
        },
        headerTintColor: '#F2F2F2',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#27548A',
        drawerInactiveTintColor: '#2A4759',
        drawerStyle: {
          backgroundColor: '#FDFAF6',
          width: 220,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="customers/index"
        options={{
          drawerLabel: "Customers",
          title: "Customers",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      /> 
      <Drawer.Screen
        name="customers/create"
        options={{
          drawerLabel: "Create Customer",
          title: "Customers",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      /> 
      <Drawer.Screen
        name="customers/[id]"
        options={{
          drawerLabel: "Customer Details",
          title: "Customer Details",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' }, // Hide from drawer
        }}
      />
      <Drawer.Screen
        name="auth/login"
        options={{
          drawerLabel: "Logout",
          title: "Login",
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
          drawerItemStyle: { marginTop: 'auto' }, // Push to bottom
        }}
        listeners={{
          drawerItemPress: async (e) => {
            e.preventDefault();
            await authService.logout();
          },
        }}
      />
    </Drawer>
  );
}
