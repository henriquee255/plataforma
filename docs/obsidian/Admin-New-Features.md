# ⚙️ Novas Funcionalidades - Configurações da Plataforma

> **Sprint:** 1-2
> **Prioridade:** Alta
> **Task:** #5 - Implementar Configurações Avançadas da Plataforma

---

## 📋 Funcionalidades Solicitadas

### 1. 🎨 Branding e Identidade Visual

#### 1.1 Troca de Logo
**Componente:** `SettingsTab/BrandingSettings.jsx`

```javascript
<div className="space-y-4">
  <h3>Logo da Plataforma</h3>

  {/* Upload de Logo */}
  <div className="flex items-center gap-4">
    <div className="w-24 h-24 border rounded-lg flex items-center justify-center">
      {platformLogo ? (
        <img src={platformLogo} alt="Logo" className="max-w-full max-h-full" />
      ) : (
        <FaImage className="text-4xl text-gray-400" />
      )}
    </div>

    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
        ref={logoInputRef}
      />
      <button onClick={() => logoInputRef.current.click()}>
        Fazer Upload
      </button>
      {platformLogo && (
        <button onClick={handleRemoveLogo} className="text-red-600">
          Remover Logo
        </button>
      )}
    </div>
  </div>

  {/* Preview em Tempo Real */}
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <p className="text-sm text-gray-600 mb-2">Preview:</p>
    <div className="flex items-center gap-3">
      {platformLogo && (
        <img src={platformLogo} alt="Preview" className="h-8" />
      )}
      <span className="font-semibold">{platformName}</span>
    </div>
  </div>
</div>
```

**Validações:**
- Formato: PNG, JPG, SVG
- Tamanho máximo: 2MB
- Dimensões recomendadas: 200x200px
- Aspect ratio: 1:1 ou 16:9

#### 1.2 Nome da Plataforma
```javascript
<div className="space-y-2">
  <label>Nome da Plataforma</label>
  <input
    type="text"
    value={platformName}
    onChange={(e) => setPlatformName(e.target.value)}
    placeholder="Plataforma"
    maxLength={50}
  />
  <p className="text-sm text-gray-500">
    Este nome aparecerá na barra de título, emails e notificações
  </p>
</div>
```

#### 1.3 Favicon Customizado
```javascript
<div className="space-y-4">
  <h3>Favicon</h3>

  {/* Upload de Favicon */}
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 border rounded flex items-center justify-center bg-white">
      {favicon ? (
        <img src={favicon} alt="Favicon" className="w-8 h-8" />
      ) : (
        <FaGlobe className="text-2xl text-gray-400" />
      )}
    </div>

    <div>
      <input
        type="file"
        accept=".ico,.png"
        onChange={handleFaviconUpload}
        ref={faviconInputRef}
      />
      <button onClick={() => faviconInputRef.current.click()}>
        Upload Favicon
      </button>
    </div>
  </div>

  <div className="text-sm text-gray-500">
    <p>Formatos aceitos: .ico, .png</p>
    <p>Dimensões: 16x16, 32x32 ou 64x64px</p>
  </div>
</div>
```

**Implementação Técnica:**
```javascript
// Atualizar favicon dinamicamente
const updateFavicon = (faviconUrl) => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
};

// Atualizar título
const updateTitle = (name) => {
  document.title = name;
};
```

---

### 2. 📢 Sistema de Banners e Avisos

#### 2.1 Gerenciamento de Banners
**Componente:** `SettingsTab/BannersManagement.jsx`

```javascript
const BannersManagement = () => {
  const [banners, setBanners] = useState([]);
  const [showAddBanner, setShowAddBanner] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>Banners e Avisos</h3>
        <button onClick={() => setShowAddBanner(true)}>
          <FaPlus /> Adicionar Banner
        </button>
      </div>

      {/* Lista de Banners */}
      <div className="space-y-3">
        {banners.map(banner => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Modal de Adicionar/Editar */}
      {showAddBanner && (
        <BannerModal
          onClose={() => setShowAddBanner(false)}
          onSave={handleSaveBanner}
        />
      )}
    </div>
  );
};
```

#### 2.2 Formulário de Banner
```javascript
const BannerModal = ({ banner, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'info', // info, warning, success, error
    message: '',
    title: '',
    icon: 'FaBell',
    action: {
      enabled: false,
      text: '',
      link: ''
    },
    display: {
      pages: ['all'], // all, dashboard, specific pages
      position: 'top', // top, bottom
      dismissible: true,
      autoHide: false,
      autoHideDelay: 5000
    },
    active: true,
    startDate: null,
    endDate: null
  });

  return (
    <Modal>
      <h2>{banner ? 'Editar' : 'Adicionar'} Banner</h2>

      {/* Tipo do Banner */}
      <div>
        <label>Tipo</label>
        <select value={formData.type} onChange={handleTypeChange}>
          <option value="info">Informação (Azul)</option>
          <option value="warning">Aviso (Amarelo)</option>
          <option value="success">Sucesso (Verde)</option>
          <option value="error">Erro (Vermelho)</option>
        </select>
      </div>

      {/* Título */}
      <div>
        <label>Título (opcional)</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>

      {/* Mensagem */}
      <div>
        <label>Mensagem</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={3}
          required
        />
      </div>

      {/* Ícone */}
      <div>
        <label>Ícone</label>
        <IconPicker
          selected={formData.icon}
          onChange={(icon) => setFormData({...formData, icon})}
        />
      </div>

      {/* Ação (Link/Botão) */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.action.enabled}
            onChange={(e) => setFormData({
              ...formData,
              action: {...formData.action, enabled: e.target.checked}
            })}
          />
          Adicionar Botão de Ação
        </label>

        {formData.action.enabled && (
          <div className="ml-6 space-y-2 mt-2">
            <input
              type="text"
              placeholder="Texto do botão"
              value={formData.action.text}
              onChange={(e) => setFormData({
                ...formData,
                action: {...formData.action, text: e.target.value}
              })}
            />
            <input
              type="text"
              placeholder="Link (URL ou rota)"
              value={formData.action.link}
              onChange={(e) => setFormData({
                ...formData,
                action: {...formData.action, link: e.target.value}
              })}
            />
          </div>
        )}
      </div>

      {/* Configurações de Exibição */}
      <div>
        <h4>Configurações de Exibição</h4>

        {/* Páginas */}
        <div>
          <label>Exibir em:</label>
          <select
            value={formData.display.pages[0]}
            onChange={handlePagesChange}
          >
            <option value="all">Todas as páginas</option>
            <option value="dashboard">Apenas Dashboard</option>
            <option value="specific">Páginas específicas...</option>
          </select>
        </div>

        {/* Posição */}
        <div>
          <label>Posição:</label>
          <select
            value={formData.display.position}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, position: e.target.value}
            })}
          >
            <option value="top">Topo da página</option>
            <option value="bottom">Rodapé da página</option>
          </select>
        </div>

        {/* Dismissível */}
        <label>
          <input
            type="checkbox"
            checked={formData.display.dismissible}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, dismissible: e.target.checked}
            })}
          />
          Permitir fechar banner
        </label>

        {/* Auto-hide */}
        <label>
          <input
            type="checkbox"
            checked={formData.display.autoHide}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, autoHide: e.target.checked}
            })}
          />
          Ocultar automaticamente
        </label>

        {formData.display.autoHide && (
          <input
            type="number"
            value={formData.display.autoHideDelay / 1000}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, autoHideDelay: e.target.value * 1000}
            })}
            min={1}
            max={30}
          />
        )}
      </div>

      {/* Agendamento */}
      <div>
        <h4>Agendamento (opcional)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Data Início</label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          <div>
            <label>Data Fim</label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h4>Preview</h4>
        <BannerPreview data={formData} />
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <button onClick={handleSave}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
};
```

#### 2.3 Componente de Banner
```javascript
// src/components/Banner.jsx
const Banner = ({ banner }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banner.display.autoHide) {
      const timer = setTimeout(() => {
        setDismissed(true);
      }, banner.display.autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  if (dismissed) return null;

  const typeColors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
  };

  return (
    <div className={`border-l-4 p-4 ${typeColors[banner.type]} relative`}>
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <div className="text-2xl">
          {React.createElement(iconMap[banner.icon])}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {banner.title && (
            <h4 className="font-semibold mb-1">{banner.title}</h4>
          )}
          <p>{banner.message}</p>

          {banner.action.enabled && (
            <button
              className="mt-2 underline font-medium"
              onClick={() => window.location.href = banner.action.link}
            >
              {banner.action.text}
            </button>
          )}
        </div>

        {/* Botão Fechar */}
        {banner.display.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="text-current opacity-60 hover:opacity-100"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};
```

---

### 3. 🎨 Configurações de Tema

#### 3.1 Cores Customizadas
```javascript
<div className="space-y-6">
  <h3>Personalização de Cores</h3>

  {/* Cor Primária */}
  <div>
    <label>Cor Primária</label>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={themeColors.primary}
        onChange={(e) => updateThemeColor('primary', e.target.value)}
      />
      <input
        type="text"
        value={themeColors.primary}
        onChange={(e) => updateThemeColor('primary', e.target.value)}
        className="font-mono"
      />
      <button onClick={() => resetColor('primary')}>
        Resetar
      </button>
    </div>
    <div
      className="h-12 rounded mt-2"
      style={{ backgroundColor: themeColors.primary }}
    />
  </div>

  {/* Cor Secundária */}
  <div>
    <label>Cor Secundária</label>
    {/* Similar */}
  </div>

  {/* Gradientes */}
  <div>
    <label>Gradiente de Botões</label>
    <div className="flex items-center gap-2">
      <input type="color" value={gradientStart} />
      <span>→</span>
      <input type="color" value={gradientEnd} />
    </div>
    <div
      className="h-12 rounded mt-2"
      style={{
        background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
      }}
    />
  </div>
</div>
```

---

### 4. 📧 Configurações de Email

#### 4.1 SMTP Settings
```javascript
<div className="space-y-4">
  <h3>Configurações de Email (SMTP)</h3>

  <input
    type="text"
    placeholder="Host SMTP (ex: smtp.gmail.com)"
    value={smtp.host}
    onChange={(e) => updateSMTP('host', e.target.value)}
  />

  <input
    type="number"
    placeholder="Porta (ex: 587)"
    value={smtp.port}
  />

  <input
    type="email"
    placeholder="Email remetente"
    value={smtp.from}
  />

  <input
    type="text"
    placeholder="Usuário"
    value={smtp.user}
  />

  <input
    type="password"
    placeholder="Senha"
    value={smtp.password}
  />

  <label>
    <input
      type="checkbox"
      checked={smtp.secure}
      onChange={(e) => updateSMTP('secure', e.target.checked)}
    />
    Usar SSL/TLS
  </label>

  <button onClick={testSMTPConnection}>
    Testar Conexão
  </button>
</div>
```

---

## 🗂️ Estrutura de Arquivos

```
src/pages/Admin/components/System/SettingsTab/
├── index.jsx
├── BrandingSettings.jsx        # Logo, Nome, Favicon
├── BannersManagement.jsx        # Sistema de banners
├── ThemeCustomization.jsx       # Cores e tema
├── EmailSettings.jsx            # SMTP
├── NotificationSettings.jsx     # Notificações
├── SecuritySettings.jsx         # Segurança
├── DomainSettings.jsx           # Domínio customizado
├── SEOSettings.jsx              # Meta tags
└── components/
    ├── BannerModal.jsx
    ├── BannerCard.jsx
    ├── BannerPreview.jsx
    └── ColorPicker.jsx
```

---

## 📊 Modelo de Dados

### Platform Settings
```javascript
{
  branding: {
    logo: 'url',
    favicon: 'url',
    name: 'Plataforma',
    tagline: ''
  },
  theme: {
    primary: '#9333ea',
    secondary: '#a855f7',
    gradient: {
      start: '#9333ea',
      end: '#a855f7'
    }
  },
  banners: [
    {
      id: 'uuid',
      type: 'info',
      title: '',
      message: '',
      icon: 'FaBell',
      action: {
        enabled: false,
        text: '',
        link: ''
      },
      display: {
        pages: ['all'],
        position: 'top',
        dismissible: true,
        autoHide: false,
        autoHideDelay: 5000
      },
      active: true,
      startDate: null,
      endDate: null,
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    }
  ],
  email: {
    smtp: {
      host: '',
      port: 587,
      secure: true,
      user: '',
      password: '',
      from: ''
    }
  }
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Branding (Dia 1)
- [ ] Componente BrandingSettings.jsx
- [ ] Upload de logo com preview
- [ ] Input de nome da plataforma
- [ ] Upload de favicon
- [ ] Atualização dinâmica do DOM (favicon, title)
- [ ] API endpoint: `PUT /api/admin/settings/branding`

### Fase 2: Banners (Dia 1-2)
- [ ] Componente BannersManagement.jsx
- [ ] Modal de criação/edição de banner
- [ ] Componente Banner.jsx (exibição)
- [ ] Sistema de agendamento
- [ ] Preview em tempo real
- [ ] API endpoints: CRUD de banners

### Fase 3: Tema (Dia 2)
- [ ] Color picker component
- [ ] ThemeCustomization.jsx
- [ ] Atualização de CSS variables
- [ ] Preview de tema em tempo real

### Fase 4: Email (Dia 2-3)
- [ ] EmailSettings.jsx
- [ ] Teste de conexão SMTP
- [ ] API endpoint: `POST /api/admin/settings/email/test`

---

## 🔗 Referências

- [[Admin Refactoring Plan]]
- [[Settings Tab Architecture]]
- [[Banner System Design]]

---

**Última Atualização:** 2026-02-25
**Responsável:** @ux-design-expert, @dev
