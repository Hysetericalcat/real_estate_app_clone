import { properties, Property } from "./data";

export const getLatestProperties = async (): Promise<Property[]> => {
  // Return the first 5 properties sorted by "newest" (just take the last 5)
  return properties.slice(-5).reverse();
};

export const getProperties = async ({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}): Promise<Property[]> => {
  let filtered = [...properties];

  // Filter by type
  if (filter && filter !== "All") {
    filtered = filtered.filter(
      (p) => p.type.toLowerCase() === filter.toLowerCase()
    );
  }

  // Search by name, address, or type
  if (query && query.length > 0) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }

  // Limit results
  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
};

export async function getPropertyById({
  id,
}: {
  id: string;
}): Promise<Property | null> {
  return properties.find((p) => p.$id === id) ?? null;
}