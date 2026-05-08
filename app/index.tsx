import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { getLeadStats, getProperties } from '@/lib/api';

const { width } = Dimensions.get('window');

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const card1Scale = useRef(new Animated.Value(1)).current;
  const card2Scale = useRef(new Animated.Value(1)).current;

  const [stats, setStats] = useState({ totalProperties: 0, totalLeads: 0, newLeads: 0 });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    // Load stats
    Promise.all([getProperties(), getLeadStats()])
      .then(([propsRes, leadsRes]) => {
        setStats({
          totalProperties: propsRes.count,
          totalLeads: leadsRes.data.total,
          newLeads: leadsRes.data.thisWeek,
        });
      })
      .catch(() => { });
  }, []);

  const pressIn = (anim: Animated.Value) =>
    Animated.spring(anim, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = (anim: Animated.Value) =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 24, paddingTop: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 32, fontFamily: 'Rubik-ExtraBold', color: '#fff' }}>
              Estate Sphere
            </Text>
            <Text style={{ fontSize: 28, marginLeft: 8 }}>🏗️</Text>
          </View>
          <Text style={{ fontSize: 14, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginBottom: 0 }}>
            Indore's Premier Real Estate Platform
          </Text>
        </Animated.View>

        {/* Stats Bar */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            flexDirection: 'row',
            marginHorizontal: 24,
            marginTop: 20,
            marginBottom: 28,
            backgroundColor: '#14142b',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: '#2a2a4a',
          }}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontFamily: 'Rubik-Bold', color: '#7c6cfc' }}>{stats.totalProperties}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginTop: 2 }}>Properties</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2a2a4a' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontFamily: 'Rubik-Bold', color: '#2dd4bf' }}>{stats.totalLeads}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginTop: 2 }}>Total Leads</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2a2a4a' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontFamily: 'Rubik-Bold', color: '#f59e0b' }}>{stats.newLeads}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginTop: 2 }}>This Week</Text>
          </View>
        </Animated.View>

        {/* Main Cards */}
        <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 24, gap: 16, flex: 1 }}>
          <Text style={{ fontSize: 13, fontFamily: 'Rubik-Medium', color: '#8b8faa', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            Choose Module
          </Text>

          {/* Listing Card */}
          <Animated.View style={{ transform: [{ scale: card1Scale }], flex: 1, maxHeight: 200 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(card1Scale)}
              onPressOut={() => pressOut(card1Scale)}
              onPress={() => router.push('/(root)/listing' as any)}
              style={{ flex: 1, borderRadius: 24, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['#4f46e5', '#7c3aed', '#9333ea']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 28, justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
                    <Text style={{ fontSize: 32 }}>🏠</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Rubik-Medium' }}>{stats.totalProperties} Listings</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 26, fontFamily: 'Rubik-Bold', color: '#fff', marginBottom: 6 }}>
                    Property Listings
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Rubik-Regular', color: 'rgba(255,255,255,0.75)' }}>
                    Houses • Apartments • Commercial • Rent
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontFamily: 'Rubik-Medium' }}>Browse Properties</Text>
                    <Text style={{ color: '#fff', fontSize: 18, marginLeft: 6 }}>→</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* CRM Card */}
          <Animated.View style={{ transform: [{ scale: card2Scale }], flex: 1, maxHeight: 200 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(card2Scale)}
              onPressOut={() => pressOut(card2Scale)}
              onPress={() => router.push('/(root)/crm' as any)}
              style={{ flex: 1, borderRadius: 24, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['#0d9488', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 28, justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
                    <Text style={{ fontSize: 32 }}>👥</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Rubik-Medium' }}>{stats.newLeads} New This Week</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 26, fontFamily: 'Rubik-Bold', color: '#fff', marginBottom: 6 }}>
                    CRM & Leads
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Rubik-Regular', color: 'rgba(255,255,255,0.75)' }}>
                    Track • Manage • Convert your leads
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontFamily: 'Rubik-Medium' }}>Open CRM</Text>
                    <Text style={{ color: '#fff', fontSize: 18, marginLeft: 6 }}>→</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Text style={{ textAlign: 'center', color: '#3a3a5a', fontSize: 12, fontFamily: 'Rubik-Regular', marginBottom: 16, marginTop: 4 }}>
            Indore, Madhya Pradesh 🇮🇳
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}