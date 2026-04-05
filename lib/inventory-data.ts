// ─── Types ────────────────────────────────────────────────────────────

export interface Category {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    projectCount: number;
    gradientColors: [string, string];
}

export interface Project {
    id: string;
    categoryId: string;
    name: string;
    developer: string;
    location: string;
    address: string;
    description: string;
    totalUnits: number;
    availableUnits: number;
    priceRange: string;
    status: "Under Construction" | "Ready to Move" | "Upcoming";
    amenities: string[];
    emoji: string;
}

export type UnitStatus = "Available" | "Sold" | "Reserved";

export interface BaseUnit {
    id: string;
    projectId: string;
    status: UnitStatus;
    price: number;
    area: number; // sqft
}

export interface CommercialUnit extends BaseUnit {
    type: "commercial";
    shopNumber: string;
    floor: string;
    frontage: string;
    usage: string;
}

export interface PlotUnit extends BaseUnit {
    type: "plot";
    plotNumber: string;
    dimensions: string;
    facing: string;
    roadWidth: string;
}

export interface ApartmentUnit extends BaseUnit {
    type: "apartment";
    flatNumber: string;
    floor: string;
    bhk: string;
    bathrooms: number;
    balconies: number;
    facing: string;
}

export type Unit = CommercialUnit | PlotUnit | ApartmentUnit;

// ─── Categories ───────────────────────────────────────────────────────

export const categories: Category[] = [
    {
        id: "commercial",
        title: "Commercial",
        subtitle: "Shops, Offices & Showrooms",
        emoji: "🏢",
        projectCount: 4,
        gradientColors: ["#667eea", "#764ba2"],
    },
    {
        id: "plots",
        title: "Plots",
        subtitle: "Residential & Commercial Plots",
        emoji: "🗺️",
        projectCount: 4,
        gradientColors: ["#f093fb", "#f5576c"],
    },
    {
        id: "apartments",
        title: "Apartments",
        subtitle: "Flats & Penthouses",
        emoji: "🏠",
        projectCount: 4,
        gradientColors: ["#4facfe", "#00f2fe"],
    },
];

// ─── Projects ─────────────────────────────────────────────────────────

export const projects: Project[] = [
    // ── Commercial Projects ──
    {
        id: "comm-1",
        categoryId: "commercial",
        name: "Phoenix Citadel Mall",
        developer: "Phoenix Group",
        location: "Vijay Nagar, Indore",
        address: "AB Road, Vijay Nagar, Indore, MP 452010",
        description:
            "Premium commercial spaces in the heart of Indore's busiest commercial district. Ideal for retail showrooms, brand outlets and food courts with high footfall.",
        totalUnits: 5,
        availableUnits: 3,
        priceRange: "₹45L – ₹1.8Cr",
        status: "Under Construction",
        amenities: ["Parking", "Power Backup", "Elevator", "CCTV", "Fire Safety"],
        emoji: "🏬",
    },
    {
        id: "comm-2",
        categoryId: "commercial",
        name: "Vijay Nagar Commercial Hub",
        developer: "Omaxe Ltd.",
        location: "Vijay Nagar, Indore",
        address: "Scheme No. 54, Vijay Nagar, Indore, MP 452010",
        description:
            "A state-of-the-art commercial complex featuring modern office spaces and retail outlets with excellent road connectivity and metro access.",
        totalUnits: 4,
        availableUnits: 2,
        priceRange: "₹32L – ₹95L",
        status: "Ready to Move",
        amenities: ["Parking", "Power Backup", "Elevator", "Security", "Cafeteria"],
        emoji: "🏗️",
    },
    {
        id: "comm-3",
        categoryId: "commercial",
        name: "Super Corridor Business Park",
        developer: "Prestige Developers",
        location: "Super Corridor, Indore",
        address: "Super Corridor, Indore, MP 452011",
        description:
            "IT & business park on Indore's fastest-growing corridor. Grade A office spaces with world-class infrastructure, perfect for startups and MNCs.",
        totalUnits: 4,
        availableUnits: 3,
        priceRange: "₹28L – ₹1.2Cr",
        status: "Under Construction",
        amenities: ["Parking", "High-Speed Internet", "Conference Hall", "Gym", "Cafeteria"],
        emoji: "💼",
    },
    {
        id: "comm-4",
        categoryId: "commercial",
        name: "Treasure Island Market",
        developer: "TI Developers",
        location: "MG Road, Indore",
        address: "MG Road, Near Rajwada, Indore, MP 452001",
        description:
            "Vibrant retail marketplace in old Indore, featuring traditional and modern shops. Prime location near Rajwada with heavy daily footfall.",
        totalUnits: 4,
        availableUnits: 2,
        priceRange: "₹18L – ₹65L",
        status: "Ready to Move",
        amenities: ["Parking", "Power Backup", "Security", "Loading Dock"],
        emoji: "🛒",
    },

    // ── Plot Projects ──
    {
        id: "plot-1",
        categoryId: "plots",
        name: "Green Meadows Township",
        developer: "Shubham Developers",
        location: "Rau, Indore",
        address: "Rau-Pithampur Road, Rau, Indore, MP 453331",
        description:
            "Well-planned gated township with landscaped plots on Rau-Pithampur Road. Close to SEZ, schools, and hospitals with wide internal roads.",
        totalUnits: 5,
        availableUnits: 3,
        priceRange: "₹12L – ₹35L",
        status: "Ready to Move",
        amenities: ["Boundary Wall", "Garden", "Internal Roads", "Street Lights", "Temple"],
        emoji: "🌿",
    },
    {
        id: "plot-2",
        categoryId: "plots",
        name: "Royal Palms Plots",
        developer: "Royal Group",
        location: "Khandwa Road, Indore",
        address: "Khandwa Road, Near IIM, Indore, MP 453112",
        description:
            "Premium residential plots near IIM Indore with Vastu-compliant layouts, underground cabling, and excellent appreciation potential.",
        totalUnits: 4,
        availableUnits: 2,
        priceRange: "₹22L – ₹55L",
        status: "Ready to Move",
        amenities: ["Club House", "Park", "Underground Cabling", "Water Supply", "Security"],
        emoji: "🌴",
    },
    {
        id: "plot-3",
        categoryId: "plots",
        name: "Super Corridor Premium Plots",
        developer: "IDA Approved",
        location: "Super Corridor, Indore",
        address: "Scheme 163, Super Corridor, Indore, MP 452011",
        description:
            "IDA-approved premium plots on Indore's most sought-after corridor. Close to IT hub, AIIMS, and proposed metro line.",
        totalUnits: 4,
        availableUnits: 3,
        priceRange: "₹35L – ₹1.1Cr",
        status: "Under Construction",
        amenities: ["Wide Roads", "Park", "Commercial Zone", "Underground Drainage", "Street Lights"],
        emoji: "📐",
    },
    {
        id: "plot-4",
        categoryId: "plots",
        name: "Silicon City Phase 2",
        developer: "MP Housing Board",
        location: "Bijalpur, Indore",
        address: "Bijalpur, Near Ring Road, Indore, MP 452012",
        description:
            "Affordable residential plots by MP Housing Board near Ring Road. Perfect for first-time buyers with easy EMI options.",
        totalUnits: 5,
        availableUnits: 4,
        priceRange: "₹8L – ₹22L",
        status: "Upcoming",
        amenities: ["Park", "Community Hall", "Water Tank", "Street Lights", "Drainage"],
        emoji: "🏡",
    },

    // ── Apartment Projects ──
    {
        id: "apt-1",
        categoryId: "apartments",
        name: "DB City Luxury Apartments",
        developer: "DB Corp",
        location: "Arera Colony, Indore",
        address: "DB City Mall Road, Arera Colony, Indore, MP 452016",
        description:
            "Ultra-luxury apartments adjacent to DB City Mall. Premium living with world-class amenities, rooftop infinity pool, and skyline views.",
        totalUnits: 4,
        availableUnits: 2,
        priceRange: "₹85L – ₹2.5Cr",
        status: "Ready to Move",
        amenities: ["Swimming Pool", "Gym", "Club House", "Children Play Area", "Power Backup"],
        emoji: "✨",
    },
    {
        id: "apt-2",
        categoryId: "apartments",
        name: "Sapphire Heights",
        developer: "Konark Developers",
        location: "Vijay Nagar, Indore",
        address: "Scheme 74, Vijay Nagar, Indore, MP 452010",
        description:
            "Modern 2 & 3 BHK apartments in the prime Vijay Nagar area. Walkable to schools, hospitals, and the main market.",
        totalUnits: 5,
        availableUnits: 3,
        priceRange: "₹42L – ₹78L",
        status: "Under Construction",
        amenities: ["Parking", "Gym", "Garden", "Power Backup", "Security"],
        emoji: "💎",
    },
    {
        id: "apt-3",
        categoryId: "apartments",
        name: "Omaxe City Residences",
        developer: "Omaxe Ltd.",
        location: "Super Corridor, Indore",
        address: "Scheme 140, Super Corridor, Indore, MP 452011",
        description:
            "Spacious apartments on Super Corridor with breathtaking views. Smart home features, green building certified, near IT hub.",
        totalUnits: 4,
        availableUnits: 3,
        priceRange: "₹55L – ₹1.4Cr",
        status: "Under Construction",
        amenities: ["Swimming Pool", "Gym", "Jogging Track", "Club House", "CCTV"],
        emoji: "🌆",
    },
    {
        id: "apt-4",
        categoryId: "apartments",
        name: "Prestige Sunrise Towers",
        developer: "Prestige Developers",
        location: "Bicholi Mardana, Indore",
        address: "AB Road, Bicholi Mardana, Indore, MP 452016",
        description:
            "Affordable 1, 2 & 3 BHK apartments with excellent connectivity to the city center. Ideal for young professionals and families.",
        totalUnits: 5,
        availableUnits: 4,
        priceRange: "₹25L – ₹58L",
        status: "Upcoming",
        amenities: ["Parking", "Garden", "Children Play Area", "Power Backup", "Water Supply"],
        emoji: "🌅",
    },
];

// ─── Units ────────────────────────────────────────────────────────────

export const units: Unit[] = [
    // ── Phoenix Citadel Mall (comm-1) ──
    { id: "u1", projectId: "comm-1", type: "commercial", shopNumber: "G-101", floor: "Ground Floor", area: 450, frontage: "20 ft", usage: "Retail Showroom", price: 9500000, status: "Available" },
    { id: "u2", projectId: "comm-1", type: "commercial", shopNumber: "G-102", floor: "Ground Floor", area: 320, frontage: "15 ft", usage: "Brand Outlet", price: 7200000, status: "Sold" },
    { id: "u3", projectId: "comm-1", type: "commercial", shopNumber: "F1-201", floor: "1st Floor", area: 600, frontage: "25 ft", usage: "Food Court", price: 12000000, status: "Available" },
    { id: "u4", projectId: "comm-1", type: "commercial", shopNumber: "F1-205", floor: "1st Floor", area: 280, frontage: "12 ft", usage: "Retail Shop", price: 5800000, status: "Reserved" },
    { id: "u5", projectId: "comm-1", type: "commercial", shopNumber: "F2-301", floor: "2nd Floor", area: 850, frontage: "30 ft", usage: "Office Space", price: 18000000, status: "Available" },

    // ── Vijay Nagar Commercial Hub (comm-2) ──
    { id: "u6", projectId: "comm-2", type: "commercial", shopNumber: "A-01", floor: "Ground Floor", area: 350, frontage: "18 ft", usage: "Retail Shop", price: 6500000, status: "Available" },
    { id: "u7", projectId: "comm-2", type: "commercial", shopNumber: "A-02", floor: "Ground Floor", area: 400, frontage: "20 ft", usage: "Showroom", price: 8500000, status: "Sold" },
    { id: "u8", projectId: "comm-2", type: "commercial", shopNumber: "B-11", floor: "1st Floor", area: 550, frontage: "22 ft", usage: "Office Space", price: 9500000, status: "Available" },
    { id: "u9", projectId: "comm-2", type: "commercial", shopNumber: "B-12", floor: "1st Floor", area: 300, frontage: "14 ft", usage: "Clinic", price: 5200000, status: "Sold" },

    // ── Super Corridor Business Park (comm-3) ──
    { id: "u10", projectId: "comm-3", type: "commercial", shopNumber: "OF-101", floor: "1st Floor", area: 800, frontage: "—", usage: "IT Office", price: 10500000, status: "Available" },
    { id: "u11", projectId: "comm-3", type: "commercial", shopNumber: "OF-102", floor: "1st Floor", area: 1200, frontage: "—", usage: "Co-Working Space", price: 12000000, status: "Available" },
    { id: "u12", projectId: "comm-3", type: "commercial", shopNumber: "OF-201", floor: "2nd Floor", area: 650, frontage: "—", usage: "Startup Office", price: 7800000, status: "Reserved" },
    { id: "u13", projectId: "comm-3", type: "commercial", shopNumber: "OF-301", floor: "3rd Floor", area: 500, frontage: "—", usage: "Corporate Suite", price: 6800000, status: "Available" },

    // ── Treasure Island Market (comm-4) ──
    { id: "u14", projectId: "comm-4", type: "commercial", shopNumber: "TI-G01", floor: "Ground Floor", area: 220, frontage: "12 ft", usage: "Retail Shop", price: 3200000, status: "Available" },
    { id: "u15", projectId: "comm-4", type: "commercial", shopNumber: "TI-G02", floor: "Ground Floor", area: 180, frontage: "10 ft", usage: "Kiosk", price: 1800000, status: "Sold" },
    { id: "u16", projectId: "comm-4", type: "commercial", shopNumber: "TI-F03", floor: "1st Floor", area: 350, frontage: "16 ft", usage: "Restaurant", price: 5500000, status: "Available" },
    { id: "u17", projectId: "comm-4", type: "commercial", shopNumber: "TI-F04", floor: "1st Floor", area: 250, frontage: "14 ft", usage: "Boutique", price: 4200000, status: "Sold" },

    // ── Green Meadows Township (plot-1) ──
    { id: "u18", projectId: "plot-1", type: "plot", plotNumber: "GM-A01", dimensions: "30×50 ft", facing: "East", roadWidth: "30 ft", area: 1500, price: 1800000, status: "Available" },
    { id: "u19", projectId: "plot-1", type: "plot", plotNumber: "GM-A02", dimensions: "30×60 ft", facing: "North", roadWidth: "30 ft", area: 1800, price: 2200000, status: "Sold" },
    { id: "u20", projectId: "plot-1", type: "plot", plotNumber: "GM-B05", dimensions: "40×60 ft", facing: "West", roadWidth: "40 ft", area: 2400, price: 3500000, status: "Available" },
    { id: "u21", projectId: "plot-1", type: "plot", plotNumber: "GM-C03", dimensions: "25×50 ft", facing: "South", roadWidth: "20 ft", area: 1250, price: 1200000, status: "Available" },
    { id: "u22", projectId: "plot-1", type: "plot", plotNumber: "GM-D01", dimensions: "50×80 ft", facing: "East", roadWidth: "40 ft", area: 4000, price: 5500000, status: "Reserved" },

    // ── Royal Palms Plots (plot-2) ──
    { id: "u23", projectId: "plot-2", type: "plot", plotNumber: "RP-01", dimensions: "40×60 ft", facing: "East", roadWidth: "40 ft", area: 2400, price: 3800000, status: "Available" },
    { id: "u24", projectId: "plot-2", type: "plot", plotNumber: "RP-02", dimensions: "30×50 ft", facing: "North", roadWidth: "30 ft", area: 1500, price: 2500000, status: "Sold" },
    { id: "u25", projectId: "plot-2", type: "plot", plotNumber: "RP-07", dimensions: "50×80 ft", facing: "North-East", roadWidth: "40 ft", area: 4000, price: 5500000, status: "Available" },
    { id: "u26", projectId: "plot-2", type: "plot", plotNumber: "RP-12", dimensions: "35×55 ft", facing: "West", roadWidth: "30 ft", area: 1925, price: 2900000, status: "Sold" },

    // ── Super Corridor Premium Plots (plot-3) ──
    { id: "u27", projectId: "plot-3", type: "plot", plotNumber: "SC-A01", dimensions: "40×80 ft", facing: "East", roadWidth: "60 ft", area: 3200, price: 6400000, status: "Available" },
    { id: "u28", projectId: "plot-3", type: "plot", plotNumber: "SC-A02", dimensions: "30×60 ft", facing: "North", roadWidth: "40 ft", area: 1800, price: 3600000, status: "Available" },
    { id: "u29", projectId: "plot-3", type: "plot", plotNumber: "SC-B05", dimensions: "50×100 ft", facing: "South", roadWidth: "60 ft", area: 5000, price: 11000000, status: "Reserved" },
    { id: "u30", projectId: "plot-3", type: "plot", plotNumber: "SC-C03", dimensions: "35×60 ft", facing: "West", roadWidth: "40 ft", area: 2100, price: 4200000, status: "Available" },

    // ── Silicon City Phase 2 (plot-4) ──
    { id: "u31", projectId: "plot-4", type: "plot", plotNumber: "SL-101", dimensions: "25×40 ft", facing: "East", roadWidth: "20 ft", area: 1000, price: 800000, status: "Available" },
    { id: "u32", projectId: "plot-4", type: "plot", plotNumber: "SL-102", dimensions: "25×50 ft", facing: "North", roadWidth: "20 ft", area: 1250, price: 1100000, status: "Available" },
    { id: "u33", projectId: "plot-4", type: "plot", plotNumber: "SL-205", dimensions: "30×50 ft", facing: "West", roadWidth: "30 ft", area: 1500, price: 1500000, status: "Available" },
    { id: "u34", projectId: "plot-4", type: "plot", plotNumber: "SL-210", dimensions: "30×60 ft", facing: "South", roadWidth: "30 ft", area: 1800, price: 2200000, status: "Reserved" },
    { id: "u35", projectId: "plot-4", type: "plot", plotNumber: "SL-301", dimensions: "40×60 ft", facing: "North-East", roadWidth: "40 ft", area: 2400, price: 2800000, status: "Available" },

    // ── DB City Luxury Apartments (apt-1) ──
    { id: "u36", projectId: "apt-1", type: "apartment", flatNumber: "A-501", floor: "5th Floor", bhk: "3 BHK", area: 1850, bathrooms: 3, balconies: 2, facing: "East", price: 14500000, status: "Available" },
    { id: "u37", projectId: "apt-1", type: "apartment", flatNumber: "A-802", floor: "8th Floor", bhk: "4 BHK", area: 2400, bathrooms: 4, balconies: 3, facing: "North-East", price: 25000000, status: "Sold" },
    { id: "u38", projectId: "apt-1", type: "apartment", flatNumber: "B-303", floor: "3rd Floor", bhk: "2 BHK", area: 1250, bathrooms: 2, balconies: 1, facing: "West", price: 8500000, status: "Available" },
    { id: "u39", projectId: "apt-1", type: "apartment", flatNumber: "P-1201", floor: "12th Floor", bhk: "5 BHK Penthouse", area: 3500, bathrooms: 5, balconies: 4, facing: "Panoramic", price: 45000000, status: "Reserved" },

    // ── Sapphire Heights (apt-2) ──
    { id: "u40", projectId: "apt-2", type: "apartment", flatNumber: "T1-201", floor: "2nd Floor", bhk: "2 BHK", area: 1050, bathrooms: 2, balconies: 1, facing: "East", price: 4200000, status: "Available" },
    { id: "u41", projectId: "apt-2", type: "apartment", flatNumber: "T1-401", floor: "4th Floor", bhk: "3 BHK", area: 1450, bathrooms: 2, balconies: 2, facing: "North", price: 6200000, status: "Available" },
    { id: "u42", projectId: "apt-2", type: "apartment", flatNumber: "T2-301", floor: "3rd Floor", bhk: "2 BHK", area: 1100, bathrooms: 2, balconies: 1, facing: "South", price: 4500000, status: "Sold" },
    { id: "u43", projectId: "apt-2", type: "apartment", flatNumber: "T2-601", floor: "6th Floor", bhk: "3 BHK", area: 1500, bathrooms: 3, balconies: 2, facing: "West", price: 7000000, status: "Available" },
    { id: "u44", projectId: "apt-2", type: "apartment", flatNumber: "T2-701", floor: "7th Floor", bhk: "3 BHK", area: 1550, bathrooms: 3, balconies: 2, facing: "North-East", price: 7800000, status: "Reserved" },

    // ── Omaxe City Residences (apt-3) ──
    { id: "u45", projectId: "apt-3", type: "apartment", flatNumber: "OC-102", floor: "1st Floor", bhk: "2 BHK", area: 1100, bathrooms: 2, balconies: 1, facing: "East", price: 5500000, status: "Available" },
    { id: "u46", projectId: "apt-3", type: "apartment", flatNumber: "OC-305", floor: "3rd Floor", bhk: "3 BHK", area: 1600, bathrooms: 3, balconies: 2, facing: "North", price: 9200000, status: "Available" },
    { id: "u47", projectId: "apt-3", type: "apartment", flatNumber: "OC-507", floor: "5th Floor", bhk: "3 BHK", area: 1650, bathrooms: 3, balconies: 2, facing: "East", price: 10500000, status: "Sold" },
    { id: "u48", projectId: "apt-3", type: "apartment", flatNumber: "OC-P01", floor: "10th Floor", bhk: "4 BHK Duplex", area: 2800, bathrooms: 4, balconies: 3, facing: "Panoramic", price: 14000000, status: "Available" },

    // ── Prestige Sunrise Towers (apt-4) ──
    { id: "u49", projectId: "apt-4", type: "apartment", flatNumber: "PS-101", floor: "1st Floor", bhk: "1 BHK", area: 650, bathrooms: 1, balconies: 1, facing: "East", price: 2500000, status: "Available" },
    { id: "u50", projectId: "apt-4", type: "apartment", flatNumber: "PS-202", floor: "2nd Floor", bhk: "2 BHK", area: 1000, bathrooms: 2, balconies: 1, facing: "North", price: 3800000, status: "Available" },
    { id: "u51", projectId: "apt-4", type: "apartment", flatNumber: "PS-305", floor: "3rd Floor", bhk: "2 BHK", area: 1050, bathrooms: 2, balconies: 1, facing: "West", price: 4000000, status: "Sold" },
    { id: "u52", projectId: "apt-4", type: "apartment", flatNumber: "PS-504", floor: "5th Floor", bhk: "3 BHK", area: 1400, bathrooms: 2, balconies: 2, facing: "South", price: 5800000, status: "Available" },
    { id: "u53", projectId: "apt-4", type: "apartment", flatNumber: "PS-603", floor: "6th Floor", bhk: "3 BHK", area: 1450, bathrooms: 3, balconies: 2, facing: "East", price: 5500000, status: "Available" },
];

// ─── Helper functions ─────────────────────────────────────────────────

export function getProjectsByCategory(categoryId: string): Project[] {
    return projects.filter((p) => p.categoryId === categoryId);
}

export function getProjectById(projectId: string): Project | undefined {
    return projects.find((p) => p.id === projectId);
}

export function getUnitsByProject(projectId: string): Unit[] {
    return units.filter((u) => u.projectId === projectId);
}

export function getCategoryById(categoryId: string): Category | undefined {
    return categories.find((c) => c.id === categoryId);
}

export function formatPrice(price: number): string {
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
}
