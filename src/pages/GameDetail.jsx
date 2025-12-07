import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import useDocumentTitle from '../utils/useDocumentTitle';

// REVIEW: Part 2 - Commenting system implementation
const GameDetail = () => {
  // REVIEW: useParams() to get dynamic :id from URL
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ author: '', body: '' });
  const [commentErrors, setCommentErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      // REVIEW: GET requests for game and comments
      const [gameRes, commentsRes] = await Promise.all([
        fetch(`http://localhost:8000/games/${id}`),
        fetch(`http://localhost:8000/comments?gameId=${id}`),
      ]);

      const gameData = await gameRes.json();
      const commentsData = await commentsRes.json();

      setGame(gameData);
      // REVIEW: Comments sorted from most recent to oldest (requirement)
      setComments(commentsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load match details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useDocumentTitle(game ? `Match vs ${game.opponent}` : 'Match Details');

  const validateComment = () => {
    const errors = {};
    if (!newComment.author.trim()) errors.author = 'Name is required';
    if (!newComment.body.trim()) errors.body = 'Comment is required';
    setCommentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!validateComment()) return;

    try {
      // REVIEW: Comment contains author name, body, and timestamp (requirement)
      const commentData = {
        gameId: parseInt(id),
        author: newComment.author.trim(),
        body: newComment.body.trim(),
        timestamp: new Date().toISOString(),
      };

      // REVIEW: POST request - creates new comment
      const response = await fetch('http://localhost:8000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const savedComment = await response.json();
        // New comment added to front of array (most recent first)
        setComments([savedComment, ...comments]);
        setNewComment({ author: '', body: '' });
        toast.success('Comment added successfully!');
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
    if (commentErrors[name]) setCommentErrors({ ...commentErrors, [name]: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-slate-600 dark:text-slate-400">Match not found</p>
        <Link
          to="/games"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 mt-4 inline-block"
        >
          Back to Match History
        </Link>
      </div>
    );
  }

  const resultColors = {
    Win: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Draw: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Loss: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/games"
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium flex items-center gap-1"
        >
          <span>← Back to Match History</span>
        </Link>
      </div>

      {/* Match Hero Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden mb-8">
        <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                vs. {game.opponent}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-2">
                <span>{game.date}</span>
                <span>•</span>
                <span>{game.location}</span>
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-xl text-lg font-bold border ${resultColors[game.result]}`}
            >
              {game.result}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Minutes
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{game.duration}'</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Goals
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {game.goals}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Assists
              </p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {game.assists}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Passes
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{game.passes}</p>
            </div>
          </div>

          {game.notes && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Match Notes
              </h3>
              <p className="text-base text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                {game.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REVIEW: Part 2 - Comments Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h2>

        <form
          onSubmit={handleCommentSubmit}
          className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add a Comment</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="author"
                  className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newComment.author}
                  onChange={handleCommentChange}
                  className={`w-full px-4 py-2 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none ${commentErrors.author ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                  placeholder="Enter name"
                />
                {commentErrors.author && (
                  <p className="text-rose-500 text-xs mt-1">{commentErrors.author}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1"
              >
                Comment *
              </label>
              <textarea
                id="body"
                name="body"
                value={newComment.body}
                onChange={handleCommentChange}
                rows="3"
                className={`w-full px-4 py-2 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none ${commentErrors.body ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                placeholder="Match analysis..."
              />
              {commentErrors.body && (
                <p className="text-rose-500 text-xs mt-1">{commentErrors.body}</p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg text-sm font-medium"
            >
              Post Comment
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.length > 0 ? (
            // REVIEW: Each comment displays author name, body, and timestamp
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-slate-100 dark:border-slate-700 rounded-xl p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  {/* REVIEW: Commenter's name */}
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {comment.author}
                  </p>
                  {/* REVIEW: Timestamp formatted with date-fns */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {/* REVIEW: Comment body */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comment.body}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No comments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
