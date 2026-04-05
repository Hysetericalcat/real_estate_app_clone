import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Unit, CommercialUnit, PlotUnit, ApartmentUnit, formatPrice } from '@/lib/inventory-data'

interface Props {
    item: Unit
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Available: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
    Sold: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
    Reserved: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
}

const InfoPill = ({ label, value }: { label: string; value: string }) => (
    <View className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
        <Text className="text-[10px] font-rubik text-black-100 uppercase">{label}</Text>
        <Text className="text-xs font-rubik-semibold text-black-300">{value}</Text>
    </View>
)

const CommercialDetails = ({ unit }: { unit: CommercialUnit }) => (
    <View className="flex flex-row flex-wrap mt-3">
        <InfoPill label="Shop No." value={unit.shopNumber} />
        <InfoPill label="Floor" value={unit.floor} />
        <InfoPill label="Area" value={`${unit.area} sqft`} />
        <InfoPill label="Frontage" value={unit.frontage} />
        <InfoPill label="Usage" value={unit.usage} />
    </View>
)

const PlotDetails = ({ unit }: { unit: PlotUnit }) => (
    <View className="flex flex-row flex-wrap mt-3">
        <InfoPill label="Plot No." value={unit.plotNumber} />
        <InfoPill label="Dimensions" value={unit.dimensions} />
        <InfoPill label="Area" value={`${unit.area} sqft`} />
        <InfoPill label="Facing" value={unit.facing} />
        <InfoPill label="Road Width" value={unit.roadWidth} />
    </View>
)

const ApartmentDetails = ({ unit }: { unit: ApartmentUnit }) => (
    <View className="flex flex-row flex-wrap mt-3">
        <InfoPill label="Flat No." value={unit.flatNumber} />
        <InfoPill label="Config" value={unit.bhk} />
        <InfoPill label="Floor" value={unit.floor} />
        <InfoPill label="Area" value={`${unit.area} sqft`} />
        <InfoPill label="Baths" value={`${unit.bathrooms}`} />
        <InfoPill label="Balconies" value={`${unit.balconies}`} />
        <InfoPill label="Facing" value={unit.facing} />
    </View>
)

const UnitCard = ({ item }: Props) => {
    const status = statusConfig[item.status] || statusConfig.Available
    const emoji = item.type === 'commercial' ? '🏪' : item.type === 'plot' ? '📐' : '🏠'

    const unitLabel =
        item.type === 'commercial'
            ? (item as CommercialUnit).shopNumber
            : item.type === 'plot'
                ? (item as PlotUnit).plotNumber
                : (item as ApartmentUnit).flatNumber

    return (
        <View
            className="w-full mb-4 rounded-2xl bg-white overflow-hidden"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            <View className="px-5 py-4">
                {/* Header Row */}
                <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center flex-1">
                        <Text className="text-xl mr-2">{emoji}</Text>
                        <Text className="text-base font-rubik-bold text-black-300">
                            {unitLabel}
                        </Text>
                    </View>
                    <View
                        className="flex flex-row items-center rounded-full px-3 py-1.5"
                        style={{ backgroundColor: status.bg }}
                    >
                        <View
                            className="w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: status.dot }}
                        />
                        <Text
                            className="text-xs font-rubik-semibold"
                            style={{ color: status.text }}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* Details */}
                {item.type === 'commercial' && <CommercialDetails unit={item as CommercialUnit} />}
                {item.type === 'plot' && <PlotDetails unit={item as PlotUnit} />}
                {item.type === 'apartment' && <ApartmentDetails unit={item as ApartmentUnit} />}

                {/* Price */}
                <View className="flex flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-xs font-rubik text-black-100">Price</Text>
                    <Text className="text-lg font-rubik-bold text-primary-300">
                        {formatPrice(item.price)}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default UnitCard
