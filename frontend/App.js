import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AppProvider, AppContext } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LocationScreen from './screens/LocationScreen';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';
import { colors } from './styles/theme';
import ManageAddressScreen from './screens/ManageAddressScreen';
import PlanDetailsScreen from './screens/PlanDetailsScreen';
import MenuDetail from './screens/MenuDetail';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import PaymentRefundsScreen from './screens/PaymentRefundsScreen';
import { ScrollProvider } from './context/ScrollContext';
import { NavAnimationProvider, useNavAnimation } from './context/NavAnimationContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  const { onboardingCompleted } = React.useContext(AppContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
          <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
          <Stack.Screen name="MenuDetail" component={MenuDetail} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="PaymentRefunds" component={PaymentRefundsScreen} />
        </>
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
          <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
          <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
          <Stack.Screen name="MenuDetail" component={MenuDetail} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { show } = useNavAnimation();
  return (
    <NavigationContainer
      onStateChange={() => {
        // Ensure nav is visible on any route transition
        if (show) show();
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      // Load Poppins fonts from the nested directory structure
      const fontPaths = {
        'Poppins-Regular': require('./assets/fonts/Poppins,Source_Serif_4,Space_Grotesk/Poppins/Poppins-Regular.ttf'),
        'Poppins-Medium': require('./assets/fonts/Poppins,Source_Serif_4,Space_Grotesk/Poppins/Poppins-Medium.ttf'),
        'Poppins-SemiBold': require('./assets/fonts/Poppins,Source_Serif_4,Space_Grotesk/Poppins/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins,Source_Serif_4,Space_Grotesk/Poppins/Poppins-Bold.ttf'),
      };
      
      await Font.loadAsync(fontPaths);
      console.log('✅ Fonts loaded successfully');
    } catch (error) {
      console.warn('⚠️ Font loading error (continuing with system fonts):', error.message);
      // Continue without custom fonts - app will use system fonts
    } finally {
      setFontsLoaded(true);
    }
  };

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <AuthProvider>
          <AppProvider>
            <ScrollProvider>
              <NavAnimationProvider>
                <AppContent />
              </NavAnimationProvider>
            </ScrollProvider>
            <StatusBar style="auto" />
          </AppProvider>
        </AuthProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default App;

