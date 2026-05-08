import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Use LAN IP when running on a physical device
// On simulator/web, localhost works fine
const getBaseUrl = () => {
    if (__DEV__) {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const host = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
        return `http://${host}:3001/api`;
    }
    return 'http://localhost:3001/api';
};

const BASE_URL = getBaseUrl();

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const json = await res.json();
    if (!json.success && res.status >= 400) {
        throw new Error(json.error || 'API Error');
    }
    return json;
}

// ── Property APIs ──────────────────────────────────────────────
export const getProperties = (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return request<{ success: boolean; data: Property[]; count: number }>(`/properties${query}`);
};

export const getProperty = (id: string) =>
    request<{ success: boolean; data: Property }>(`/properties/${id}`);

export const createProperty = (body: Partial<Property>) =>
    request<{ success: boolean; data: Property }>('/properties', {
        method: 'POST',
        body: JSON.stringify(body),
    });

export const updateProperty = (id: string, body: Partial<Property>) =>
    request<{ success: boolean; data: Property }>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

export const deleteProperty = (id: string) =>
    request<{ success: boolean; message: string }>(`/properties/${id}`, { method: 'DELETE' });

// ── Lead APIs ──────────────────────────────────────────────────
export const getLeads = (filters?: { status?: string; interest?: string }) => {
    const params = new URLSearchParams(filters as any).toString();
    return request<{ success: boolean; data: Lead[]; count: number }>(`/leads${params ? '?' + params : ''}`);
};

export const getLeadStats = () =>
    request<{ success: boolean; data: { total: number; byStatus: any[]; thisWeek: number } }>('/leads/stats/summary');

export const getLead = (id: string) =>
    request<{ success: boolean; data: Lead }>(`/leads/${id}`);

export const createLead = (body: Partial<Lead>) =>
    request<{ success: boolean; data: Lead }>('/leads', {
        method: 'POST',
        body: JSON.stringify(body),
    });

export const updateLead = (id: string, body: Partial<Lead>) =>
    request<{ success: boolean; data: Lead }>(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

export const addLeadNote = (id: string, text: string) =>
    request<{ success: boolean; data: Lead }>(`/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ text }),
    });

export const deleteLead = (id: string) =>
    request<{ success: boolean; message: string }>(`/leads/${id}`, { method: 'DELETE' });

// ── Types ──────────────────────────────────────────────────────
export interface Property {
    _id: string;
    title: string;
    description: string;
    category: 'house' | 'apartment' | 'commercial' | 'rent';
    price: number;
    priceLabel: string;
    location: string;
    locality: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    parking: boolean;
    furnished: string;
    amenities: string[];
    highlights: string[];
    status: 'Available' | 'Sold' | 'Rented' | 'Under Negotiation';
    facing: string;
    age: string;
    contactPerson: string;
    contactPhone: string;
    createdAt: string;
}

export interface Note {
    _id: string;
    text: string;
    createdAt: string;
}

export interface Lead {
    _id: string;
    name: string;
    phone: string;
    email: string;
    interest: 'house' | 'apartment' | 'commercial' | 'rent' | 'any';
    budget: string;
    budgetMin: number;
    budgetMax: number;
    preferredLocality: string;
    status: 'New' | 'Contacted' | 'Site Visit' | 'Negotiating' | 'Closed' | 'Lost';
    source: string;
    assignedTo: string;
    notes: Note[];
    lastContacted: string | null;
    followUpDate: string | null;
    priority: 'Low' | 'Medium' | 'High';
    createdAt: string;
}
