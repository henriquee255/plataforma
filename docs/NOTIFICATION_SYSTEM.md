# Sistema de Notificações - Plataforma CRM

Sistema de notificações bonito, consistente e não intrusivo usando Shadcn UI Toast.

---

## 🎯 Características

- ✅ **Temporárias** - Aparecem por 2-4 segundos e somem automaticamente
- ✅ **Bonitas** - Design moderno com ícones e cores
- ✅ **Consistentes** - Mesmo estilo em todo o sistema
- ✅ **Acessíveis** - Suporte a screen readers (WCAG AA)
- ✅ **Não intrusivas** - Não bloqueiam o uso do app

---

## 📖 Como Usar

### 1. Importar o hook

```jsx
import { useNotification } from '@/hooks/useNotification';
```

### 2. Usar no componente

```jsx
const MeuComponente = () => {
  const { notifySaved, notifyAdded, notifyError } = useNotification();

  const handleSave = () => {
    try {
      // Salvar dados...
      notifySaved('Perfil atualizado com sucesso!');
    } catch (error) {
      notifyError('Erro ao salvar perfil');
    }
  };

  return (
    <button onClick={handleSave}>Salvar</button>
  );
};
```

---

## 🎨 Tipos de Notificações

### Salvo (Verde)
```jsx
notifySaved('Alterações salvas com sucesso!');
```

### Adicionado (Roxo)
```jsx
notifyAdded('Contato adicionado com sucesso!');
```

### Atualizado (Azul)
```jsx
notifyUpdated('Dados atualizados com sucesso!');
```

### Removido (Vermelho)
```jsx
notifyDeleted('Item removido com sucesso!');
```

### Sucesso Genérico (Verde)
```jsx
notifySuccess('Operação concluída!');
```

### Erro (Vermelho)
```jsx
notifyError('Não foi possível completar a ação');
```

### Aviso (Amarelo)
```jsx
notifyWarning('Verifique os dados antes de continuar');
```

### Informação (Azul)
```jsx
notifyInfo('Esta ação não pode ser desfeita');
```

---

## 🎯 Exemplos de Uso Real

### Formulário de Contato
```jsx
const ContatoForm = () => {
  const { notifyAdded, notifyError } = useNotification();

  const handleSubmit = async (data) => {
    try {
      await api.createContact(data);
      notifyAdded(`${data.name} foi adicionado aos contatos`);
    } catch (error) {
      notifyError('Erro ao adicionar contato. Tente novamente.');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Edição de Perfil
```jsx
const ProfileEdit = () => {
  const { notifyUpdated } = useNotification();

  const handleUpdate = async (data) => {
    await api.updateProfile(data);
    notifyUpdated('Perfil atualizado com sucesso!');
  };

  return <form onSubmit={handleUpdate}>...</form>;
};
```

### Deletar Item com Confirmação
```jsx
const DeleteButton = ({ item }) => {
  const { notifyDeleted, notifyWarning } = useNotification();

  const handleDelete = () => {
    if (!item.canDelete) {
      notifyWarning('Este item não pode ser removido');
      return;
    }

    api.delete(item.id);
    notifyDeleted(`${item.name} foi removido`);
  };

  return <button onClick={handleDelete}>Deletar</button>;
};
```

### Integração com API
```jsx
const IntegrationConnect = () => {
  const { notifySuccess, notifyError } = useNotification();

  const handleConnect = async (platform) => {
    try {
      await api.connectIntegration(platform);
      notifySuccess(`${platform} conectado com sucesso!`);
    } catch (error) {
      notifyError(`Falha ao conectar ${platform}`);
    }
  };

  return <button onClick={handleConnect}>Conectar</button>;
};
```

---

## ⚙️ Notificação Customizada

Para casos especiais, use o `toast` bruto:

```jsx
const { toast } = useNotification();

toast({
  title: 'Título Customizado',
  description: 'Descrição detalhada aqui',
  duration: 5000,
  variant: 'destructive', // ou deixe padrão
});
```

---

## 🎨 Visual das Notificações

- **Salvamento automático**: Notificação verde com ícone de check, 2 segundos
- **Operações manuais**: Toast com ícone específico, 2-4 segundos
- **Erros**: Toast vermelho, 4 segundos (mais tempo para ler)
- **Posição**: Canto inferior direito
- **Animação**: Fade in/out suave

---

## 📝 Boas Práticas

✅ **DO:**
- Use mensagens curtas e objetivas
- Confirme ações importantes (salvar, deletar)
- Use o tipo certo de notificação
- Personalize a mensagem com nome do item

❌ **DON'T:**
- Não mostre notificações para cada clique
- Não use para validações de formulário (use ErrorAlert)
- Não abuse de notificações (causa fadiga)
- Não use textos genéricos como "Sucesso!"

---

## 🔧 Componentes Relacionados

- **SaveNotification** - Auto-save visual (canto inferior direito)
- **ErrorAlert** - Alertas de erro em formulários
- **SuccessToast** - Wrapper do useToast (deprecated, use useNotification)

---

**Criado em:** 2026-02-23
**Versão:** 1.0
