import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Project } from '@/lib/inventory-data'

interface Props {
    item: Project
    onPress?: () => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
    "Ready to Move": { bg: "#dcfce7", text: "#166534" },
    "Under Construction": { bg: "#fef3c7", text: "#92400e" },
    "Upcoming": { bg: "#dbeafe", text: "#1e40af" },
}

const ProjectCard = ({ item, onPress }: Props) => {
    const statusStyle = statusColors[item.status] || statusColors["Upcoming"]

    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-full mb-4 rounded-2xl bg-white overflow-hidden"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
            }}
            activeOpacity={0.85}
        >
            {/* Top color bar */}
            <View
                className="h-2 w-full"
                style={{ backgroundColor: item.categoryId === 'commercial' ? '#667eea' : item.categoryId === 'plots' ? '#f5576c' : '#4facfe' }}
            />

            <View className="px-5 py-5">
                {/* Header */}
                <View className="flex flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                        <View className="flex flex-row items-center mb-1">
                            <Text className="text-2xl mr-2">{item.emoji}</Text>
                            <Text className="text-lg font-rubik-bold text-black-300 flex-1" numberOfLines={1}>
                                {item.name}
                            </Text>
                        </View>
                        <Text className="text-xs font-rubik text-black-100 mt-0.5">
                            by {item.developer}
                        </Text>
                    </View>
                    <View
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: statusStyle.bg }}
                    >
                        <Text
                            className="text-xs font-rubik-semibold"
                            style={{ color: statusStyle.text }}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* Location */}
                <View className="flex flex-row items-center mt-3">
                    <Text className="text-sm">📍</Text>
                    <Text className="text-sm font-rubik-medium text-black-200 ml-1">
                        {item.location}
                    </Text>
                </View>

                {/* Description */}
                <Text className="text-sm font-rubik text-black-100 mt-2" numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Stats Row */}
                <View className="flex flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <View className="flex flex-row items-center">
                        <View className="bg-primary-100 rounded-lg px-3 py-1.5">
                            <Text className="text-xs font-rubik-bold text-primary-300">
                                {item.availableUnits}/{item.totalUnits} Available
                            </Text>
                        </View>
                    </View>
                    <Text className="text-sm font-rubik-bold text-black-300">
                        {item.priceRange}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProjectCard
