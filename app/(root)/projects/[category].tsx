import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { getProjectsByCategory, getCategoryById } from '@/lib/inventory-data'
import ProjectCard from '@/components/ProjectCard'
import React from 'react'

export default function ProjectsScreen() {
    const { category } = useLocalSearchParams<{ category: string }>()
    const categoryData = getCategoryById(category!)
    const projectsList = getProjectsByCategory(category!)

    const categoryColor =
        category === 'commercial'
            ? '#667eea'
            : category === 'plots'
                ? '#f5576c'
                : '#4facfe'

    return (
        <SafeAreaView className="bg-white h-full">
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={projectsList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pb-10"
                renderItem={({ item }) => (
                    <ProjectCard
                        item={item}
                        onPress={() => router.push(`/(root)/units/${item.id}` as any)}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="mt-4 mb-5">
                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex flex-row items-center mb-5"
                        >
                            <Text className="text-lg">←</Text>
                            <Text className="text-sm font-rubik-medium text-primary-300 ml-2">
                                Back to Categories
                            </Text>
                        </TouchableOpacity>

                        {/* Category Header */}
                        <View
                            className="rounded-2xl px-6 py-5"
                            style={{ backgroundColor: categoryColor }}
                        >
                            <Text className="text-3xl mb-2">{categoryData?.emoji}</Text>
                            <Text className="text-2xl font-rubik-bold text-white">
                                {categoryData?.title}
                            </Text>
                            <Text className="text-sm font-rubik text-white/80 mt-1">
                                {categoryData?.subtitle}
                            </Text>
                            <Text className="text-xs font-rubik-medium text-white/60 mt-2">
                                {projectsList.length} projects in Indore, MP
                            </Text>
                        </View>

                        <Text className="text-xl font-rubik-bold text-black-300 mt-6 mb-1">
                            Available Projects
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center py-10">
                        <Text className="text-4xl mb-3">🏗️</Text>
                        <Text className="text-base font-rubik-medium text-black-200">
                            No projects found
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}
