import React, { useEffect, useState } from 'react';
import { Text, Button, View, Alert } from 'react-native';
import {
  RewardedAd,
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const rewarded = RewardedAd.createForAdRequest(TestIds.GAM_REWARDED, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const HomeScreen = ({ navigation }) => {
  const [isRewardedAdLoaded, setIsRewardedAdLoaded] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5-second countdown

  useEffect(() => {
    // Load rewarded ad
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsRewardedAdLoaded(true);
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        Alert.alert(
          'Reward Earned',
          `You earned ${reward.amount} ${reward.type}`
        );
      }
    );

    rewarded.load();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const startCountdown = () => {
    if (isRewardedAdLoaded) {
      setIsCountdownActive(true);
      let timer = countdown;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          setIsCountdownActive(false);
          setCountdown(5); // Reset countdown
          rewarded.show();
        }
      }, 1000);
    } else {
      Alert.alert('Ad Not Ready', 'The rewarded ad has not loaded yet.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}>
        <Text style={{ textAlign: 'center' }}>HomeScreen</Text>
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => navigation.navigate('Details')}
          title="Go to Details Screen"
        />

        {isCountdownActive ? (
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            Ad will start in {countdown} seconds...
          </Text>
        ) : (
          <Button onPress={startCountdown} title="Display Rewarded Ads" />
        )}
      </View>
      <GAMBannerAd
        unitId={TestIds.BANNER}
        sizes={[BannerAdSize.FULL_BANNER]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default HomeScreen;
