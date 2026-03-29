import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import { Redirect, router } from 'expo-router'

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className='h-full'>
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To Estate Sphere
          </Text>

          <Text className="text-2xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-4">
            Discover premium properties around the world
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/home')}
            className="bg-primary-300 shadow-md shadow-primary-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Text className="text-lg font-rubik-bold text-white ml-2">
                Explore Properties
              </Text>
            </View>
          </TouchableOpacity>
          <Text className='text-center mt-4 text-sm font-rubik-light'>&#x22C6; Developed By Binary-Shade &#x22C6;</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}