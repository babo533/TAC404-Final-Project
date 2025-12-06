import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('http://localhost:8000/players');
      const data = await response.json();
      setPlayers(data);

      // Default to the first player if none selected
      // Or load from localStorage if you want persistence across reloads
      const savedPlayerId = localStorage.getItem('activePlayerId');
      if (savedPlayerId) {
        const found = data.find((p) => p.id === parseInt(savedPlayerId));
        setCurrentUser(found || data[0]);
      } else {
        setCurrentUser(data[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load player profiles');
      setLoading(false);
    }
  };

  const switchPlayer = (playerId) => {
    const player = players.find((p) => p.id === parseInt(playerId));
    if (player) {
      setCurrentUser(player);
      localStorage.setItem('activePlayerId', player.id);
      toast.info(`Switched profile to ${player.name}`);
    }
  };

  const createProfile = async (name, position) => {
    try {
      const newPlayer = {
        name,
        position,
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const response = await fetch('http://localhost:8000/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      });

      if (response.ok) {
        const savedPlayer = await response.json();
        setPlayers([...players, savedPlayer]);
        switchPlayer(savedPlayer.id);
        toast.success(`Profile created for ${savedPlayer.name}!`);
        return true;
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return false;
    }
  };

  return (
    <PlayerContext.Provider value={{ players, currentUser, switchPlayer, createProfile, loading }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
