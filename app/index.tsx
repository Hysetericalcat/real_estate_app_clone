import { View, Text, FlatList, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { categories } from '@/lib/inventory-data'
import CategoryCard from '@/components/CategoryCard'

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            onPress={() => router.push(`/(root)/projects/${item.id}` as any)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="mt-6 mb-6">
            <View className="flex flex-row items-center mb-1">
              <Text className="text-3xl font-rubik-bold text-black-300">
                Estate Sphere
              </Text>
              <Text className="text-2xl ml-2">🏗️</Text>
            </View>
            <Text className="text-base font-rubik text-black-100">
              Property Inventory • Indore, MP
            </Text>

            <View className="mt-5 bg-accent-100 rounded-2xl px-5 py-4 border border-primary-200">
              <Text className="text-sm font-rubik-medium text-black-300">
                📊 Browse Categories
              </Text>
              <Text className="text-xs font-rubik text-black-100 mt-1">
                Select a category to explore available projects and units in Indore, Madhya Pradesh
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}