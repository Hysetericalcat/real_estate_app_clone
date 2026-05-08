import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, TextInput,
    StatusBar, ActivityIndicator, RefreshControl, Modal,
    ScrollView, Alert, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getLeads, getLeadStats, createLead, deleteLead, Lead } from '@/lib/api';

const STATUS_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
    'New': { color: '#60a5fa', bg: '#60a5fa22', emoji: '🆕' },
    'Contacted': { color: '#818cf8', bg: '#818cf822', emoji: '📞' },
    'Site Visit': { color: '#fbbf24', bg: '#fbbf2422', emoji: '🚗' },
    'Negotiating': { color: '#f97316', bg: '#f9731622', emoji: '🤝' },
    'Closed': { color: '#22c55e', bg: '#22c55e22', emoji: '✅' },
    'Lost': { color: '#ef4444', bg: '#ef444422', emoji: '❌' },
};

const PRIORITIES: Record<string, string> = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' };
const INTEREST_EMOJI: Record<string, string> = { house: '🏡', apartment: '🏢', commercial: '🏪', rent: '🔑', any: '🏘️' };
const SOURCES = ['Walk-in', 'Website', 'Referral', 'Social Media', 'Phone', 'Other'];
const INTERESTS = ['house', 'apartment', 'commercial', 'rent', 'any'];

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function LeadCard({ item, onPress, onDelete }: { item: Lead; onPress: () => void; onDelete: () => void }) {
    const s = STATUS_CONFIG[item.status] || STATUS_CONFIG['New'];
    const scale = useRef(new Animated.Value(1)).current;
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
                onLongPress={() => {
                    Alert.alert('Delete Lead', `Delete ${item.name}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: onDelete },
                    ]);
                }}
                style={{ backgroundColor: '#14142b', borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a4a', padding: 16 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Avatar */}
                    <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: s.color + '33', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Text style={{ color: s.color, fontFamily: 'Rubik-Bold', fontSize: 16 }}>{getInitials(item.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Rubik-SemiBold', color: '#fff' }}>{item.name}</Text>
                            <View style={{ backgroundColor: s.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                                <Text style={{ fontSize: 10, fontFamily: 'Rubik-SemiBold', color: s.color }}>{s.emoji} {item.status}</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular', marginTop: 2 }}>📱 {item.phone}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                    <View style={{ backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, color: '#c4c8e8', fontFamily: 'Rubik-Regular' }}>{INTEREST_EMOJI[item.interest]} {item.interest}</Text>
                    </View>
                    <View style={{ backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, color: '#c4c8e8', fontFamily: 'Rubik-Regular' }}>💰 {item.budget || 'Budget N/A'}</Text>
                    </View>
                    <View style={{ backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, color: PRIORITIES[item.priority], fontFamily: 'Rubik-Medium' }}>● {item.priority}</Text>
                    </View>
                    {item.notes.length > 0 && (
                        <View style={{ backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                            <Text style={{ fontSize: 11, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>💬 {item.notes.length} notes</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

function AddLeadModal({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', interest: 'any', budget: '', preferredLocality: '', source: 'Other', priority: 'Medium' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            Alert.alert('Required', 'Name and phone are required');
            return;
        }
        setSaving(true);
        try {
            await createLead(form);
            setForm({ name: '', phone: '', email: '', interest: 'any', budget: '', preferredLocality: '', source: 'Other', priority: 'Medium' });
            onSuccess();
            onClose();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#2a2a4a' }}>
                        <Text style={{ flex: 1, fontSize: 20, fontFamily: 'Rubik-Bold', color: '#fff' }}>➕ Add New Lead</Text>
                        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                            <Text style={{ color: '#8b8faa', fontSize: 24 }}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                        {[
                            { label: 'Full Name *', key: 'name', placeholder: 'e.g. Arun Sharma', keyboard: 'default' },
                            { label: 'Phone *', key: 'phone', placeholder: '+91 98765 XXXXX', keyboard: 'phone-pad' },
                            { label: 'Email', key: 'email', placeholder: 'email@example.com', keyboard: 'email-address' },
                            { label: 'Budget', key: 'budget', placeholder: 'e.g. ₹40L - ₹60L', keyboard: 'default' },
                            { label: 'Preferred Locality', key: 'preferredLocality', placeholder: 'e.g. Vijay Nagar, Palasia', keyboard: 'default' },
                        ].map(f => (
                            <View key={f.key} style={{ marginBottom: 16 }}>
                                <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</Text>
                                <TextInput
                                    value={(form as any)[f.key]}
                                    onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                                    placeholder={f.placeholder}
                                    placeholderTextColor="#4a4a6a"
                                    keyboardType={f.keyboard as any}
                                    style={{ backgroundColor: '#14142b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#fff', fontFamily: 'Rubik-Regular', borderWidth: 1, borderColor: '#2a2a4a' }}
                                />
                            </View>
                        ))}

                        {/* Interest */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Interest</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {INTERESTS.map(i => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => setForm(prev => ({ ...prev, interest: i }))}
                                        style={{ backgroundColor: form.interest === i ? '#7c6cfc' : '#14142b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: form.interest === i ? '#7c6cfc' : '#2a2a4a' }}
                                    >
                                        <Text style={{ color: '#fff', fontFamily: 'Rubik-Medium', fontSize: 13 }}>{INTEREST_EMOJI[i]} {i}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Source */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Source</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {SOURCES.map(s => (
                                    <TouchableOpacity
                                        key={s}
                                        onPress={() => setForm(prev => ({ ...prev, source: s }))}
                                        style={{ backgroundColor: form.source === s ? '#2dd4bf33' : '#14142b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: form.source === s ? '#2dd4bf' : '#2a2a4a' }}
                                    >
                                        <Text style={{ color: form.source === s ? '#2dd4bf' : '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 12 }}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Priority */}
                        <View style={{ marginBottom: 28 }}>
                            <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Priority</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {['Low', 'Medium', 'High'].map(p => (
                                    <TouchableOpacity
                                        key={p}
                                        onPress={() => setForm(prev => ({ ...prev, priority: p }))}
                                        style={{ flex: 1, backgroundColor: form.priority === p ? PRIORITIES[p] + '33' : '#14142b', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: form.priority === p ? PRIORITIES[p] : '#2a2a4a' }}
                                    >
                                        <Text style={{ color: form.priority === p ? PRIORITIES[p] : '#8b8faa', fontFamily: 'Rubik-SemiBold', fontSize: 13 }}>{p}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={saving}
                            style={{ backgroundColor: '#7c6cfc', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                        >
                            {saving ? <ActivityIndicator color="#fff" /> : (
                                <Text style={{ color: '#fff', fontFamily: 'Rubik-Bold', fontSize: 16 }}>Save Lead</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default function CRMScreen() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [activeStatus, setActiveStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({ total: 0, thisWeek: 0 });

    const fetchData = useCallback(async () => {
        try {
            const [leadsRes, statsRes] = await Promise.all([getLeads(), getLeadStats()]);
            setLeads(leadsRes.data);
            setStats({ total: statsRes.data.total, thisWeek: statsRes.data.thisWeek });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteLead(id);
            setLeads(prev => prev.filter(l => l._id !== id));
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    const statusFilters = ['All', ...Object.keys(STATUS_CONFIG)];
    const filtered = leads.filter(l => {
        const matchStatus = activeStatus === 'All' || l.status === activeStatus;
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.phone.includes(search) || l.interest.includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    // Pipeline counts
    const pipeline = Object.keys(STATUS_CONFIG).map(s => ({
        status: s,
        count: leads.filter(l => l.status === s).length,
        ...STATUS_CONFIG[s],
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                        <Text style={{ fontSize: 22, color: '#2dd4bf' }}>←</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 24, fontFamily: 'Rubik-Bold', color: '#fff' }}>Lead CRM</Text>
                        <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular' }}>{stats.total} total • {stats.thisWeek} new this week</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowAddModal(true)}
                        style={{ backgroundColor: '#2dd4bf', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
                    >
                        <Text style={{ color: '#0a0a1a', fontFamily: 'Rubik-Bold', fontSize: 13 }}>+ Add Lead</Text>
                    </TouchableOpacity>
                </View>

                {/* Pipeline Bar */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 12, gap: 8 }}>
                    {pipeline.map(p => (
                        <TouchableOpacity
                            key={p.status}
                            onPress={() => setActiveStatus(p.status === activeStatus ? 'All' : p.status)}
                            style={{ backgroundColor: '#14142b', borderRadius: 14, padding: 12, minWidth: 80, alignItems: 'center', borderWidth: 1, borderColor: activeStatus === p.status ? p.color : '#2a2a4a' }}
                        >
                            <Text style={{ fontSize: 18 }}>{p.emoji}</Text>
                            <Text style={{ fontSize: 18, fontFamily: 'Rubik-Bold', color: p.color, marginTop: 2 }}>{p.count}</Text>
                            <Text style={{ fontSize: 9, fontFamily: 'Rubik-Regular', color: '#8b8faa', marginTop: 1, textAlign: 'center' }}>{p.status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Search */}
                <View style={{ marginHorizontal: 24, marginBottom: 8, backgroundColor: '#14142b', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderWidth: 1, borderColor: '#2a2a4a' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                    <TextInput
                        placeholder="Search leads..."
                        placeholderTextColor="#4a4a6a"
                        value={search}
                        onChangeText={setSearch}
                        style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: '#fff', fontFamily: 'Rubik-Regular' }}
                    />
                </View>

                {/* Filter pill */}
                {activeStatus !== 'All' && (
                    <TouchableOpacity onPress={() => setActiveStatus('All')} style={{ marginHorizontal: 24, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ backgroundColor: STATUS_CONFIG[activeStatus]?.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                            <Text style={{ color: STATUS_CONFIG[activeStatus]?.color, fontFamily: 'Rubik-Medium', fontSize: 12 }}>{activeStatus} × Clear</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {loading ? (
                    <ActivityIndicator color="#2dd4bf" size="large" style={{ flex: 1 }} />
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={l => l._id}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#2dd4bf" />
                        }
                        renderItem={({ item }) => (
                            <LeadCard
                                item={item}
                                onPress={() => router.push(`/(root)/crm/${item._id}` as any)}
                                onDelete={() => handleDelete(item._id)}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingTop: 60 }}>
                                <Text style={{ fontSize: 40 }}>📭</Text>
                                <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 16, marginTop: 12 }}>No leads found</Text>
                            </View>
                        }
                    />
                )}

                {/* FAB */}
                <TouchableOpacity
                    onPress={() => setShowAddModal(true)}
                    style={{ position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2dd4bf', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#2dd4bf', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
                >
                    <Text style={{ fontSize: 28, color: '#0a0a1a', fontFamily: 'Rubik-Bold', marginTop: -2 }}>+</Text>
                </TouchableOpacity>

                <AddLeadModal visible={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchData} />
            </SafeAreaView>
        </View>
    );
}
