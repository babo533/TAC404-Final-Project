import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GameForm from '../components/GameForm';
import useDocumentTitle from '../utils/useDocumentTitle';
import { usePlayer } from '../context/PlayerContext';

const CreateGame = () => {
  useDocumentTitle('Log New Match');
  const navigate = useNavigate();
  const { currentUser } = usePlayer();

  const handleSubmit = async (formData) => {
    if (!currentUser) {
      toast.error('No user profile selected');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          playerId: currentUser.id, // Associate with current user
        }),
      });

      if (response.ok) {
        toast.success('Match logged successfully!');
        navigate('/games');
      } else {
        toast.error('Failed to log match');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to log match');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Log Match</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Record your latest game details.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 p-8">
        <GameForm onSubmit={handleSubmit} submitButtonText="Log Match" />
      </div>
    </div>
  );
};

export default CreateGame;
