import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const ToastItem = ({ toast, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const icons = {
    success: <FaCheckCircle className="w-5 h-5" />,
    error: <FaExclamationCircle className="w-5 h-5" />,
    warning: <FaExclamationTriangle className="w-5 h-5" />,
    info: <FaInfoCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-emerald-500 dark:bg-emerald-600',
    error: 'bg-red-500 dark:bg-red-600',
    warning: 'bg-amber-500 dark:bg-amber-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  };

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  useEffect(() => {
    // Auto-close se duration > 0
    if (toast.duration > 0) {
      const timer = setTimeout(handleClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  return (
    <div
      className={`flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-xl shadow-xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ${
        isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${colors[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="text-white flex-shrink-0">
        {icons[toast.type]}
      </div>

      <div className="flex-1 text-white">
        <p className="text-sm font-semibold leading-snug">
          {toast.message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
