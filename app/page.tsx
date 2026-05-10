"use client";
import React, { useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const handleSearch = () => {
    // Logika untuk fetch ke YT Music API akan ditempatkan di sini
    console.log("Mencari lagu: " + searchQuery);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] text-white">
      <header className="flex items-center justify-center border-b border-gray-800 p-5">
        <h1 className="text-2xl font-bold">NexusZeon</h1>
      </header>

      <div className="flex w-full p-4">
        <input
          type="text"
          placeholder="Cari lagu di YT Music..."
          className="flex-1 rounded-lg bg-[#222] px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-3 rounded-lg bg-[#1DB954] px-5 py-2 font-bold text-white hover:bg-[#1ed760]"
        >
          Cari
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4">
        {songs.length === 0 ? (
          <p className="text-gray-400">Mulai cari lagu favoritmu!</p>
        ) : (
          <ul className="w-full">
            {songs.map((song, index) => (
              <li key={index} className="border-b border-gray-800 p-4">
                {song.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
