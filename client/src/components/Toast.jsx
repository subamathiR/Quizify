import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast, showToast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-900'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          fontSize: '0.95rem',
          fontWeight: 600
        }}
        className={bgStyles[toast.type] || bgStyles.info}
      >
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
        <button onClick={() => showToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
