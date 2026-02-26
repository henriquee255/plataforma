import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/custom/FormInput';
import LoadingButton from '@/components/custom/LoadingButton';
import ErrorAlert from '@/components/custom/ErrorAlert';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const Login = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos corretamente');
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      toast.error('Dados inválidos! Verifique seu email ou senha');
    } else {
      toast.success('Bem-vindo! Login realizado com sucesso');
      // Redirecionar para dashboard
      setTimeout(() => {
        onNavigate && onNavigate('dashboard');
      }, 500); // Pequeno delay para mostrar o toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-900 dark:to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center">
              <FaUser className="text-2xl" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError('')}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<FaEnvelope />}
              required
              autoComplete="email"
            />

            <FormInput
              label="Senha"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<FaLock />}
              required
              autoComplete="current-password"
            />

            <LoadingButton
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              loading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </LoadingButton>

            {/* Botão de preenchimento automático para debug */}
            <button
              type="button"
              onClick={() => {
                setEmail('eu.henriquee2501@gmail.com');
                setPassword('admin@2026');
              }}
              className="w-full mt-2 py-2 px-4 border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-sm font-medium"
            >
              🔧 Preencher dados do Admin (Debug)
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>

          {/* Link para voltar */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Voltar ao início
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
