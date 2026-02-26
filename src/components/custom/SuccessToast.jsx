import { useToast } from '@/hooks/use-toast';

/**
 * SuccessToast - Helper para mostrar toast de sucesso
 * Usa o hook useToast do Shadcn
 */
export const useSuccessToast = () => {
  const { toast } = useToast();

  const showSuccess = ({
    title = 'Sucesso!',
    description,
    duration = 3000,
  }) => {
    toast({
      title,
      description,
      duration,
      variant: 'default',
    });
  };

  const showError = ({
    title = 'Erro',
    description,
    duration = 5000,
  }) => {
    toast({
      title,
      description,
      duration,
      variant: 'destructive',
    });
  };

  return { showSuccess, showError };
};

export default useSuccessToast;
