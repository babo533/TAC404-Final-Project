import { useEffect } from 'react';

// REVIEW: Document title hook - sets unique title for each page
// Used in: Dashboard, GamesList, GameDetail, CreateGame, EditGame, Goals, Statistics
const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    // REVIEW: Title format: "{Page Title} - Soccer Training Logger"
    document.title = `${title} - Soccer Training Logger`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
