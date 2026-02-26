import React, { useEffect, useState } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { useAppContext } from '../contexts/AppContext';

const SaveNotification = () => {
  const { savingStatus } = useAppContext();
  const [show, setShow] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (savingStatus) {
      setCurrentStatus(savingStatus);
      setShow(true);

      // Se estiver "saved", esconder automaticamente após 2 segundos
      if (savingStatus === 'saved') {
        const timer = setTimeout(() => {
          setShow(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [savingStatus]);

  if (!show || !currentStatus) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      {currentStatus === 'saving' && (
        <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 animate-fade-in backdrop-blur-sm">
          <FaSpinner className="text-purple-500 animate-spin text-lg" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Salvando...</p>
          </div>
        </div>
      )}

      {currentStatus === 'saved' && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FaCheck className="text-white text-sm" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Salvo com sucesso!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveNotification;
