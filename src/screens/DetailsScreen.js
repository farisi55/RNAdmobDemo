import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Membuat iklan interstitial
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const Details = ({ navigation }) => {
  const [adLoaded, setAdLoaded] = useState(false); // Status apakah iklan sudah dimuat
  const [countdown, setCountdown] = useState(10); // Timer untuk menunggu (default 10 detik)
  const [isWaiting, setIsWaiting] = useState(false); // Status apakah sedang menunggu

  useEffect(() => {
    // Listener untuk event iklan
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
      setIsWaiting(false); // Stop timer ketika iklan selesai dimuat
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Ad failed to load:', error);
    });

    // Memuat iklan
    interstitial.load();

    // Membersihkan listener ketika komponen unmount
    return () => {
      unsubscribe();
      unsubscribeError();
    };
  }, []);

  const handleShowAd = () => {
    if (adLoaded) {
      interstitial.show();
      setAdLoaded(false); // Reset status setelah iklan ditampilkan
      interstitial.load(); // Memulai kembali proses pemuatan iklan
    } else {
      Alert.alert('Iklan belum siap', 'Tunggu hingga iklan selesai dimuat.');
    }
  };

  const startAdTimer = () => {
    setIsWaiting(true); // Mulai timer
    setCountdown(10); // Set ulang waktu tunggu (10 detik)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop timer jika waktu habis
          setIsWaiting(false); // Timer selesai
          if (adLoaded) {
            interstitial.show(); // Tampilkan iklan jika sudah siap
            setAdLoaded(false); // Reset status setelah iklan ditampilkan
            interstitial.load(); // Muat ulang iklan
          } else {
            Alert.alert('Iklan belum siap', 'Tunggu hingga iklan selesai dimuat.');
          }
        }
        return prev - 1; // Kurangi countdown setiap detik
      });
    }, 1000);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>Details Screen</Text>

      {/* Tombol untuk kembali ke Home Screen */}
      <Button
        onPress={() => navigation.navigate('Home')}
        title="Go to Home Screen"
      />

      {/* Tombol untuk memulai timer dan menampilkan iklan */}
      <Button
        title="Start Countdown for Ad"
        onPress={() => {
          if (!adLoaded) {
            startAdTimer(); // Mulai timer jika iklan belum siap
          } else {
            handleShowAd(); // Tampilkan iklan jika sudah siap
          }
        }}
      />

      {/* Tampilkan timer ketika menunggu */}
      {isWaiting && (
        <Text style={{ marginTop: 20, fontSize: 16, color: 'red' }}>
          Menunggu iklan dimuat... {countdown} detik
        </Text>
      )}
    </View>
  );
};

export default Details;
