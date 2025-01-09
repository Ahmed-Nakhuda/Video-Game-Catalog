"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HStack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";


const GameDetails = () => {
  const { id } = useParams(); // Access the dynamic route parameter
  const [game, setGame] = useState(null); // State for the game details
  const [screenshots, setScreenshots] = useState([]); // State for screenshots
  const [loading, setLoading] = useState(true); // Loading state
  const [trailer, setTrailer] = useState(null); // State for the trailer URL

  useEffect(() => {
    if (id) {
      const fetchGameDetails = async () => {
        try {
          // Fetch game details
          const response = await fetch(`https://api.rawg.io/api/games/${id}?key=f4786ea3a2664b0c882c52954b1c6307`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setGame(data);


          // Fetch screenshots for the game
          const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=f4786ea3a2664b0c882c52954b1c6307`);
          if (!screenshotsResponse.ok) {
            throw new Error(`HTTP error! Status: ${screenshotsResponse.status}`);
          }
          const screenshotsData = await screenshotsResponse.json();
          setScreenshots(screenshotsData.results); 


          // Fetch trailer for the game
          const trailerResponse = await fetch(`https://api.rawg.io/api/games/${id}/movies?key=f4786ea3a2664b0c882c52954b1c6307`);
          if (!trailerResponse.ok) {
            throw new Error(`HTTP error! Status: ${trailerResponse.status}`);
          }
          const trailerData = await trailerResponse.json();
          setTrailer(trailerData.results.length > 0 ? trailerData.results[0].data.max : null); // Store the trailer URL
         
        } catch (error) {
          console.error("Error fetching game details or screenshots", error);
        } finally {
          setLoading(false);
        }
      };
      fetchGameDetails();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!game) {
    return <p>Game not found.</p>;
  }

  return (
    <div>
      {/* Hero Section with background image */}
      <div
        className="relative w-full min-h-[100vh] bg-cover bg-center mb-6"
        style={{ backgroundImage: `url(${game.background_image})`, backgroundSize: "contain", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Optional overlay */}
        <div className="relative z-10 p-6">
          <h1 className="text-4xl font-bold text-white">{game.name}</h1>
        </div>
      </div>


      {/* About */}
      <div className="ml-2 mr-2 mb-2">
        <Text className="text-2xl font-semibold text-white mb-3">About</Text>
        <Text className="text-lg text-white">{game.description_raw}</Text>


        {/* Platforms */}
        <div className="mt-6 mr-5">
          <h2 className="text-xl font-semibold text-white mb-3">Platforms</h2>
          <HStack>
            <Text className="text-md text-white">
              {game.platforms.map((platform, index) => (
                `${platform.platform.name}${index < game.platforms.length - 1 ? ', ' : ''}`
              ))}
            </Text>
          </HStack>
        </div>


        {/* Genres */}
        <div className="mt-6 mr-5">
          <h2 className="text-xl font-semibold text-white mb-3">Genres</h2>
          <HStack>
            <Text className="text-md text-white">
              {game.genres.map((genre, index) => (
                `${genre.name}${index < game.genres.length - 1 ? ', ' : ''}`
              ))}
            </Text>
          </HStack>
        </div>


        {/* Release Date and Developers */}
        <HStack>
          <HStack>
            <div className="mt-6 mr-5">
              <h2 className="text-xl font-semibold text-white mb-3">Release Date</h2>
              <Text className="text-md text-white">{game.released}</Text>
            </div>
          </HStack>

          <div className="mt-6 mr-10">
            <h2 className="text-xl font-semibold text-white mb-3">Developers</h2>
            <HStack>
              {game.developers.map((developer, index) => (
                <Text key={developer.id} className="text-md text-white">
                  {developer.name}
                  {index < game.developers.length - 1 && ','}
                </Text>
              ))}
            </HStack>
          </div>
        </HStack>


        {/* ESRB Rating and Metacritic Rating */}
        <HStack>
          <HStack>
            <HStack>
              <div className="mt-6 mr-5">
                <h2 className="text-xl font-semibold text-white mb-3">ESRB Rating</h2>
                {game.esrb_rating?.name || "No ESRB Rating"}
              </div>
            </HStack>
          </HStack>

          <HStack>
            <HStack>
              <div className="mt-6 mr-5">
                <h2 className="text-xl font-semibold text-white mb-3">Rating</h2>
                <Text className="text-md text-white">{game.metacritic}</Text>
              </div>
            </HStack>
          </HStack>
        </HStack>


        {/* Trailer */}
        {trailer && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-3">Trailer</h2>
            <ReactPlayer
              url={trailer} // MP4 URL
              className="w-full h-72 rounded-lg"
              controls
              playing={false}
              width="100%" 
              height="auto"
            />
          </div>
        )}


        {/* Screenshots */}
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((screenshot) => (
              <HStack key={screenshot.id}>
                <img
                  key={screenshot.id}
                  src={screenshot.image}
                  alt={`Screenshot of ${game.name}`}
                  className="w-full h-72 object-cover rounded-lg shadow-md transition-all"
                />
              </HStack>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
