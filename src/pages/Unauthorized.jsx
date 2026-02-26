import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaExclamationTriangle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const Unauthorized = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-red-200 dark:border-red-900">
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-6">
            {/* Ícone */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center animate-pulse">
                  <FaShieldAlt className="text-4xl text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <FaExclamationTriangle className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Título */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                403
              </h1>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                Acesso Negado
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Você não tem permissão para acessar esta página.
              </p>
            </div>

            {/* Mensagem detalhada */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Por quê?</strong> Esta área é restrita apenas para administradores do sistema.
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <FaArrowLeft className="mr-2" />
                Voltar ao Dashboard
              </Button>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                Voltar à página anterior
              </Button>
            </div>

            {/* Informação adicional */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
