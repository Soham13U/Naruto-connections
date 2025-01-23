import { fetchCharacters, Character } from "./api";

export interface Connection {
  name: string;
  attribute: keyof Character;
  ids: number[];
}

export const generateConnections = async (): Promise<Connection[]> => {
  try {
    const allCharacters = await fetchCharacters([]);

    if (!Array.isArray(allCharacters)) {
      console.error("Error: Expected an array but got:", allCharacters);
      return [];
    }

    const connectionsMap: {
      [key: string]: { attribute: keyof Character; ids: Set<number> };
    } = {};

    allCharacters.forEach((char) => {
      const addToMap = (key: string, attribute: keyof Character) => {
        if (!connectionsMap[key]) {
          connectionsMap[key] = { attribute, ids: new Set() };
        }
        connectionsMap[key].ids.add(char.id);
      };

      if (char.clan) addToMap(char.clan, "clan");
      if (char.team) char.team.forEach((team) => addToMap(team, "team"));
      if (char.classification)
        char.classification.forEach((cls) => addToMap(cls, "classification"));
      if (char.natureType)
        char.natureType.forEach((nature) => addToMap(nature, "natureType"));
      if (char.uniqueTraits)
        char.uniqueTraits.forEach((trait) => addToMap(trait, "uniqueTraits"));
    });

    return Object.keys(connectionsMap).map((key) => ({
      name: key,
      attribute: connectionsMap[key].attribute,
      ids: Array.from(connectionsMap[key].ids),
    }));
  } catch (error) {
    console.error("Error generating connections:", error);
    return [];
  }
};
