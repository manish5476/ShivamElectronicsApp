// // // src/components/HomePage.tsx
// // import { Image } from 'expo-image'; // Assuming expo-image is installed
// // import React, { useEffect, useState } from 'react';
// // import { ActivityIndicator, Button, Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';
// // import { authService } from '@/src/api/AuthService';
// // // Define a basic User interface to help with type checking
// // interface User {
// //   _id: string;
// //   name?: string; // Optional name field
// //   email: string;
// //   // Add any other user properties you expect from your API, e.g., avatar, role
// // }

// // export default function HomePage() {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loadingUser, setLoadingUser] = useState<boolean>(true);

// //   // useEffect hook to fetch user data when the component mounts
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       setLoadingUser(true); // Start loading
// //       try {
// //         const currentUser = await authService.getUser(); // Get user data from AuthService
// //         setUser(currentUser); // Set the user state
// //       } catch (error) {
// //         console.error('Failed to fetch user data:', error);
// //         // You might want to display an error message to the user here
// //       } finally {
// //         setLoadingUser(false); // Stop loading
// //       }
// //     };

// //     fetchUserData();
// //   }, []); // The empty dependency array ensures this runs only once when the component mounts

// //   // Function to handle logout
// //   const handleLogout = async () => {
// //     await authService.logout(); // Call the logout method from AuthService
// //     // The authService.logout() method is already configured to navigate to the login screen
// //   };

// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         {/* Display a welcome message with the user's name or email, or a loading message */}
// //         <ThemedText type="title">
// //           {loadingUser ? 'Loading User...' : `Welcome, ${user?.name || user?.email || 'User'}!`}
// //         </ThemedText>
// //         <HelloWave />
// //       </ThemedView>

// //       {/* Show a loading indicator if user data is still being fetched */}
// //       {loadingUser ? (
// //         <ThemedView style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color="#0000ff" />
// //           <ThemedText>Fetching your details...</ThemedText>
// //         </ThemedView>
// //       ) : (
// //         <>
// //           {/* Display user information if available */}
// //           {user && (
// //             <ThemedView style={styles.userInfoContainer}>
// //               <ThemedText type="subtitle">Your Account Details:</ThemedText>
// //               {user.name && <ThemedText>Name: {user.name}</ThemedText>}
// //               <ThemedText>Email: {user.email}</ThemedText>
// //               {/* Add more user specific details here if your API provides them */}
// //             </ThemedView>
// //           )}

// //           {/* Logout button */}
// //           <ThemedView style={styles.stepContainer}>
// //             <ThemedText type="subtitle">Actions</ThemedText>
// //             <Button title="Logout" onPress={handleLogout} color="#FF6347" /> {/* Using a red-ish color for logout */}
// //           </ThemedView>

// //           {/* Your original starter content, kept for context */}
// //           <ThemedView style={styles.stepContainer}>
// //             <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //             <ThemedText>
// //               Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //               Press{' '}
// //               <ThemedText type="defaultSemiBold">
// //                 {Platform.select({
// //                   ios: 'cmd + d',
// //                   android: 'cmd + m',
// //                   web: 'F12',
// //                 })}
// //               </ThemedText>{' '}
// //               to open developer tools.
// //             </ThemedText>
// //           </ThemedView>
// //           <ThemedView style={styles.stepContainer}>
// //             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //             <ThemedText>
// //               {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //             </ThemedText>
// //           </ThemedView>
// //           <ThemedView style={styles.stepContainer}>
// //             <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //             <ThemedText>
// //               {`When you're ready, run `}
// //               <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //               <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //               <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //               <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //             </ThemedText>
// //           </ThemedView>
// //         </>
// //       )}
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// //   loadingContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 20,
// //     minHeight: 100, // Give it some space
// //   },
// //   userInfoContainer: {
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 15,
// //     backgroundColor: 'rgba(0,0,0,0.05)', // A subtle background for user info
// //   },
// // });
// // src/components/HomePage.tsx
// // (Your fourth large code block goes here)
// import { Image } from 'expo-image';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Button, Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { authService } from '@/src/api/AuthService'; // Corrected path relative to src/components/HomePage.tsx

// interface User {
//   _id: string;
//   name?: string;
//   email: string;
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loadingUser, setLoadingUser] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoadingUser(true);
//       try {
//         const currentUser = await authService.getUser();
//         setUser(currentUser);
//       } catch (error) {
//         console.error('Failed to fetch user data:', error);
//       } finally {
//         setLoadingUser(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     await authService.logout();
//   };

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">
//           {loadingUser ? 'Loading User...' : `Welcome, ${user?.name || user?.email || 'User'}!`}
//         </ThemedText>
//         <HelloWave />
//       </ThemedView>

//       {loadingUser ? (
//         <ThemedView style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <ThemedText>Fetching your details...</ThemedText>
//         </ThemedView>
//       ) : (
//         <>
//           {user && (
//             <ThemedView style={styles.userInfoContainer}>
//               <ThemedText type="subtitle">Your Account Details:</ThemedText>
//               {user.name && <ThemedText>Name: {user.name}</ThemedText>}
//               <ThemedText>Email: {user.email}</ThemedText>
//             </ThemedView>
//           )}

//           <ThemedView style={styles.stepContainer}>
//             <ThemedText type="subtitle">Actions</ThemedText>
//             <Button title="Logout" onPress={handleLogout} color="#FF6347" />
//           </ThemedView>

//           <ThemedView style={styles.stepContainer}>
//             <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//             <ThemedText>
//               Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//               Press{' '}
//               <ThemedText type="defaultSemiBold">
//                 {Platform.select({
//                   ios: 'cmd + d',
//                   android: 'cmd + m',
//                   web: 'F12',
//                 })}
//               </ThemedText>{' '}
//               to open developer tools.
//             </ThemedText>
//           </ThemedView>
//           <ThemedView style={styles.stepContainer}>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//             <ThemedText>
//               {`Tap the Explore tab to learn more about what's included in this starter app.`}
//             </ThemedText>
//           </ThemedView>
//           <ThemedView style={styles.stepContainer}>
//             <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//             {/* CORRECTED: Ensure all text is wrapped in ThemedText */}
//             <ThemedText>
//               {'When you\'re ready, run '}
//               <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>
//               {' to get a fresh '}
//               <ThemedText type="defaultSemiBold">app</ThemedText>
//               {' directory. This will move the current '}
//               <ThemedText type="defaultSemiBold">app</ThemedText>
//               {' to '}
//               <ThemedText type="defaultSemiBold">app-example</ThemedText>
//               {'.'}
//             </ThemedText>
//           </ThemedView>
//         </>
//       )}
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     minHeight: 100,
//   },
//   userInfoContainer: {
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//   },
// });
// Example usage in a React Native component (e.g., a screen or a custom hook)
import { ThemedText } from '@/components/ThemedText'; // Assuming you have this
import { autopopulateService } from '@/src/api/AutopopulateService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
export default function HomePage() {
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [allData, setAllData] = useState<Record<string, any[]>>({});
  const [loadingAllData, setLoadingAllData] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch individual module data on component mount
    const fetchProducts = async () => {
      try {
        const data = await autopopulateService.getModuleData('products');
        setProductOptions(data);
      } catch (error) {
        console.error('Failed to fetch product options:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const data = await autopopulateService.getModuleData('customers');
        setCustomerOptions(data);
      } catch (error) {
        console.error('Failed to fetch customer options:', error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchProducts();
    fetchCustomers();
  }, []); // Runs once on mount

  const handleRefreshProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await autopopulateService.refreshModuleData('products');
      setProductOptions(data);
    } catch (error) {
      console.error('Failed to refresh product options:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearchCustomers = async (query: string) => {
    if (!query) {
      setFilteredCustomers([]);
      return;
    }
    try {
      const results = await autopopulateService.searchModuleData('customers', query);
      setFilteredCustomers(results);
    } catch (error) {
      console.error('Failed to search customers:', error);
    }
  };

  const handleLoadAllModules = async () => {
    setLoadingAllData(true);
    try {
      // You can either just trigger the load and let the service handle caching
      await autopopulateService.loadAllModulesData();
      console.log("All modules data asynchronously loaded into cache.");
      // Or get all data at once
      const data = await autopopulateService.getAllModulesData();
      setAllData(data);
      console.log("All modules data fetched and ready:", data);
    } catch (error) {
      console.error('Error loading all modules data:', error);
    } finally {
      setLoadingAllData(false);
    }
  };


  return (
    <View style={styles.container}>
      <ThemedText type="title">Autopopulate Service Example</ThemedText>

      {loadingProducts ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <ThemedText>Products loaded: {productOptions.length}</ThemedText>
      )}
      <Button title="Refresh Products" onPress={handleRefreshProducts} />

      {loadingCustomers ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <ThemedText>Customers loaded: {customerOptions.length}</ThemedText>
      )}
      <Button title="Search Customers (e.g., 'manish')" onPress={() => handleSearchCustomers('manish')} />
      {filteredCustomers.length > 0 && (
        <ThemedText>Filtered Customers: {filteredCustomers.map(c => c.fullname).join(', ')}</ThemedText>
      )}


      <Button title="Load All Modules Data" onPress={handleLoadAllModules} disabled={loadingAllData} />
      {loadingAllData && <ActivityIndicator size="small" color="#0000ff" />}
      {allData.products && <ThemedText>All Data Loaded (Products): {allData.products.length}</ThemedText>}

      {/* Render your form elements, dropdowns, etc. using productOptions, customerOptions */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});