import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { getProjectById, getUnitsByProject } from '@/lib/inventory-data'
import UnitCard from '@/components/UnitCard'
import React from 'react'

export default function UnitsScreen() {
    const { projectId } = useLocalSearchParams<{ projectId: string }>()
    const project = getProjectById(projectId!)
    const unitsList = getUnitsByProject(projectId!)

    const availableCount = unitsList.filter((u) => u.status === 'Available').length
    const soldCount = unitsList.filter((u) => u.status === 'Sold').length
    const reservedCount = unitsList.filter((u) => u.status === 'Reserved').length

    const categoryColor =
        project?.categoryId === 'commercial'
            ? '#667eea'
            : project?.categoryId === 'plots'
                ? '#f5576c'
                : '#4facfe'

    if (!project) {
        return (
            <SafeAreaView className="bg-white h-full items-center justify-center">
                <Text className="text-4xl mb-3">🔍</Text>
                <Text className="text-base font-rubik-medium text-black-200">
                    Project not found
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={unitsList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pb-10"
                renderItem={({ item }) => <UnitCard item={item} />}
                ListHeaderComponent={() => (
                    <View className="mt-4 mb-5">
                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex flex-row items-center mb-5"
                        >
                            <Text className="text-lg">←</Text>
                            <Text className="text-sm font-rubik-medium text-primary-300 ml-2">
                                Back to Projects
                            </Text>
                        </TouchableOpacity>

                        {/* Project Header */}
                        <View
                            className="rounded-2xl px-6 py-5"
                            style={{ backgroundColor: categoryColor }}
                        >
                            <Text className="text-3xl mb-2">{project.emoji}</Text>
                            <Text className="text-xl font-rubik-bold text-white">
                                {project.name}
                            </Text>
                            <Text className="text-xs font-rubik-medium text-white/70 mt-1">
                                by {project.developer}
                            </Text>
                            <View className="flex flex-row items-center mt-2">
                                <Text className="text-sm text-white/80">📍</Text>
                                <Text className="text-sm font-rubik text-white/80 ml-1">
                                    {project.address}
                                </Text>
                            </View>
                        </View>

                        {/* Description */}
                        <View className="mt-4 bg-accent-100 rounded-xl px-5 py-4 border border-primary-200">
                            <Text className="text-sm font-rubik text-black-200">
                                {project.description}
                            </Text>
                        </View>

                        {/* Price Range */}
                        <View className="flex flex-row items-center justify-between mt-4 bg-gray-50 rounded-xl px-5 py-3">
                            <Text className="text-sm font-rubik text-black-100">Price Range</Text>
                            <Text className="text-base font-rubik-bold text-primary-300">
                                {project.priceRange}
                            </Text>
                        </View>

                        {/* Stats */}
                        <View className="flex flex-row mt-4 gap-3">
                            <View className="flex-1 bg-green-50 rounded-xl px-4 py-3 items-center">
                                <Text className="text-xl font-rubik-bold text-green-700">
                                    {availableCount}
                                </Text>
                                <Text className="text-xs font-rubik text-green-600">Available</Text>
                            </View>
                            <View className="flex-1 bg-red-50 rounded-xl px-4 py-3 items-center">
                                <Text className="text-xl font-rubik-bold text-red-700">
                                    {soldCount}
                                </Text>
                                <Text className="text-xs font-rubik text-red-600">Sold</Text>
                            </View>
                            <View className="flex-1 bg-amber-50 rounded-xl px-4 py-3 items-center">
                                <Text className="text-xl font-rubik-bold text-amber-700">
                                    {reservedCount}
                                </Text>
                                <Text className="text-xs font-rubik text-amber-600">Reserved</Text>
                            </View>
                        </View>

                        {/* Amenities */}
                        {project.amenities.length > 0 && (
                            <View className="mt-4">
                                <Text className="text-sm font-rubik-bold text-black-300 mb-2">
                                    Amenities
                                </Text>
                                <View className="flex flex-row flex-wrap gap-2">
                                    {project.amenities.map((amenity, index) => (
                                        <View
                                            key={index}
                                            className="bg-primary-100 rounded-full px-3 py-1.5"
                                        >
                                            <Text className="text-xs font-rubik-medium text-primary-300">
                                                {amenity}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <Text className="text-xl font-rubik-bold text-black-300 mt-6 mb-1">
                            Available Units ({unitsList.length})
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center py-10">
                        <Text className="text-4xl mb-3">📋</Text>
                        <Text className="text-base font-rubik-medium text-black-200">
                            No units listed yet
                        </Text>
                    </View>
                )}
            />

            {/* Bottom CTA */}
            <View className="absolute bottom-0 w-full bg-white border-t border-primary-200 px-5 py-4">
                <TouchableOpacity
                    className="bg-primary-300 rounded-full py-4 items-center"
                    style={{
                        shadowColor: '#0061FF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                    }}
                >
                    <Text className="text-white text-base font-rubik-bold">
                        📞 Enquire Now
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
