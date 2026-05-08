import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput,
    StatusBar, ActivityIndicator, Alert, Linking, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { getLead, updateLead, addLeadNote, Lead } from '@/lib/api';

const STATUS_ORDER = ['New', 'Contacted', 'Site Visit', 'Negotiating', 'Closed', 'Lost'];
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

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(d: string | null) {
    if (!d) return 'Never';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function LeadDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Lead>>({});
    const [saving, setSaving] = useState(false);

    const fetchLead = async () => {
        if (!id) return;
        try {
            const res = await getLead(id);
            setLead(res.data);
            setEditForm({ name: res.data.name, phone: res.data.phone, email: res.data.email, budget: res.data.budget, preferredLocality: res.data.preferredLocality, assignedTo: res.data.assignedTo });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLead(); }, [id]);

    const handleStatusChange = async (status: string) => {
        if (!lead) return;
        try {
            const res = await updateLead(lead._id, { status: status as any });
            setLead(res.data);
        } catch (e: any) { Alert.alert('Error', e.message); }
    };

    const handleAddNote = async () => {
        if (!noteText.trim() || !lead) return;
        setAddingNote(true);
        try {
            const res = await addLeadNote(lead._id, noteText.trim());
            setLead(res.data);
            setNoteText('');
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setAddingNote(false); }
    };

    const handleSaveEdit = async () => {
        if (!lead) return;
        setSaving(true);
        try {
            const res = await updateLead(lead._id, editForm);
            setLead(res.data);
            setEditMode(false);
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setSaving(false); }
    };

    const handlePriorityChange = async (priority: 'Low' | 'Medium' | 'High') => {
        if (!lead) return;
        try {
            const res = await updateLead(lead._id, { priority });
            setLead(res.data);
        } catch (e: any) { Alert.alert('Error', e.message); }
    };

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#2dd4bf" size="large" />
        </View>
    );

    if (!lead) return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#8b8faa', fontFamily: 'Rubik-Medium' }}>Lead not found</Text>
        </View>
    );

    const s = STATUS_CONFIG[lead.status] || STATUS_CONFIG['New'];

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a1a' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: '#14142b', borderRadius: 12, marginRight: 12 }}>
                        <Text style={{ color: '#2dd4bf', fontSize: 18 }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ flex: 1, fontSize: 16, fontFamily: 'Rubik-SemiBold', color: '#fff' }}>Lead Details</Text>
                    <TouchableOpacity
                        onPress={() => editMode ? handleSaveEdit() : setEditMode(true)}
                        style={{ backgroundColor: editMode ? '#22c55e' : '#14142b', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: editMode ? '#22c55e' : '#2a2a4a' }}
                    >
                        {saving ? <ActivityIndicator color="#fff" size="small" /> : (
                            <Text style={{ color: editMode ? '#fff' : '#8b8faa', fontFamily: 'Rubik-Medium', fontSize: 13 }}>{editMode ? '✓ Save' : '✏️ Edit'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Lead header card */}
                        <View style={{ marginHorizontal: 20, backgroundColor: '#14142b', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4a' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: s.color + '33', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                    <Text style={{ color: s.color, fontFamily: 'Rubik-Bold', fontSize: 20 }}>{getInitials(lead.name)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {editMode ? (
                                        <TextInput
                                            value={editForm.name || ''}
                                            onChangeText={v => setEditForm(prev => ({ ...prev, name: v }))}
                                            style={{ color: '#fff', fontFamily: 'Rubik-Bold', fontSize: 18, backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}
                                        />
                                    ) : (
                                        <Text style={{ fontSize: 20, fontFamily: 'Rubik-Bold', color: '#fff' }}>{lead.name}</Text>
                                    )}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
                                        <View style={{ backgroundColor: s.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                                            <Text style={{ fontSize: 11, fontFamily: 'Rubik-SemiBold', color: s.color }}>{s.emoji} {lead.status}</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#1e1e3a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                                            <Text style={{ fontSize: 11, color: PRIORITIES[lead.priority], fontFamily: 'Rubik-Medium' }}>● {lead.priority} Priority</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Contact */}
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`tel:${lead.phone}`)}
                                    style={{ flex: 1, backgroundColor: '#2dd4bf22', borderRadius: 12, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                                >
                                    <Text style={{ fontSize: 14 }}>📞</Text>
                                    <Text style={{ color: '#2dd4bf', fontFamily: 'Rubik-SemiBold', fontSize: 13 }}>Call</Text>
                                </TouchableOpacity>
                                {lead.phone && (
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`)}
                                        style={{ flex: 1, backgroundColor: '#22c55e22', borderRadius: 12, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                                    >
                                        <Text style={{ fontSize: 14 }}>💬</Text>
                                        <Text style={{ color: '#22c55e', fontFamily: 'Rubik-SemiBold', fontSize: 13 }}>WhatsApp</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Status Pipeline */}
                        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 10 }}>📊 Pipeline Status</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                                {STATUS_ORDER.map(status => {
                                    const cfg = STATUS_CONFIG[status];
                                    const isActive = lead.status === status;
                                    return (
                                        <TouchableOpacity
                                            key={status}
                                            onPress={() => handleStatusChange(status)}
                                            style={{ backgroundColor: isActive ? cfg.color : '#14142b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: isActive ? cfg.color : '#2a2a4a', alignItems: 'center' }}
                                        >
                                            <Text style={{ fontSize: 14 }}>{cfg.emoji}</Text>
                                            <Text style={{ fontSize: 10, fontFamily: 'Rubik-Medium', color: isActive ? '#fff' : '#8b8faa', marginTop: 2 }}>{status}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Lead Info */}
                        <View style={{ marginHorizontal: 20, backgroundColor: '#14142b', borderRadius: 18, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16, overflow: 'hidden' }}>
                            {[
                                { label: 'Phone', key: 'phone', icon: '📱', editable: true, keyboard: 'phone-pad' },
                                { label: 'Email', key: 'email', icon: '📧', editable: true, keyboard: 'email-address' },
                                { label: 'Interest', key: 'interest', icon: INTEREST_EMOJI[lead.interest], editable: false },
                                { label: 'Budget', key: 'budget', icon: '💰', editable: true, keyboard: 'default' },
                                { label: 'Locality', key: 'preferredLocality', icon: '📍', editable: true, keyboard: 'default' },
                                { label: 'Source', key: 'source', icon: '🌐', editable: false },
                                { label: 'Assigned To', key: 'assignedTo', icon: '👤', editable: true, keyboard: 'default' },
                                { label: 'Last Contact', value: formatDate(lead.lastContacted), icon: '🕐', editable: false },
                                { label: 'Added On', value: formatDate(lead.createdAt), icon: '📅', editable: false },
                            ].map((row, i) => (
                                <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < 8 ? 1 : 0, borderBottomColor: '#2a2a4a' }}>
                                    <Text style={{ fontSize: 16, marginRight: 10 }}>{row.icon}</Text>
                                    <Text style={{ fontSize: 12, color: '#8b8faa', fontFamily: 'Rubik-Regular', width: 80 }}>{row.label}</Text>
                                    {editMode && row.editable ? (
                                        <TextInput
                                            value={(editForm as any)[row.key!] || ''}
                                            onChangeText={v => setEditForm(prev => ({ ...prev, [row.key!]: v }))}
                                            keyboardType={(row as any).keyboard || 'default'}
                                            style={{ flex: 1, color: '#fff', fontFamily: 'Rubik-Medium', fontSize: 13, backgroundColor: '#1e1e3a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}
                                        />
                                    ) : (
                                        <Text style={{ flex: 1, fontSize: 13, color: '#fff', fontFamily: 'Rubik-Medium', textAlign: 'right' }}>
                                            {row.value ?? (lead as any)[row.key!] ?? '—'}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Priority */}
                        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 10 }}>⚡ Priority</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {(['Low', 'Medium', 'High'] as const).map(p => (
                                    <TouchableOpacity
                                        key={p}
                                        onPress={() => handlePriorityChange(p)}
                                        style={{ flex: 1, backgroundColor: lead.priority === p ? PRIORITIES[p] + '33' : '#14142b', borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: lead.priority === p ? PRIORITIES[p] : '#2a2a4a' }}
                                    >
                                        <Text style={{ color: lead.priority === p ? PRIORITIES[p] : '#8b8faa', fontFamily: 'Rubik-SemiBold', fontSize: 13 }}>{p}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Notes Timeline */}
                        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Rubik-SemiBold', color: '#fff', marginBottom: 10 }}>💬 Notes Timeline</Text>

                            {/* Add note */}
                            <View style={{ backgroundColor: '#14142b', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a4a' }}>
                                <TextInput
                                    value={noteText}
                                    onChangeText={setNoteText}
                                    placeholder="Add a note about this lead..."
                                    placeholderTextColor="#4a4a6a"
                                    multiline
                                    style={{ color: '#fff', fontFamily: 'Rubik-Regular', fontSize: 14, minHeight: 60, textAlignVertical: 'top' }}
                                />
                                <TouchableOpacity
                                    onPress={handleAddNote}
                                    disabled={addingNote || !noteText.trim()}
                                    style={{ backgroundColor: noteText.trim() ? '#7c6cfc' : '#2a2a4a', borderRadius: 10, paddingVertical: 9, alignItems: 'center', marginTop: 10 }}
                                >
                                    {addingNote ? <ActivityIndicator color="#fff" size="small" /> : (
                                        <Text style={{ color: noteText.trim() ? '#fff' : '#4a4a6a', fontFamily: 'Rubik-SemiBold', fontSize: 13 }}>Add Note</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Notes list - latest first */}
                            {[...lead.notes].reverse().map((note, i) => (
                                <View key={note._id || i} style={{ backgroundColor: '#14142b', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a', borderLeftWidth: 3, borderLeftColor: '#7c6cfc' }}>
                                    <Text style={{ color: '#c4c8e8', fontFamily: 'Rubik-Regular', fontSize: 14, lineHeight: 20 }}>{note.text}</Text>
                                    <Text style={{ color: '#4a4a6a', fontFamily: 'Rubik-Regular', fontSize: 11, marginTop: 6 }}>
                                        🕐 {formatDate(note.createdAt)}
                                    </Text>
                                </View>
                            ))}

                            {lead.notes.length === 0 && (
                                <Text style={{ color: '#4a4a6a', fontFamily: 'Rubik-Regular', fontSize: 13, textAlign: 'center', marginTop: 8 }}>No notes yet. Add one above!</Text>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
