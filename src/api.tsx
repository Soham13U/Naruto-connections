import axios from "axios";

const BASE_URL = "https://dattebayo-api.onrender.com";

export interface Character {
  id: number;
  name: string;
  images: string[];
  clan?: string;
  team?: string[];
  classification?: string[];
  natureType?: string[];
  uniqueTraits?: string[];
}

export const fetchCharacters = async (
  ids: number[] = []
): Promise<Character[]> => {
  try {
    let url = `${BASE_URL}/characters`;

    if (ids.length > 0) {
      url += `/${ids.join(",")}`;
    }

    const response = await axios.get<{ characters: Character[] }>(url);
    console.log("Fetched Characters:", response.data.characters);
    return response.data.characters || [];
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
};
