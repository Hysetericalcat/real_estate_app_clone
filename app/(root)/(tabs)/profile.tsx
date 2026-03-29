import { View, Text, Image, ScrollView, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import AntDesign from '@expo/vector-icons/AntDesign';
import { settings } from '@/constants/data'
import { router } from 'expo-router'

// Demo user for showcase
const demoUser = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=200&auto=format&fit=crop",
};

interface SettingsProps {
  icon: ImageSourcePropType,
  title: string,
  onPress?: () => void,
  textStyle?: string,
  showArrow?: boolean
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow }: SettingsProps) => {
  return (
    <TouchableOpacity className='flex flex-row items-center justify-between py-3' onPress={onPress}>
      <View className='flex flex-row items-center gap-3'>
        <Image
          source={icon}
          className='size-6'
        />
        <Text className={textStyle ? textStyle : "font-rubik text-sm"}>{title}</Text>
      </View>
      {
        showArrow &&
        <Image
          source={icons.rightArrow}
          className='size-5'
        />
      }
    </TouchableOpacity>
  )
}

const Profile = () => {
  const handleLogout = () => {
    router.replace('/')
  }

  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView contentContainerClassName='pb-32 px-7' showsVerticalScrollIndicator={false}>
        <View className='flex justify-between items-center flex-row mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <Image
            className='size-5'
            source={icons.bell}
          />
        </View>
        <View className='flex flex-row mt-5 justify-center'>
          <View className='flex flex-col mt-5 items-center'>
            <Image
              source={{ uri: demoUser.imageUrl }}
              className='w-44 h-44 rounded-full border border-black-100'
            />
            <TouchableOpacity className='absolute bottom-16 right-6 bg-white rounded-full p-1'>
              <AntDesign
                name='star'
                size={24}
                color={'#ffc918'}
              />
            </TouchableOpacity>
            <Text className='text-2xl font-rubik-bold mt-4'>{demoUser.fullName}</Text>
            <Text className='text-md text-black-200 font-rubik'>{demoUser.email}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} showArrow={true} />
          ))}
        </View>

        <View className='flex flex-col border-t mt-5 pt-5 border-blue-100'>
          <SettingsItem
            icon={icons.logout}
            title='Log Out'
            onPress={handleLogout}
            textStyle='font-rubik-semibold'
            showArrow={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile