import React, { createContext, useContext, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // Mock implementation for testing
  const players = [];
  const currentUser = { id: 1, name: 'Test Player' };
  const switchPlayer = () => {};
  const createProfile = () => {};
  const loading = false;

  return (
    <PlayerContext.Provider value={{ players, currentUser, switchPlayer, createProfile, loading }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
