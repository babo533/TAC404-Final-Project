import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GameForm from '../components/GameForm';
import useDocumentTitle from '../utils/useDocumentTitle';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // REVIEW: GET request - fetches single game by ID (URL parameter)
        const response = await fetch(`http://localhost:8000/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          toast.error('Match not found');
          navigate('/games');
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        toast.error('Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate]);

  // REVIEW: Dynamic document title with contextual data (opponent name)
  useDocumentTitle(game ? `Edit Match vs ${game.opponent}` : 'Edit Match');

  const handleSubmit = async (formData) => {
    try {
      // REVIEW: PATCH request - updates existing game
      const response = await fetch(`http://localhost:8000/games/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // REVIEW: Toast notification for successful update
        toast.success('Match updated successfully!');
        navigate('/games');
      } else {
        toast.error('Failed to update match');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update match');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Match</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Update match details.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 p-8">
        <GameForm initialData={game} onSubmit={handleSubmit} submitButtonText="Update Match" />
      </div>
    </div>
  );
};

export default EditGame;
