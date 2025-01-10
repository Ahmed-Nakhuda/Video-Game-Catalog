"use client";

import { useState, useEffect } from "react";
import { Button, Card, Image, Input, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";

export default function Home() {
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false); // Track loading state
  const [games, setGames] = useState([]); // Store the games
  const [query, setQuery] = useState(""); // Search query
  const [platform, setPlatform] = useState("all"); // Selected platform
  const [genre, setGenre] = useState("All"); // Selected genre


  /**
   * Fuction to fetch games from the API 
   * @param currentPage the current page number
   * @param selectedGenre the selected genre
   * @param selectedPlatform the selected platform
   */
  const fetchGames = async (currentPage, selectedGenre, selectedPlatform) => {
    setLoading(true);
    try {
      let url = `https://api.rawg.io/api/games?key=5cd0c7ac120243af92de436eb06c6ccc&page=${currentPage}`;

      // Build the url based on selected genre and platform
      if (selectedGenre && selectedGenre !== "All") {
        url += `&genres=${encodeURIComponent(selectedGenre.toLowerCase())}`;
      }

      if (selectedGenre === "RPG") {
        url += `&genres=role-playing-games-rpg`;
      }

      if (selectedPlatform && selectedPlatform !== "all") {
        url += `&platforms=${encodeURIComponent(selectedPlatform)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Append new games to the existing list
      setGames((prevGames) => [...prevGames, ...data.results]);

    } catch (error) {
      console.error("Error fetching games", error);
    } finally {
      setLoading(false);
    }
  };


  // Function to handle search functionality
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    // Fetch games based on the search query
    try {
      let url = `https://api.rawg.io/api/games?key=5cd0c7ac120243af92de436eb06c6ccc&search=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setGames(data.results); // Replace games with search results
      setPage(1); // Reset the page

    } catch (error) {
      console.error("Error searching games", error);
    } finally {
      setLoading(false);
    }
  };


  // Fetch games when the page loads or when the page, genre, or platform changes
  useEffect(() => {
    fetchGames(page, genre, platform);
  }, [page, genre, platform]);


  // Function to handle genre change
  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
    setPage(1);
    setGames([]); // Clear previous games
  };

  // Function to handle platform change
  const handlePlatformChange = (e) => {
    const selectedPlatform = e.target.value;
    setPlatform(selectedPlatform);
    setPage(1);
    setGames([]); // Clear previous games
  };


// Function to handle infinite scrolling
const handleScroll = () => {
  // If the user has scrolled close to the bottom of the page and there are no games being loaded
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading 
  ) {
    // Increment the page number to load the next set of games
    setPage((prevPage) => prevPage + 1);
  }
};


// Add event listener to the window on component mount and remove it on unmount
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  // Map platform IDs to platform names
  const platformMap = {
    4: "PC",
    18: "PlayStation",
    1: "Xbox",
    7: "Nintendo",
    3: "iOS",
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src="/logo/joystick.png"
            alt="Game Logo"
            className="w-10 h-10 mr-10"
          />
        </div>

        
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search games..."
            className="rounded-lg border p-2"
          />
          <Button
            onClick={handleSearch}
            className="rounded-lg flex items-center"
          >
            <LuSearch />
          </Button>
        </div>
      </div>


      <div className="flex">
        <div className="w-3/10 mr-10">
          <h2 className="text-2xl font-bold mb-4 mt-2">Genres</h2>
          <VStack spacing={4} align="stretch" className="flex flex-col gap-2">
            {[
              "All",
              "Adventure",
              "Action",
              "RPG",
              "Indie",
              "Sports",
              "Racing",
              "Puzzle",
              "Strategy",
              "Shooter",
              "Casual",
              "Simulation",
              "Arcade",
              "Fighting",
              "Platformer",
              "Family",
            ].map((genre) => (
              <Text
                key={genre}
                className="cursor-pointer hover:underline"
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </Text>
            ))}
          </VStack>
        </div>


        <div>
          <Text className="text-5xl font-bold mb-4">
            {genre !== "All" && platform !== "all"
              ? `${platformMap[platform]} ${genre} Games`
              : genre !== "All"
                ? `${genre} Games`
                : platform !== "all"
                  ? `${platformMap[platform]} Games`
                  : "Games"}
          </Text>


          <select
            id="platform-select"
            value={platform}
            onChange={handlePlatformChange}
            className="rounded-lg border p-2 mb-4 mt-4"
          >
            <option value="all">All Platforms</option>
            <option value="4">PC</option>
            <option value="18">PlayStation</option>
            <option value="1">Xbox</option>
            <option value="7">Nintendo</option>
            <option value="3">iOS</option>
          </select>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading && <p>Loading...</p>}
            {games.map((game, index) => (
              <Link href={`/games/${game.id}`} key={`${game.id}-${index}`}>
                <div>
                  <Card.Root
                    maxWidth="sm"
                    overflow="hidden"
                    className="bg-stone-700 pb-10 rounded-lg"
                  >
                    <Image
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-40 object-cover mb-4 rounded-lg"
                    />
                    <Card.Title className="ml-3 text-lg font-semibold text-black">
                      {game.name}
                    </Card.Title>
                    <div className="flex">
                      {game.parent_platforms.map((parentPlatform, index) => {
                        const platformId = parentPlatform.platform.id;

                        // Check for PC
                        if (platformId === 1) {
                          return (
                            <Image
                              src="platforms/pc.png"
                              alt="PC"
                              key={`${platformId}-${index}`}
                              className="ml-3 mr-2 w-5"
                            />
                          );
                        }

                        // Check for PlayStation
                        if (platformId === 2) {
                          return (
                            <Image
                              src="platforms/playstation.png"
                              alt="PlayStation"
                              key={`${platformId}-${index}`}
                              className="ml-3 mr-2 w-5"
                            />
                          );
                        }

                        // Check for Xbox
                        if (platformId === 3) {
                          return (
                            <Image
                              src="platforms/xbox.png"
                              alt="Xbox"
                              key={`${platformId}-${index}`}
                              className="ml-3 w-5"
                            />
                          );
                        }

                        // Check for iOS
                        if (platformId === 4) {
                          return (
                            <Image
                              src="platforms/ios.png"
                              alt="IOS"
                              key={`${platformId}-${index}`}
                              className="ml-3 w-5"
                            />
                          );
                        }

                        // Check for Nintendo
                        if (platformId === 7) {
                          return (
                            <Image
                              src="platforms/nintendo.png"
                              alt="nintendo"
                              key={`${platformId}-${index}`}
                              className="ml-3 w-5"
                            />
                          );
                        }
                        // Return null for other parent platforms
                        return null;
                      })}
                    </div>
                  </Card.Root>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
