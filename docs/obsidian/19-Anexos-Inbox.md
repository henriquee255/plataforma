# 📎 Anexos no Inbox

> **Funcionalidade:** Suporte completo a anexos de mídia no sistema de mensagens

---

## 📋 Visão Geral

O sistema de anexos permite enviar e visualizar diferentes tipos de mídia nas conversas do Inbox:
- 📸 **Imagens** - Preview com modal de ampliação
- 🎵 **Áudio** - Player integrado com controles
- 📄 **Documentos** - Download direto
- 🎬 **Vídeos** - Player nativo

---

## 🎯 Tipos de Anexos Suportados

### 1. **Imagens** 📸

#### **Formatos aceitos:**
- JPG/JPEG
- PNG
- GIF
- WebP

#### **Funcionalidades:**
- ✅ Preview inline na conversa
- ✅ Click para ampliar em modal
- ✅ Responsivo (max-width: 300px)
- ✅ Hover effect (opacity)

#### **Exemplo de uso:**
```javascript
{
  id: 5,
  sender: 'user',
  text: 'Aqui está uma imagem',
  time: '10:31',
  attachment: {
    type: 'image',
    url: 'https://example.com/image.jpg',
    name: 'produto-exemplo.jpg'
  }
}
```

---

### 2. **Áudio** 🎵

#### **Formatos aceitos:**
- MP3
- WAV
- M4A
- OGG

#### **Funcionalidades:**
- ✅ Player customizado com botão play/pause
- ✅ Duração do áudio exibida
- ✅ Auto-pausa ao trocar de áudio
- ✅ Design clean (estilo WhatsApp)

#### **Controles:**
- ▶️ **Play** - Iniciar reprodução
- ⏸️ **Pause** - Pausar reprodução
- 🔁 **Auto-reset** - Volta ao início quando termina

#### **Exemplo de uso:**
```javascript
{
  id: 6,
  sender: 'me',
  text: '',
  time: '10:32',
  attachment: {
    type: 'audio',
    url: 'https://example.com/audio.mp3',
    name: 'resposta-voz.mp3',
    duration: '0:45'
  }
}
```

---

### 3. **Documentos** 📄

#### **Formatos aceitos:**
- PDF
- DOC/DOCX
- XLS/XLSX
- TXT
- ZIP

#### **Funcionalidades:**
- ✅ Ícone de arquivo PDF/documento
- ✅ Nome do arquivo
- ✅ Tamanho do arquivo
- ✅ Download ao clicar
- ✅ Ícone de download

#### **Visual:**
```
┌─────────────────────────────┐
│  📄  catalogo-notebooks.pdf │
│      2.5 MB          ⬇️     │
└─────────────────────────────┘
```

#### **Exemplo de uso:**
```javascript
{
  id: 7,
  sender: 'me',
  text: 'Aqui está o catálogo',
  time: '10:33',
  attachment: {
    type: 'document',
    url: '#',
    name: 'catalogo-notebooks.pdf',
    size: '2.5 MB'
  }
}
```

---

### 4. **Vídeos** 🎬

#### **Formatos aceitos:**
- MP4
- WebM
- OGG

#### **Funcionalidades:**
- ✅ Player nativo HTML5
- ✅ Controles padrão
- ✅ Preview inline
- ✅ Responsivo

#### **Exemplo de uso:**
```javascript
{
  id: 8,
  sender: 'user',
  text: 'Tutorial de uso',
  time: '10:34',
  attachment: {
    type: 'video',
    url: 'https://example.com/video.mp4',
    name: 'tutorial.mp4'
  }
}
```

---

## 🎨 UI/UX Design

### **Imagens**
```
┌──────────────────────┐
│   [Preview Image]    │
│                      │
│  (Click to enlarge)  │
│                      │
│ 📷 produto-exemplo.jpg│
└──────────────────────┘
```

### **Áudio**
```
┌──────────────────────────┐
│  ▶️   🎵 Áudio           │
│       0:45               │
└──────────────────────────┘
```

### **Documento**
```
┌──────────────────────────┐
│ 📄  catalogo.pdf   ⬇️    │
│     2.5 MB               │
└──────────────────────────┘
```

---

## 💻 Implementação Técnica

### **Componentes Envolvidos**

#### **1. Inbox.jsx** (linha ~1057-1150)
```javascript
{msg.attachment && (
  <div className="mt-2">
    {/* Renderiza anexo baseado no type */}
    {msg.attachment.type === 'image' && (
      <div onClick={() => {
        setSelectedImage(msg.attachment.url);
        setShowImageModal(true);
      }}>
        <img src={msg.attachment.url} alt={msg.attachment.name} />
      </div>
    )}

    {msg.attachment.type === 'audio' && (
      <AudioPlayer attachment={msg.attachment} />
    )}

    {msg.attachment.type === 'document' && (
      <DocumentDownload attachment={msg.attachment} />
    )}
  </div>
)}
```

#### **2. Modal de Imagem**
```javascript
{showImageModal && (
  <div className="fixed inset-0 bg-black/90 z-50">
    <img src={selectedImage} className="max-w-full max-h-screen" />
    <button onClick={() => setShowImageModal(false)}>
      <FaTimes />
    </button>
  </div>
)}
```

#### **3. Player de Áudio Escondido**
```javascript
<audio
  ref={audioRef}
  onEnded={() => setPlayingAudio(null)}
  className="hidden"
/>
```

### **Estados Necessários**
```javascript
const [playingAudio, setPlayingAudio] = useState(null);
const [showImageModal, setShowImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const audioRef = useRef(null);
```

---

## 🚀 Como Usar

### **Para Usuários**

#### **1. Enviar Anexo**
1. Clique no ícone 📎 (clipe) no input de mensagem
2. Selecione o tipo:
   - 📄 Documento
   - 📷 Foto
   - 🎬 Vídeo
3. Escolha o arquivo
4. Envie a mensagem

#### **2. Visualizar Anexo**

**Imagem:**
- Clique na imagem → Abre modal ampliado
- Clique fora ou no X → Fecha modal

**Áudio:**
- Clique em ▶️ → Reproduz
- Clique em ⏸️ → Pausa

**Documento:**
- Clique no card → Download automático

---

## ⚡ Performance

### **Otimizações Implementadas**
- ✅ Lazy loading de imagens
- ✅ Player de áudio único (não duplica)
- ✅ Modal fecha ao clicar fora
- ✅ Auto-cleanup ao trocar de áudio

### **Tamanhos Máximos (Recomendado)**
- Imagens: até 5 MB
- Áudio: até 10 MB
- Documentos: até 25 MB
- Vídeos: até 50 MB

---

## 🐛 Troubleshooting

### **Imagem não aparece**
- ✅ Verificar se URL é válida
- ✅ Verificar CORS se imagem externa
- ✅ Verificar formato suportado

### **Áudio não toca**
- ✅ Verificar formato (MP3 tem melhor suporte)
- ✅ Verificar se URL é acessível
- ✅ Tentar abrir URL diretamente no navegador

### **Download não funciona**
- ✅ Verificar href do link `<a>`
- ✅ Adicionar atributo `download`
- ✅ Verificar permissões de CORS

---

## 📦 Arquivos Relacionados

- `src/Inbox.jsx` - Componente principal
- `src/components/ToastContainer.jsx` - Notificações
- [[05-Inbox]] - Documentação completa do Inbox

---

## 🔗 Integrações Futuras

### **Backend (Planejado)**
- [ ] Upload real para S3/CloudFlare
- [ ] Processamento de imagens (resize, compress)
- [ ] Transcodificação de vídeo
- [ ] CDN para delivery otimizado
- [ ] Virus scanning

### **Melhorias UX**
- [ ] Drag-and-drop de arquivos
- [ ] Progress bar durante upload
- [ ] Preview antes de enviar
- [ ] Edição básica de imagens
- [ ] Recorte de áudio

---

[[05-Inbox|← Voltar para Inbox]] | [[00-INDEX|Índice]]
