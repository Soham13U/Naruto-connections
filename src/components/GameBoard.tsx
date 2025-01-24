import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export interface Connection {
  category: string;
  apiField: string;
  value: string;
  characters?: { id: number; name: string; image: string }[];
}

export const connections: Connection[] = [
  /* {
    category: "Personal - Status",
    apiField: "personal.status",
    value: "deceased",
  },
  { category: "Nature Type", apiField: "natureType", value: "Wind Release" },
  { category: "Nature Type", apiField: "natureType", value: "Fire Release" },
  { category: "Nature Type", apiField: "natureType", value: "Earth Release" },
  { category: "Nature Type", apiField: "natureType", value: "Water Release" }, */
  {
    category: "Nature Type",
    apiField: "natureType",
    value: "Lightning Release",
  },
  {
    category: "Classification",
    apiField: "personal.classification",
    value: "Sage",
  },
  {
    category: "Classification", // Tailed Beast
    apiField: "personal.classification",
    value: "Tailed Beast",
  },
  {
    category: "Classification",
    apiField: "personal.classification",
    value: "Jinchūriki",
  },
  {
    category: "Classification",
    apiField: "personal.classification",
    value: "Summon",
  },
  {
    category: "Kekkei Genkai",
    apiField: "personal.kekkeiGenkai",
    value: "Sharingan",
  },
  {
    category: "Kekkei Genkai",
    apiField: "personal.kekkeiGenkai",
    value: "Byakugan",
  },
  {
    category: "Kekkei Genkai",
    apiField: "personal.kekkeiGenkai",
    value: "Rinnegan",
  },
  { category: "Occupation", apiField: "personal.occupation", value: "Hokage" },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Seven Ninja Swordsmen of the Mist",
  },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Team Hiruzen",
  },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Team Minato",
  },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Team Ebisu",
  },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Team Tobirama",
  },
  {
    category: "Team",
    apiField: "personal.team",
    value: "Taka",
  }, //Team Hiruzen,Team Minato,Team Ebisu,Team Tobirama,

  { category: "Clan", apiField: "personal.clan", value: "Uzumaki" },
  { category: "Clan", apiField: "personal.clan", value: "Uchiha" },
  { category: "Clan", apiField: "personal.clan", value: "Sarutobi" },
  { category: "Clan", apiField: "personal.clan", value: "Hyūga" },
  { category: "Clan", apiField: "personal.clan", value: "Senju" },
  { category: "Clan", apiField: "personal.clan", value: "Aburame" },
  { category: "Clan", apiField: "personal.clan", value: "Akimichi" },
  { category: "Clan", apiField: "personal.clan", value: "Nara" },
  { category: "Clan", apiField: "personal.clan", value: "Inuzuka" }, //Aburame, Akimichi, Nara, Inuzuka,
  /* {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Konohagakure",
  }, */
  { category: "Species", apiField: "personal.species", value: "Dog" },

  //"personal": {        "species": "Dog",
  {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Kirigakure",
  },
  {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Sunagakure",
  },
  {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Kumogakure",
  },
  {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Iwagakure",
  },
  {
    category: "Affiliation",
    apiField: "personal.affiliation",
    value: "Akatsuki",
  },
  { category: "Affiliation", apiField: "personal.affiliation", value: "Root" },
];

type Character = { id: number; name: string; images: string[] };

const fetchCharacterData = async (
  connection: Connection,
  selectedIds: Set<number>
) => {
  let scannedCharacters: { id: number; name: string; image: string }[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (true) {
      const response = await axios.get(
        `https://dattebayo-api.onrender.com/characters`,
        {
          params: { page, limit },
        }
      );

      if (response.data && response.data.characters.length > 0) {
        const filteredCharacters = response.data.characters.filter(
          (character: Record<string, any>) => {
            const attribute = connection.apiField
              .split(".")
              .reduce((obj, key) => obj?.[key], character);

            if (Array.isArray(attribute)) {
              return attribute.some(
                (val: string) =>
                  val.toLowerCase() === connection.value.toLowerCase()
              );
            }

            return attribute?.toLowerCase() === connection.value.toLowerCase();
          }
        );

        // Store all scanned characters
        scannedCharacters.push(
          ...filteredCharacters.map((character: Character) => ({
            id: character.id,
            name: character.name,
            image: character.images[0] || "",
          }))
        );

        if (response.data.characters.length < limit) {
          break;
        }

        page++;
      } else {
        break;
      }
    }

    // Log all scanned characters before selection
    console.log(
      `Scanned characters for ${connection.category} - ${connection.value}:`,
      scannedCharacters
    );

    // Randomly select 4 unique characters from scannedCharacters after all pages are processed
    const shuffledCharacters = scannedCharacters.sort(
      () => Math.random() - 0.5
    );

    const allCharacters: { id: number; name: string; image: string }[] = [];

    shuffledCharacters.forEach((character) => {
      if (!selectedIds.has(character.id) && allCharacters.length < 4) {
        allCharacters.push(character);
        selectedIds.add(character.id);
      }
    });

    return allCharacters;
  } catch (error) {
    console.error(`Error fetching data for ${connection.value}:`, error);
    return [];
  }
};

const RandomConnections: React.FC = () => {
  const [connectionsWithData, setConnectionsWithData] = useState<Connection[]>(
    []
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([]);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [correctConnections, setCorrectConnections] = useState<Connection[]>(
    []
  );
  const [shuffledCharacters, setShuffledCharacters] = useState<
    { id: number; name: string; image: string }[]
  >([]);
  const [showNames, setShowNames] = useState<boolean>(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [initialCharacters, setInitialCharacters] = useState<
    { id: number; name: string; image: string }[]
  >([]);

  useEffect(() => {
    console.log("Initial characters set:", initialCharacters);
  }, [initialCharacters]);

  const initializeBoard = async (newBoard: boolean) => {
    console.log(newBoard);
    setCorrectConnections([]);
    setAttemptsLeft(3);
    setSelectedCharacters([]);
    setShowHint(false);

    const selectedIds = new Set<number>();
    let selectedConnections: Connection[] = [];
    let availableConnections = [...connections];

    while (selectedConnections.length < 4 && availableConnections.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * availableConnections.length
      );
      const connection = availableConnections[randomIndex];

      const characters = await fetchCharacterData(connection, selectedIds);

      if (characters.length === 4) {
        selectedConnections.push({ ...connection, characters });
      }

      availableConnections.splice(randomIndex, 1); // Remove the tested connection
    }

    if (selectedConnections.length < 4) {
      console.error("Unable to find enough unique connections.");

      return;
    }

    setConnectionsWithData(selectedConnections);
    setInitialCharacters(
      selectedConnections.flatMap((conn) => conn.characters || [])
    );

    setShuffledCharacters(
      selectedConnections
        .flatMap((conn) => conn.characters || [])
        .sort(() => Math.random() - 0.5)
    );
  };

  useEffect(() => {
    initializeBoard(true);
  }, []);

  const handleCharacterClick = (id: number) => {
    setSelectedCharacters((prev) =>
      prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id]
    );
  };

  const checkSelection = () => {
    if (selectedCharacters.length !== 4) return;
    const selectedConnection = connectionsWithData.find((conn) =>
      conn.characters?.every((char) => selectedCharacters.includes(char.id))
    );

    if (selectedConnection) {
      setCorrectConnections((prev) => [...prev, selectedConnection]);
      setShuffledCharacters((prev) =>
        prev.filter((char) => !selectedCharacters.includes(char.id))
      );
      setConnectionsWithData((prev) =>
        prev.filter((conn) => conn !== selectedConnection)
      );
      setSelectedCharacters([]);
    } else {
      setAttemptsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      if (attemptsLeft - 1 <= 0) {
        setShuffledCharacters([]);
        //setResultMessage("No attempts left! Reset to try again.");
      } else {
        setResultMessage("Wrong connection!");
      }
    }
    setTimeout(() => setResultMessage(""), 1000);
  };

  return (
    <div className="random-connections-container">
      <h2>Naruto Connections</h2>
      <button className="button" onClick={() => setShowNames(!showNames)}>
        {showNames ? "Hide Names" : "Show Names"}
      </button>
      <button className="button" onClick={() => setShowHint(!showHint)}>
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>
      {showHint && (
        <p>
          <strong>Hints:</strong>{" "}
          {connectionsWithData.map((conn) => conn.category).join(", ")}
        </p>
      )}
      <p className="attempts">Attempts Left: {Math.max(attemptsLeft, 0)}</p>
      {connectionsWithData.length === 0 && (
        <div className="win">Congratulations! You found all connections!</div>
      )}
      {attemptsLeft === 0 && (
        <div className="lose">No attempts left! Reset to try again</div>
      )}
      <p>{resultMessage}</p>

      <div className="correct-answers">
        {correctConnections.map((conn, index) => (
          <p key={index}>
            <strong>{conn.category}:</strong> {conn.value} -{" "}
            {conn.characters?.map((char) => `${char.name} `).join(", ")}
          </p>
        ))}
      </div>

      {shuffledCharacters.length > 0 ? (
        <div className="characters-grid">
          {shuffledCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => handleCharacterClick(char.id)}
              className={`character-card ${
                selectedCharacters.includes(char.id) ? "selected" : ""
              }`}
            >
              <img src={char.image} alt={char.name} />
              {(showNames || attemptsLeft === 0) && (
                <div className="show-name">{char.name}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>Correct Connections:</h3>
          {connectionsWithData.map((conn, index) => (
            <p key={index}>
              <strong>{conn.category}:</strong> {conn.value} -{" "}
              {conn.characters?.map((char) => `${char.name}`).join(", ")}
            </p>
          ))}
        </div>
      )}

      <div className="button-container">
        <button
          className="button"
          onClick={checkSelection}
          disabled={
            selectedCharacters.length !== 4 || shuffledCharacters.length === 0
          }
        >
          Submit
        </button>

        <button className="button" onClick={() => initializeBoard(true)}>
          Reset with New Board
        </button>

        <button className="button" onClick={() => setSelectedCharacters([])}>
          Reset Selection
        </button>
        <div className="info">
          Test your Naruto knowledge by finding hidden connections between
          characters! You'll see a grid of 16 characters, each belonging to a
          specific category such as clans, teams, affiliations, or abilities.
          Your goal is to group characters that share a common attribute. Select
          four characters that you think are connected, and if you're correct,
          they'll be locked in as a correct connection. Keep going until you
          find all the groups! You have three attempts to solve the puzzle—can
          you uncover all the connections?
        </div>
      </div>
    </div>
  );
};

export default RandomConnections;
