import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/custom/LoadingButton';
import ErrorAlert from '@/components/custom/ErrorAlert';
import { FaEnvelope, FaLock, FaRocket, FaArrowRight, FaShieldAlt, FaChartLine, FaUsers, FaSync, FaComments, FaBrain, FaWhatsapp, FaBook, FaPlug, FaCreditCard, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginNew = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';

    if (wasRemembered && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);

      // Carregar senha também se estava salva
      if (savedPassword) {
        setPassword(atob(savedPassword)); // Decodifica base64
      }
    }
  }, []);

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
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      // Salvar ou limpar dados baseado em "Manter conectado"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', btoa(password)); // Codifica em base64
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }

      // Navegação será feita automaticamente pelo MainLayout quando isAuthenticated mudar
      // Mas podemos forçar navegação imediata para melhor UX
      const lastPage = localStorage.getItem('lastPage') || 'dashboard';

      // Usar onNavigate se fornecido (para testes), caso contrário usar navigate do router
      if (onNavigate) {
        onNavigate(lastPage);
      } else {
        navigate(`/${lastPage}`, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaRocket className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Plataforma CRM</h1>
              <p className="text-purple-200 text-sm">Gestão Inteligente</p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            A plataforma
            <br />
            completa para
            <br />
            <span className="text-yellow-300">seu negócio digital</span>
          </h2>

          <p className="text-xl text-purple-100 mb-10 leading-relaxed">
            CRM inteligente, integrações com plataformas de pagamento, automação com IA,
            gestão de equipe e muito mais — tudo em um só lugar.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/50 flex items-center justify-center shrink-0">
                <FaCreditCard className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Integrações</p>
                <p className="text-xs text-purple-200 truncate">Kiwify, Hotmart, Stripe</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/50 flex items-center justify-center shrink-0">
                <FaChartLine className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">CRM Visual</p>
                <p className="text-xs text-purple-200 truncate">Pipeline drag & drop</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/50 flex items-center justify-center shrink-0">
                <FaWhatsapp className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Multi-canal</p>
                <p className="text-xs text-purple-200 truncate">WhatsApp, Instagram</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/50 flex items-center justify-center shrink-0">
                <FaBrain className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">IA Integrada</p>
                <p className="text-xs text-purple-200 truncate">Automação inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/50 flex items-center justify-center shrink-0">
                <FaComments className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Inbox Unificado</p>
                <p className="text-xs text-purple-200 truncate">Todas conversas</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/50 flex items-center justify-center shrink-0">
                <FaUsers className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Equipe</p>
                <p className="text-xs text-purple-200 truncate">Gestão completa</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/50 flex items-center justify-center shrink-0">
                <FaBook className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Base de Conhecimento</p>
                <p className="text-xs text-purple-200 truncate">FAQ integrado</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/50 flex items-center justify-center shrink-0">
                <FaShieldAlt className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">100% Seguro</p>
                <p className="text-xs text-purple-200 truncate">Dados protegidos</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-yellow-300">99.9%</p>
                <p className="text-xs text-purple-200 mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-300">24/7</p>
                <p className="text-xs text-purple-200 mt-1">Suporte</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-300">∞</p>
                <p className="text-xs text-purple-200 mt-1">Escalável</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Header Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
              <FaRocket className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plataforma CRM</h1>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Bem-vindo de volta! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Acesse sua conta e continue gerenciando seu negócio digital
            </p>
          </div>

          {/* Quick Info Pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
              <FaSync className="w-3 h-3" />
              Sincronização em tempo real
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
              <FaShieldAlt className="w-3 h-3" />
              Dados criptografados
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Senha
                </Label>
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 [&:-webkit-autofill]:bg-gray-50 [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(249,250,251)_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(31,41,55)_inset]"
                  autoComplete="current-password"
                  style={{
                    WebkitBoxShadow: '0 0 0 1000px rgb(249, 250, 251) inset',
                    WebkitTextFillColor: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Manter conectado
              </label>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all"
              loading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
              <FaArrowRight className="ml-2" />
            </LoadingButton>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                Novo por aqui?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('register');
                } else {
                  navigate('/register');
                }
              }}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-all hover:gap-3"
            >
              Criar uma conta gratuita
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0">
                <FaRocket className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Plataforma completa para infoprodutores
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Integre suas vendas da Kiwify e Hotmart, gerencie clientes, automatize conversas e acompanhe métricas em tempo real.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="underline hover:text-purple-600">Termos</a>
            {' '}e{' '}
            <a href="#" className="underline hover:text-purple-600">Política de Privacidade</a>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginNew;
