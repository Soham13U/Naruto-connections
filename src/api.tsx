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

export const fetchAllCharacters = async (): Promise<
  Record<string, any>[]
> => {
  const allCharacters: Record<string, any>[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (true) {
      const response = await axios.get<{
        characters: Record<string, any>[];
      }>(`${BASE_URL}/characters`, {
        params: { page, limit },
      });

      const characters = response.data?.characters ?? [];

      if (!characters.length) {
        break;
      }

      allCharacters.push(...characters);

      if (characters.length < limit) {
        break;
      }

      page++;
    }

    console.log("Fetched all characters:", allCharacters.length);
    return allCharacters;
  } catch (error) {
    console.error("Error fetching all characters:", error);
    return [];
  }
};