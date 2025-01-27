import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, View, Alert } from 'react-native';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';

// Ganti 'your-app-open-ad-unit-id' dengan ID unit iklan App Open Anda
const appOpenAd = AppOpenAd.createForAdRequest('ca-app-pub-3940256099942544/9257395921', {
  requestNonPersonalizedAdsOnly: true,
});

const LoadingScreen = ({ navigation }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const adEventListener = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('App Open Ad loaded');
      setAdLoaded(true);
    });

    const adErrorListener = appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Ad failed to load:', error);
    });

    // Memuat iklan App Open
    appOpenAd.load();

    const timer = setTimeout(() => {
      if (adLoaded) {
        appOpenAd.show();
      } else {
        console.log('Navigasi tanpa iklan karena iklan belum siap.');
      }
      navigation.replace('Home'); // Pindah ke Home setelah timeout
    }, 5000); // Timeout 5 detik

    return () => {
      adEventListener();
      adErrorListener();
      clearTimeout(timer);
    };
  }, [adLoaded, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#ff0000" />
      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: 'center' }}>Loading, please wait...</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
