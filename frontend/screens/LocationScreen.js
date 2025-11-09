import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, fonts, spacing, borderRadius } from '../styles/theme';
import Button from '../components/Button';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

const LocationScreen = ({ navigation }) => {
  const { setUserLocation } = React.useContext(AppContext);
  const { updateUser } = React.useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this app'
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    try {
      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync(location);
      const addressString = `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();

      // Update user location in context
      setUserLocation({
        ...location,
        address: addressString,
      });

      // Update user in backend
      await updateUser({
        address: {
          street: addressString,
          city: address.city || '',
          state: address.region || '',
          zipCode: address.postalCode || '',
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      });

      navigation.replace('Main');
    } catch (error) {
      console.error('Location confirmation error:', error);
      Alert.alert('Error', 'Failed to confirm location');
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Location</Text>
        <Text style={styles.subtitle}>
          Tap on the map to set your delivery address
        </Text>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {location && (
          <Marker
            coordinate={location}
            title="Your Location"
            pinColor={colors.primary}
          />
        )}
      </MapView>

      <View style={styles.footer}>
        <Button
          title="Confirm Location"
          onPress={handleConfirmLocation}
          disabled={!location}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
});

export default LocationScreen;

