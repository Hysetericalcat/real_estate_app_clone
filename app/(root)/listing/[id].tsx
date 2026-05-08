import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
    StatusBar, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { getProperty, Property } from '@/lib/api';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
    Available: { color: '#22c55e', bg: '#22c55e22' },
    Sold: { color: '#ef4444', bg: '#ef444422' },
    Rented: { color: '#f59e0b', bg: '#f59e0b22' },
    'Under Negotiation': { color: '#a78bfa', bg: '#a78bfa22' },
};

const CAT_COLORS: Record<string, string> = {
    house: '#f59e0b',
    apartment: '#6366f1',
    commercial: '#ec4899',
    rent: '#2dd4bf',
};

export default function PropertyDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getProperty(id)
            .then(res => setProperty(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#7c6cfc" size="large" />
            </View>
        );
    }

    if (!property) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium' }}>Property not found</Text>
            </View>
        );
    }

    const status = STATUS_CONFIG[property.status] || STATUS_CONFIG['Available'];
    const catColor = CAT_COLORS[property.category] || '#7c6cfc';

    const handleCall = () => {
        Linking.openURL(`tel:${property.contactPhone}`).catch(() =>
            Alert.alert('Error', 'Unable to make a call')
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: '#14142b', borderRadius: 12, marginRight: 12 }}>
                        <Text style={{ color: '#7c6cfc', fontSize: 18 }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ flex: 1, fontSize: 16, fontFamily: 'Rubik-SemiBold', color: '#fff' }} numberOfLines={1}>
                        Property Details
                    </Text>
                    <View style={{ backgroundColor: status.bg, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ color: status.color, fontSize: 12, fontFamily: 'Rubik-SemiBold' }}>{property.status}</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* Color banner */}
                    <View style={{ height: 8, backgroundColor: catColor, marginHorizontal: 20, borderRadius: 4, marginBottom: 20 }} />

                    {/* Title & Price */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 22, fontFamily: 'Rubik-Bold', color: '#fff', marginBottom: 6 }}>{property.title}</Text>
                        <Text style={{ fontSize: 14, color: '#8b8faa', fontFamily: 'Rubik-Regular', marginBottom: 12 }}>📍 {property.location}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                            <Text style={{ fontSize: 28, fontFamily: 'Rubik-ExtraBold', color: catColor }}>{property.priceLabel}</Text>
                            {property.category === 'rent' && <Text style={{ fontSize: 14, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>per month</Text>}
                        </View>
                    </View>

                    {/* Quick stats */}
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#14142b', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#2a2a4a' }}>
                        {[
                            { label: 'Area', value: `${property.area} sqft`, emoji: '📐' },
                            property.bedrooms > 0 ? { label: 'BHK', value: `${property.bedrooms} BHK`, emoji: '🛏' } : null,
                            { label: 'Bathrooms', value: `${property.bathrooms}`, emoji: '🚿' },
                            { label: 'Parking', value: property.parking ? 'Yes' : 'No', emoji: '🅿️' },
                        ].filter(Boolean).map((stat, i) => (
                            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>{stat!.emoji}</Text>
                                <Text style={{ fontSize: 13, fontFamily: 'Rubik-Bold', color: '#fff', marginTop: 4 }}>{stat!.value}</Text>
                                <Text style={{ fontSize: 10, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginTop: 2 }}>{stat!.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Highlights */}
                    {property.highlights.length > 0 && (
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 10 }}>✨ Highlights</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {property.highlights.map((h, i) => (
                                    <View key={i} style={{ backgroundColor: catColor + '22', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
                                        <Text style={{ fontSize: 12, color: catColor, fontFamily: 'Rubik-Medium' }}>⚡ {h}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Description */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 8 }}>📋 Description</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Rubik-Regular', color: '#8b8faa', lineHeight: 22 }}>{property.description}</Text>
                    </View>

                    {/* Property Details */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 12 }}>🏗️ Property Details</Text>
                        <View style={{ backgroundColor: '#14142b', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a4a', overflow: 'hidden' }}>
                            {[
                                { label: 'Category', value: property.category.charAt(0).toUpperCase() + property.category.slice(1) },
                                { label: 'Locality', value: property.locality },
                                { label: 'Floors', value: String(property.floors) },
                                { label: 'Furnished', value: property.furnished },
                                { label: 'Facing', value: property.facing || '—' },
                                { label: 'Age', value: property.age || '—' },
                            ].map((row, i) => (
                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < 5 ? 1 : 0, borderBottomColor: '#2a2a4a' }}>
                                    <Text style={{ fontSize: 13, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>{row.label}</Text>
                                    <Text style={{ fontSize: 13, color: '#fff', fontFamily: 'Rubik-Medium' }}>{row.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 10 }}>🏊 Amenities</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {property.amenities.map((a, i) => (
                                    <View key={i} style={{ backgroundColor: '#14142b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#2a2a4a' }}>
                                        <Text style={{ fontSize: 12, color: '#c4c8e8', fontFamily: 'Rubik-Regular' }}>✓ {a}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Agent info */}
                    <View style={{ marginHorizontal: 20, backgroundColor: '#14142b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2a4a', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: catColor + '33', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                            <Text style={{ fontSize: 20 }}>👤</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontFamily: 'Rubik-SemiBold', fontSize: 15 }}>{property.contactPerson}</Text>
                            <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Regular', fontSize: 12, marginTop: 2 }}>{property.contactPhone}</Text>
                        </View>
                        <TouchableOpacity onPress={handleCall} style={{ backgroundColor: '#22c55e', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
                            <Text style={{ color: '#fff', fontFamily: 'Rubik-Bold', fontSize: 13 }}>📞 Call</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a1a', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: '#2a2a4a' }}>
                    <TouchableOpacity
                        onPress={handleCall}
                        style={{ backgroundColor: catColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#fff', fontFamily: 'Rubik-Bold', fontSize: 16 }}>📞 Contact Agent</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
