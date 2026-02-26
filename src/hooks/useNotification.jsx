import { useToast } from '@/hooks/use-toast';
import { FaCheck, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

/**
 * Hook para notificações bonitas e consistentes
 * Usa o sistema de Toast do Shadcn UI
 */
export const useNotification = () => {
  const { toast } = useToast();

  /**
   * Notificação de sucesso ao salvar
   */
  const notifySaved = (message = 'Alterações salvas com sucesso!') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <FaCheck className="text-white text-xs" />
          </div>
          <span>Salvo!</span>
        </div>
      ),
      description: message,
      duration: 2000,
    });
  };

  /**
   * Notificação de sucesso ao adicionar
   */
  const notifyAdded = (message = 'Item adicionado com sucesso!') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
            <FaPlus className="text-white text-xs" />
          </div>
          <span>Adicionado!</span>
        </div>
      ),
      description: message,
      duration: 2000,
    });
  };

  /**
   * Notificação de sucesso ao editar
   */
  const notifyUpdated = (message = 'Item atualizado com sucesso!') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <FaEdit className="text-white text-xs" />
          </div>
          <span>Atualizado!</span>
        </div>
      ),
      description: message,
      duration: 2000,
    });
  };

  /**
   * Notificação de sucesso ao deletar
   */
  const notifyDeleted = (message = 'Item removido com sucesso!') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <FaTrash className="text-white text-xs" />
          </div>
          <span>Removido!</span>
        </div>
      ),
      description: message,
      duration: 2000,
    });
  };

  /**
   * Notificação de erro
   */
  const notifyError = (message = 'Ocorreu um erro. Tente novamente.') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          <span>Erro</span>
        </div>
      ),
      description: message,
      variant: 'destructive',
      duration: 4000,
    });
  };

  /**
   * Notificação de aviso
   */
  const notifyWarning = (message) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-500" />
          <span>Atenção</span>
        </div>
      ),
      description: message,
      duration: 3000,
    });
  };

  /**
   * Notificação de informação
   */
  const notifyInfo = (message) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" />
          <span>Informação</span>
        </div>
      ),
      description: message,
      duration: 3000,
    });
  };

  /**
   * Notificação genérica de sucesso
   */
  const notifySuccess = (message) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <FaCheck className="text-white text-xs" />
          </div>
          <span>Sucesso!</span>
        </div>
      ),
      description: message,
      duration: 2000,
    });
  };

  return {
    notifySaved,
    notifyAdded,
    notifyUpdated,
    notifyDeleted,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifySuccess,
    toast, // Toast bruto para casos customizados
  };
};

export default useNotification;
