import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// REVIEW: Nested routes - Layout is parent, Outlet renders child routes
const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navigation />
      {/* REVIEW: Outlet renders the nested child route components */}
      <Outlet />
      {/* REVIEW: React Toastify - displays notifications for user actions */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Layout;
