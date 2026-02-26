import React, { useState, useEffect } from "react";
import { fetchAllCharacters } from "../api";
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

const getCharactersForConnection = (
  connection: Connection,
  allCharacters: Record<string, any>[],
  selectedIds: Set<number>
) => {
  const scannedCharacters: { id: number; name: string; image: string }[] = [];

  const filteredCharacters = allCharacters.filter(
    (character: Record<string, any>) => {
      const attribute = connection.apiField
        .split(".")
        .reduce(
          (obj, key) => (obj ? (obj as Record<string, any>)[key] : undefined),
          character as Record<string, any> | undefined
        );

      if (Array.isArray(attribute)) {
        return attribute.some(
          (val: string) =>
            typeof val === "string" &&
            val.toLowerCase() === connection.value.toLowerCase()
        );
      }

      if (attribute == null) {
        return false;
      }

      // Fallback: coerce to string safely, then compare case-insensitively
      return String(attribute).toLowerCase() === connection.value.toLowerCase();
    }
  );

  scannedCharacters.push(
    ...filteredCharacters.map((character) => {
      const typedCharacter = character as Character;

      return {
        id: typedCharacter.id,
        name: typedCharacter.name,
        image: Array.isArray(typedCharacter.images)
          ? typedCharacter.images[0] || ""
          : "",
      };
    })
  );

  console.log(
    `Scanned characters for ${connection.category} - ${connection.value}:`,
    scannedCharacters
  );

  const shuffledCharacters = scannedCharacters.sort(() => Math.random() - 0.5);

  const selectedCharactersForConnection: {
    id: number;
    name: string;
    image: string;
  }[] = [];

  shuffledCharacters.forEach((character) => {
    if (
      !selectedIds.has(character.id) &&
      selectedCharactersForConnection.length < 4
    ) {
      selectedCharactersForConnection.push(character);
      selectedIds.add(character.id);
    }
  });

  return selectedCharactersForConnection;
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
  const [allCharacters, setAllCharacters] = useState<Record<string, any>[]>(
    []
  );
  const [isLoadingCharacters, setIsLoadingCharacters] =
    useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initial characters set:", initialCharacters);
  }, [initialCharacters]);

  useEffect(() => {
    const loadCharacters = async () => {
      setIsLoadingCharacters(true);
      setLoadError(null);

      const characters = await fetchAllCharacters();

      if (!characters.length) {
        setLoadError(
          "Unable to load character data. Please try again later."
        );
      }

      setAllCharacters(characters);
      setIsLoadingCharacters(false);
    };

    loadCharacters();
  }, []);

  const initializeBoard = (newBoard: boolean, allChars: Record<string, any>[]) => {
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

      const characters = getCharactersForConnection(
        connection,
        allChars,
        selectedIds
      );

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
    if (allCharacters.length > 0) {
      initializeBoard(true, allCharacters);
    }
  }, [allCharacters]);

  const handleCharacterClick = (id: number) => {
    setSelectedCharacters((prev) => {
      // If already selected, deselect it
      if (prev.includes(id)) {
        return prev.filter((charId) => charId !== id);
      }
      // If we have 4 selected, don't allow selecting another card
      if (prev.length >= 4) {
        return prev; // Return unchanged - user must deselect first
      }
      // Otherwise, add to selection
      return [...prev, id];
    });
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
      <div className="nc-header-row">
        <div className="nc-title-block">
          <h2>Naruto Connections</h2>
          <p className="nc-subtitle">
            Group Naruto characters by hidden traits, clans, teams, and more.
          </p>
        </div>
      </div>
      {isLoadingCharacters && (
        <p className="nc-loading-text">
          Summoning shinobi from the Dattebayo archives...
        </p>
      )}
      {loadError && <p className="nc-error-text">{loadError}</p>}
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
      {connectionsWithData.length === 0 && !isLoadingCharacters && (
        <div className="win">Congratulations! You found all connections!</div>
      )}
      {attemptsLeft === 0 && (
        <div className="lose">No attempts left! Reset to try again</div>
      )}
      <p>{resultMessage}</p>

      <div className="correct-answers">
        {correctConnections.map((conn, index) => (
          <div key={index} className="nc-connection-row">
            <div className="nc-connection-header">
              <span className="nc-connection-category">{conn.category}</span>
              <span className="nc-connection-value">{conn.value}</span>
            </div>
            <div className="nc-connection-characters">
              {conn.characters?.map((char) => char.name).join(", ")}
            </div>
          </div>
        ))}
      </div>

      {isLoadingCharacters ? (
        <div className="characters-grid nc-grid-skeleton">
          {Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="character-card nc-card-skeleton" />
          ))}
        </div>
      ) : shuffledCharacters.length > 0 ? (
        <div className="characters-grid">
          {shuffledCharacters.map((char) => {
            const isSelected = selectedCharacters.includes(char.id);
            const isDisabled = !isSelected && selectedCharacters.length >= 4;
            return (
              <div
                key={char.id}
                onClick={() => handleCharacterClick(char.id)}
                className={`character-card ${
                  isSelected ? "selected" : ""
                } ${isDisabled ? "disabled" : ""}`}
              >
                <div className="nc-card-highlight-ring" />
                <img src={char.image} alt={char.name} />
                {(showNames || attemptsLeft === 0) && (
                  <div className="show-name">{char.name}</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="correct-answers nc-endgame-summary">
          <h3>Remaining Connections</h3>
          {connectionsWithData.map((conn, index) => (
            <div key={index} className="nc-connection-row">
              <div className="nc-connection-header">
                <span className="nc-connection-category">{conn.category}</span>
                <span className="nc-connection-value">{conn.value}</span>
              </div>
              <div className="nc-connection-characters">
                {conn.characters?.map((char) => char.name).join(", ")}
              </div>
            </div>
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

        <button
          className="button"
          onClick={() =>
            allCharacters.length > 0 && initializeBoard(true, allCharacters)
          }
          disabled={
            isLoadingCharacters || allCharacters.length === 0
          }
        >
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
