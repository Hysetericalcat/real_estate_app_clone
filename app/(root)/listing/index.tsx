import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, TextInput,
    StatusBar, ActivityIndicator, RefreshControl, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getProperties, Property } from '@/lib/api';

const CATEGORIES = [
    { key: 'all', label: 'All', emoji: '🏘️', color: '#7c6cfc' },
    { key: 'house', label: 'Houses', emoji: '🏡', color: '#f59e0b' },
    { key: 'apartment', label: 'Apartments', emoji: '🏢', color: '#6366f1' },
    { key: 'commercial', label: 'Commercial', emoji: '🏪', color: '#ec4899' },
    { key: 'rent', label: 'Rent', emoji: '🔑', color: '#2dd4bf' },
];

const STATUS_COLORS: Record<string, string> = {
    Available: '#22c55e',
    Sold: '#ef4444',
    Rented: '#f59e0b',
    'Under Negotiation': '#a78bfa',
};

function PropertyCard({ item, onPress }: { item: Property; onPress: () => void }) {
    const scale = new Animated.Value(1);
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPress}
                onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
                style={{
                    backgroundColor: '#14142b', borderRadius: 20, marginBottom: 14,
                    borderWidth: 1, borderColor: '#2a2a4a', overflow: 'hidden',
                }}
            >
                {/* Colored header strip */}
                <View style={{ height: 4, backgroundColor: CATEGORIES.find(c => c.key === item.category)?.color || '#7c6cfc' }} />
                <View style={{ padding: 18 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 3 }} numberOfLines={2}>{item.title}</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Rubik-Regular', color: '#8b8faa' }}>📍 {item.locality}, Indore</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Rubik-Bold', color: '#7c6cfc' }}>{item.priceLabel}</Text>
                            <View style={{ backgroundColor: STATUS_COLORS[item.status] + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 }}>
                                <Text style={{ fontSize: 10, fontFamily: 'Rubik-Medium', color: STATUS_COLORS[item.status] }}>{item.status}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                        {item.bedrooms > 0 && (
                            <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>🛏 {item.bedrooms} BHK</Text>
                        )}
                        <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>📐 {item.area} sq ft</Text>
                        {item.parking && <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>🅿️ Parking</Text>}
                        <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>🛋 {item.furnished}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function ListingScreen() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProperties = useCallback(async (cat: string) => {
        try {
            const res = await getProperties(cat === 'all' ? undefined : cat);
            setProperties(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchProperties(activeCategory);
    }, [activeCategory]);

    const filtered = properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.locality.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                        <Text style={{ fontSize: 22, color: '#7c6cfc' }}>←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontFamily: 'Rubik-Bold', color: '#fff' }}>Property Listings</Text>
                        <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>Indore, Madhya Pradesh</Text>
                    </View>
                </View>

                {/* Search */}
                <View style={{ marginHorizontal: 24, marginBottom: 12, backgroundColor: '#14142b', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: '#2a2a4a' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                    <TextInput
                        placeholder="Search by name or locality..."
                        placeholderTextColor="#4a4a6a"
                        value={search}
                        onChangeText={setSearch}
                        style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: '#fff', fontFamily: 'Rubik-Regular' }}
                    />
                    {search !== '' && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Text style={{ color: '#8b8faa', fontSize: 18 }}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Category Tabs */}
                <FlatList
                    data={CATEGORIES}
                    keyExtractor={c => c.key}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 12, gap: 8 }}
                    renderItem={({ item: c }) => (
                        <TouchableOpacity
                            onPress={() => setActiveCategory(c.key)}
                            style={{
                                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                backgroundColor: activeCategory === c.key ? c.color : '#14142b',
                                borderWidth: 1, borderColor: activeCategory === c.key ? c.color : '#2a2a4a',
                                flexDirection: 'row', alignItems: 'center', gap: 4,
                            }}
                        >
                            <Text style={{ fontSize: 14 }}>{c.emoji}</Text>
                            <Text style={{ fontSize: 13, fontFamily: 'Rubik-Medium', color: activeCategory === c.key ? '#fff' : '#8b8faa' }}>
                                {c.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Results count */}
                {!loading && (
                    <Text style={{ paddingHorizontal: 24, marginBottom: 10, fontSize: 12, color: '#4a4a6a', fontFamily: 'Rubik-Regular' }}>
                        {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
                    </Text>
                )}

                {/* List */}
                {loading ? (
                    <ActivityIndicator color="#7c6cfc" size="large" style={{ flex: 1 }} />
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={p => p._id}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => { setRefreshing(true); fetchProperties(activeCategory); }}
                                tintColor="#7c6cfc"
                            />
                        }
                        renderItem={({ item }) => (
                            <PropertyCard item={item} onPress={() => router.push(`/(root)/listing/${item._id}` as any)} />
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingTop: 60 }}>
                                <Text style={{ fontSize: 40 }}>🏚️</Text>
                                <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 16, marginTop: 12 }}>No properties found</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
