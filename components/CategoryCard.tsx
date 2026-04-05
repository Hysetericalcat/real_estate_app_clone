import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Category } from '@/lib/inventory-data'

interface Props {
    item: Category
    onPress?: () => void
}

const CategoryCard = ({ item, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-full mb-5 rounded-3xl overflow-hidden"
            style={{
                backgroundColor: item.gradientColors[0],
                shadowColor: item.gradientColors[0],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 10,
            }}
            activeOpacity={0.85}
        >
            <View className="px-7 py-10">
                <View className="flex flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-5xl mb-3">{item.emoji}</Text>
                        <Text className="text-white text-2xl font-rubik-bold">
                            {item.title}
                        </Text>
                        <Text className="text-white/80 text-sm font-rubik mt-1">
                            {item.subtitle}
                        </Text>
                    </View>
                    <View className="bg-white/20 rounded-2xl px-4 py-3 items-center">
                        <Text className="text-white text-2xl font-rubik-bold">
                            {item.projectCount}
                        </Text>
                        <Text className="text-white/80 text-xs font-rubik">Projects</Text>
                    </View>
                </View>

                <View className="flex flex-row items-center mt-5 bg-white/15 rounded-full px-4 py-2.5 self-start">
                    <Text className="text-white text-xs font-rubik-medium">
                        Explore Projects →
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CategoryCard
