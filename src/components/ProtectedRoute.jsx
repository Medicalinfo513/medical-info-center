import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-slate-500 font-bold text-sm animate-pulse text-center">Verifying access...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but keep the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: check for admin role
  if (requireAdmin && user.email !== 'raaj.2015@yahoo.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
