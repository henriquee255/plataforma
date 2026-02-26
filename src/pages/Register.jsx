import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/custom/FormInput';
import LoadingButton from '@/components/custom/LoadingButton';
import ErrorAlert from '@/components/custom/ErrorAlert';
import { useSuccessToast } from '@/components/custom/SuccessToast';
import { FaEnvelope, FaLock, FaUser, FaCheckCircle } from 'react-icons/fa';

const Register = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();
  const { showSuccess } = useSuccessToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter no mínimo 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message);
    } else {
      showSuccess({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à Plataforma CRM',
      });

      // Redirecionar para página de assinatura após 1 segundo
      setTimeout(() => {
        onNavigate && onNavigate('subscription');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-900 dark:to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar sua conta</CardTitle>
          <CardDescription>
            Preencha os dados para começar a usar a Plataforma CRM
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
              label="Nome completo"
              type="text"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              icon={<FaUser />}
              required
              autoComplete="name"
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              icon={<FaEnvelope />}
              required
              autoComplete="email"
            />

            <FormInput
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              icon={<FaLock />}
              required
              autoComplete="new-password"
              helperText="Deve ter no mínimo 8 caracteres"
            />

            <FormInput
              label="Confirmar senha"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              icon={<FaLock />}
              required
              autoComplete="new-password"
            />

            <LoadingButton
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              loading={isLoading}
              loadingText="Criando conta..."
            >
              Criar conta
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline"
              >
                Fazer login
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

export default Register;
