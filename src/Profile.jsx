import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaShieldAlt, FaBell, FaEnvelope, FaPhone, FaBriefcase, FaBuilding, FaCrown, FaCamera, FaStar, FaCheck, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';

const Profile = () => {
  const { userData, updateUser } = useAppContext();
  const fileRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [secLoading, setSecLoading] = useState(false);
  const [secMsg, setSecMsg] = useState(null);

  // Carregar dados do usuário do contexto
  useEffect(() => {
    if (userData) {
      setProfileData({
        full_name: userData.name || '',
        email: userData.email || '',
        phone: userData.telefone || ''
      });
    }
  }, [userData]);
  const [notif, setNotif] = useState({
    newConversation: true,
    unreadMessage: true,
    sounds: true,
    email: false
  });
  const [notifSaved, setNotifSaved] = useState(false);

  const TABS = [
    { id: 'profile', label: 'Meu Perfil', icon: FaUser },
    { id: 'security', label: 'Segurança', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notificações', icon: FaBell },
  ];

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const newAvatar = ev.target?.result;
      setAvatarPreview(newAvatar);
      // Salvar avatar no contexto
      updateUser({ avatar: newAvatar });
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    // Salvar no contexto
    setTimeout(() => {
      updateUser({
        name: profileData.full_name,
        email: profileData.email,
        telefone: profileData.phone
      });

      setProfileLoading(false);
      setProfileMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setProfileMsg(null), 3000);
    }, 500);
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    // Verificar senha atual
    if (passwords.current !== userData.password) {
      setSecMsg({ type: 'error', text: 'Senha atual incorreta.' });
      setTimeout(() => setSecMsg(null), 3000);
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setSecMsg({ type: 'error', text: 'As senhas não coincidem.' });
      setTimeout(() => setSecMsg(null), 3000);
      return;
    }

    if (passwords.new.length < 6) {
      setSecMsg({ type: 'error', text: 'A nova senha deve ter ao menos 6 caracteres.' });
      setTimeout(() => setSecMsg(null), 3000);
      return;
    }

    setSecLoading(true);
    setSecMsg(null);

    // Salvar nova senha no contexto
    setTimeout(() => {
      updateUser({ password: passwords.new });
      setPasswords({ current: '', new: '', confirm: '' });
      setSecLoading(false);
      setSecMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
      setTimeout(() => setSecMsg(null), 4000);
    }, 500);
  }

  function handleSaveNotifications() {
    localStorage.setItem('notif-prefs', JSON.stringify(notif));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2500);
  }

  const Feedback = ({ msg }) => {
    if (!msg) return null;
    return (
      <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl ${
        msg.type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      }`}>
        {msg.type === 'success' ? <FaCheck /> : <FaExclamationCircle />}
        {msg.text}
      </div>
    );
  };

  const Toggle = ({ checked, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          checked ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950 p-3 md:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-4">

        {/* Header com gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-900 dark:to-purple-950 rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-white/20 shadow-lg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : userData.avatar ? (
                  <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userData.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform"
              >
                <FaCamera className="text-xs" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{userData.name || 'Usuário'}</h1>
                <FaStar className="text-yellow-300 text-sm" />
              </div>
              <p className="text-purple-100 dark:text-purple-200 text-xs mb-2">{userData.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {userData.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    Administrador
                  </span>
                )}
                {userData.cargo && (
                  <span className="px-2 py-0.5 bg-purple-500/30 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-purple-300/30">
                    {userData.cargo}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card de Informações Organizacionais */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-layered)' }}>
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-3">
              Informações da Organização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-800/30">
                <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FaBuilding className="text-sm text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Empresa</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{userData.empresa || 'Não informado'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-800/30">
                <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FaBriefcase className="text-sm text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Cargo</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{userData.cargo || 'Não informado'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-800/30">
                <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FaCrown className="text-sm text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Plano</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-1.5 shadow-lg border-2 border-gray-200 dark:border-gray-800" style={{ boxShadow: 'var(--shadow-layered)' }}>
          <div className="grid grid-cols-3 gap-1.5">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col md:flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB: Meu Perfil */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-layered)' }}>
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:to-purple-800/20 px-4 py-3 border-b-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaUser className="text-sm text-purple-600 dark:text-purple-400" />
                Informações Pessoais
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Nome completo
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.full_name}
                    onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Email
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="email"
                      required
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Telefone <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+55 11 99999-9999"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                <div className="flex-1">
                  <Feedback msg={profileMsg} />
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileLoading ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: Segurança */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-layered)' }}>
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaLock className="text-purple-600 dark:text-purple-400" />
                Alterar Senha
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Senha atual</label>
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nova senha</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirmar nova senha</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
                <div className="flex-1">
                  <Feedback msg={secMsg} />
                </div>
                <button
                  type="submit"
                  disabled={secLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {secLoading ? 'Alterando...' : 'Alterar senha'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: Notificações */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-layered)' }}>
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaBell className="text-blue-600 dark:text-blue-400" />
                Preferências de Notificações
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Nova conversa</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Receber notificação de novas conversas</p>
                  </div>
                  <Toggle checked={notif.newConversation} onChange={(v) => setNotif({ ...notif, newConversation: v })} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Mensagens não lidas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Notificar sobre mensagens não respondidas</p>
                  </div>
                  <Toggle checked={notif.unreadMessage} onChange={(v) => setNotif({ ...notif, unreadMessage: v })} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Sons de notificação</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reproduzir sons ao receber mensagens</p>
                  </div>
                  <Toggle checked={notif.sounds} onChange={(v) => setNotif({ ...notif, sounds: v })} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Notificações por email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Receber resumo diário por email</p>
                  </div>
                  <Toggle checked={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
                {notifSaved && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <FaCheck />
                    Preferências salvas!
                  </div>
                )}
                <button
                  onClick={handleSaveNotifications}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Salvar preferências
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
