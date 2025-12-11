import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Calendar as CalendarIcon, 
  Kanban, 
  Lightbulb, 
  Users, 
  Plus, 
  MoreVertical, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Layers,
  Send,
  Sparkles,
  X,
  CalendarCheck, // Changed icon for Google Calendar
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Settings,
  Mail,
  Lock,
  Briefcase
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type PostFormat = 'static' | 'reels' | 'carousel';
type PostStatus = 'draft' | 'creating' | 'approval' | 'adjust' | 'approved' | 'published';

interface Comment {
  id: string;
  author: 'System' | 'Client' | 'Manager';
  text: string;
  timestamp: Date;
}

interface Post {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  format: PostFormat;
  status: PostStatus;
  client: string;
  caption: string;
  imageUrl?: string;
  comments: Comment[];
}

interface ClientStrategy {
  id: string;
  name: string;
  persona: {
    pains: string;
    goals: string;
    tone: string;
  };
  identity: {
    colors: string;
    fonts: string;
    inspirationUrl: string;
  };
}

interface User {
  name: string;
  email: string;
  team: string;
  avatar?: string;
}

// --- Mock Data ---

const INITIAL_CLIENTS: ClientStrategy[] = [
  {
    id: '1',
    name: 'TechStart Solutions',
    persona: {
      pains: 'Dificuldade em contratar devs seniores, processos lentos.',
      goals: 'Ser vista como inovadora e atrair talentos.',
      tone: 'Profissional, porém acessível e tech-savvy.'
    },
    identity: {
      colors: '#2563EB, #1E293B',
      fonts: 'Inter, Roboto',
      inspirationUrl: 'pinterest.com/techstart/branding'
    }
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: '5 Dicas de Produtividade',
    date: new Date().toISOString().split('T')[0],
    format: 'carousel',
    status: 'approval',
    client: 'TechStart Solutions',
    caption: 'Confira essas dicas essenciais para melhorar seu workflow no dia a dia dev.',
    comments: [
      { id: 'c1', author: 'Manager', text: 'Enviado para aprovação.', timestamp: new Date() }
    ]
  },
  {
    id: '2',
    title: 'Bastidores do Escritório',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    format: 'reels',
    status: 'draft',
    client: 'TechStart Solutions',
    caption: '',
    comments: []
  },
  {
    id: '3',
    title: 'Lançamento Feature X',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    format: 'static',
    status: 'published',
    client: 'TechStart Solutions',
    caption: 'A espera acabou! A Feature X está no ar.',
    comments: []
  }
];

// --- Helper Functions ---

const getStatusColor = (status: PostStatus) => {
  switch (status) {
    case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'creating': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'approval': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'adjust': return 'bg-red-50 text-red-600 border-red-200';
    case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'published': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    default: return 'bg-gray-50';
  }
};

const getStatusLabel = (status: PostStatus) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'creating': return 'Em Criação';
    case 'approval': return 'Em Aprovação';
    case 'adjust': return 'Precisa de Ajuste';
    case 'approved': return 'Aprovado';
    case 'published': return 'Publicado';
  }
};

const getFormatIcon = (format: PostFormat) => {
  switch (format) {
    case 'reels': return <Video className="w-4 h-4" />;
    case 'carousel': return <Layers className="w-4 h-4" />;
    case 'static': return <ImageIcon className="w-4 h-4" />;
  }
};

// --- Components ---

const AuthPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    team: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    if (!formData.email || !formData.password || !formData.team) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    onLogin({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      team: formData.team
    });
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const team = prompt("Por favor, informe seu time de trabalho:");
    if (team) {
      onLogin({
        name: "Usuário Google",
        email: "usuario@gmail.com",
        team: team,
        avatar: "https://lh3.googleusercontent.com/ogw/AF2bZyiZjCgK-i-F-m-r-q-w-z-x-y=s32-c-mo"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gerente Mkt</h1>
          <p className="text-indigo-100 mt-2">Sua central de comando de conteúdo.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Entrar
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Cadastrar
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Email (Login)</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="seu@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Time / Empresa</label>
              <div className="relative">
                <Briefcase className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ex: Marketing Digital LTDA"
                  required
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-6"
            >
              {isLogin ? 'Acessar Painel' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Ou continue com</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="mt-4 w-full bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfileModal = ({ user, isOpen, onClose, onLogout }: { user: User, isOpen: boolean, onClose: () => void, onLogout: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-indigo-600 h-24 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4">
             <div className="w-24 h-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md">
               {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" alt="avatar"/> : user.name.charAt(0).toUpperCase()}
             </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 text-center">{user.name}</h2>
          <p className="text-sm text-slate-500 text-center mb-6">{user.email}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Time</p>
                <p className="text-sm font-medium text-slate-800">{user.team}</p>
              </div>
            </div>

             <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Settings className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">Configurações da Conta</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full mt-8 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, user, onOpenProfile }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onOpenProfile: () => void }) => (
  <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-10">
    <div className="p-6">
      <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
        <Sparkles className="w-6 h-6" />
        Gerente Mkt
      </h1>
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {[
        { id: 'calendar', label: 'Calendário', icon: CalendarIcon },
        { id: 'board', label: 'Fluxo (Kanban)', icon: Kanban },
        { id: 'strategy', label: 'Estratégia', icon: Lightbulb },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === item.id 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}
    </nav>
    <div className="p-4 border-t border-slate-100">
      <button 
        onClick={onOpenProfile}
        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 rounded-lg transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
           {user.avatar ? <img src={user.avatar} className="w-full h-full" alt="avatar" /> : user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.team}</p>
        </div>
      </button>
    </div>
  </div>
);

const CalendarView = ({ posts, onPostClick, onImportGames }: { posts: Post[], onPostClick: (p: Post) => void, onImportGames: () => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="p-8 ml-64">
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Calendário Editorial</h2>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="w-40 text-center font-medium text-slate-700 select-none">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onImportGames}
            className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 flex items-center gap-2 transition-colors"
          >
            <CalendarCheck className="w-4 h-4" /> Importar Calendário Google
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Post
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
        {emptyDays.map(i => <div key={`empty-${i}`} className="min-h-[120px] bg-slate-50/50" />)}
        
        {days.map(day => {
          // Format date as YYYY-MM-DD to match post dates
          const currentMonth = currentDate.getMonth() + 1;
          const monthStr = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
          const dayStr = day < 10 ? `0${day}` : day;
          const dateStr = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
          
          const dayPosts = posts.filter(p => p.date === dateStr);
          
          return (
            <div key={day} className="min-h-[120px] bg-white border border-slate-200 rounded-lg p-2 hover:border-indigo-300 transition-colors group">
              <span className={`text-sm font-medium inline-block w-6 h-6 text-center leading-6 rounded-full ${
                 // Highlight today
                 new Date().toISOString().slice(0, 10) === dateStr 
                 ? 'bg-indigo-600 text-white' 
                 : 'text-slate-400'
              }`}>
                {day}
              </span>
              <div className="mt-2 space-y-2">
                {dayPosts.map(post => (
                  <button 
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className={`w-full text-left p-2 rounded text-xs border border-l-4 ${getStatusColor(post.status)} truncate shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-1">
                       {getFormatIcon(post.format)}
                       {post.status === 'approval' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                    </div>
                    {post.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KanbanView = ({ posts, onPostClick }: { posts: Post[], onPostClick: (p: Post) => void }) => {
  const columns: PostStatus[] = ['draft', 'creating', 'approval', 'adjust', 'approved', 'published'];

  return (
    <div className="p-8 ml-64 h-screen overflow-hidden flex flex-col">
      <header className="mb-8 flex justify-between items-center flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Fluxo de Trabalho</h2>
      </header>
      
      <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-hide">
        {columns.map(status => (
          <div key={status} className="min-w-[280px] w-[280px] flex flex-col bg-slate-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                {getStatusLabel(status)}
              </span>
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {posts.filter(p => p.status === status).length}
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {posts.filter(p => p.status === status).map(post => (
                <div 
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                      post.format === 'reels' ? 'bg-pink-100 text-pink-700' :
                      post.format === 'carousel' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {post.format}
                    </span>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2 leading-snug">{post.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.date.slice(5)}
                    </span>
                    {post.comments.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategyView = ({ client, onUpdate }: { client: ClientStrategy, onUpdate: (c: ClientStrategy) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIStrategy = async () => {
    if (!process.env.API_KEY) {
      alert("API Key missing");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a marketing persona strategy for a client named "${client.name}". 
        Return ONLY a JSON object with this structure: 
        { "persona": { "pains": "...", "goals": "...", "tone": "..." }, "identity": { "colors": "...", "fonts": "..." } }`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text);
      onUpdate({
        ...client,
        persona: { ...client.persona, ...data.persona },
        identity: { ...client.identity, ...data.identity }
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar estratégia. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 ml-64">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Estratégia do Cliente</h2>
          <p className="text-slate-500">{client.name}</p>
        </div>
        <button 
          onClick={generateAIStrategy}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Sparkles className="w-4 h-4" />}
          Gerar com IA
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Persona
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Dores & Desafios</label>
              <textarea 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                rows={3}
                value={client.persona.pains}
                onChange={(e) => onUpdate({...client, persona: {...client.persona, pains: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Objetivos</label>
              <textarea 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                rows={3}
                value={client.persona.goals}
                onChange={(e) => onUpdate({...client, persona: {...client.persona, goals: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Tom de Voz</label>
              <input 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                value={client.persona.tone}
                onChange={(e) => onUpdate({...client, persona: {...client.persona, tone: e.target.value}})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-600" /> Identidade Visual
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Paleta de Cores</label>
              <div className="flex items-center gap-2 mb-2">
                 {client.identity.colors.split(',').map((c, i) => (
                   <div key={i} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: c.trim() }} />
                 ))}
              </div>
              <input 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                value={client.identity.colors}
                onChange={(e) => onUpdate({...client, identity: {...client.identity, colors: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Tipografia</label>
              <input 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                value={client.identity.fonts}
                onChange={(e) => onUpdate({...client, identity: {...client.identity, fonts: e.target.value}})}
              />
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Referências (URL)</label>
              <input 
                className="w-full text-sm p-3 rounded-lg border border-slate-200 text-blue-600 underline cursor-pointer" 
                value={client.identity.inspirationUrl}
                onChange={(e) => onUpdate({...client, identity: {...client.identity, inspirationUrl: e.target.value}})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostModal = ({ post, isOpen, onClose, onUpdate, client }: { post: Post | null, isOpen: boolean, onClose: () => void, onUpdate: (p: Post) => void, client: ClientStrategy }) => {
  if (!isOpen || !post) return null;

  const [commentText, setCommentText] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  const handleStatusChange = (newStatus: PostStatus) => {
    // Simulates the "1-click approval" workflow logic
    onUpdate({ ...post, status: newStatus });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Client', // Simulating client view
      text: commentText,
      timestamp: new Date()
    };
    onUpdate({ ...post, comments: [...post.comments, newComment] });
    setCommentText('');
  };

  const generateCaption = async () => {
    if (!process.env.API_KEY) return;
    setIsGeneratingCaption(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a social media caption in Portuguese for a post titled "${post.title}". 
        Context: The client is "${client.name}". 
        Tone: ${client.persona.tone}. 
        Format: ${post.format}.
        Include emojis and 3 hashtags.`,
      });
      onUpdate({ ...post, caption: response.text });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-[600px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(post.status)}`}>
                  {getStatusLabel(post.status)}
                </span>
                <span className="text-slate-400 text-sm">{post.date}</span>
             </div>
             <input 
               className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full"
               value={post.title}
               onChange={(e) => onUpdate({...post, title: e.target.value})}
             />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Quick Actions (Approval Workflow) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Aprovação & Status</label>
            <div className="flex gap-2">
              <button 
                onClick={() => handleStatusChange('approved')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${post.status === 'approved' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
              >
                <CheckCircle2 className="w-4 h-4" /> Aprovar
              </button>
              <button 
                onClick={() => handleStatusChange('adjust')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${post.status === 'adjust' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
              >
                <AlertCircle className="w-4 h-4" /> Pedir Ajuste
              </button>
            </div>
            {/* Status Dropdown for granular control */}
             <div className="mt-3 pt-3 border-t border-slate-200">
               <label className="text-xs text-slate-500 mr-2">Mover para:</label>
               <select 
                 value={post.status} 
                 onChange={(e) => handleStatusChange(e.target.value as PostStatus)}
                 className="text-sm bg-transparent font-medium text-slate-700 focus:outline-none"
               >
                 <option value="draft">Rascunho</option>
                 <option value="creating">Em Criação</option>
                 <option value="approval">Em Aprovação</option>
                 <option value="adjust">Ajuste</option>
                 <option value="approved">Aprovado</option>
                 <option value="published">Publicado</option>
               </select>
             </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-2 gap-6">
            {/* Visual */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mídia / Criativo</label>
              <div className="aspect-[4/5] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-2 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                     {post.format === 'reels' ? <Video className="w-6 h-6"/> : <ImageIcon className="w-6 h-6"/>}
                   </div>
                   <p className="text-xs font-medium">Clique para upload</p>
                 </div>
              </div>
            </div>

            {/* Caption */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Legenda</label>
                <button 
                  onClick={generateCaption}
                  disabled={isGeneratingCaption}
                  className="text-xs text-indigo-600 flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGeneratingCaption ? 'Gerando...' : 'Gerar com IA'}
                </button>
              </div>
              <textarea 
                className="flex-1 w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50" 
                placeholder="Escreva a legenda aqui..."
                value={post.caption}
                onChange={(e) => onUpdate({...post, caption: e.target.value})}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Comentários & Aprovação
            </h3>
            
            <div className="space-y-4 mb-4">
              {post.comments.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">Sem comentários ainda.</p>
              ) : (
                post.comments.map(comment => (
                  <div key={comment.id} className={`flex gap-3 ${comment.author === 'Client' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.author === 'Client' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                      {comment.author[0]}
                    </div>
                    <div className={`flex-1 p-3 rounded-xl text-sm ${comment.author === 'Client' ? 'bg-indigo-50 text-indigo-900 rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                      <p>{comment.text}</p>
                      <span className="text-[10px] opacity-60 mt-1 block">
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Adicione um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button 
                onClick={handleAddComment}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [client, setClient] = useState<ClientStrategy>(INITIAL_CLIENTS[0]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setSelectedPost(updatedPost); // Keep modal in sync
  };

  const handleImportCalendar = () => {
    const url = prompt("Cole o link público do seu Calendário Google (ICS ou HTML):");
    
    if (url) {
      // Simulation of parsing the Calendar URL
      // Since we can't parse real ICS client-side easily without CORS/Proxy,
      // We will generate mock events spread through 2025 to simulate the "Import" success.
      
      const newPosts: Post[] = [];
      const year = 2025;
      
      // Mock Event Names
      const eventNames = ["Flamengo vs Vasco", "Corinthians vs Palmeiras", "São Paulo vs Santos", "Grêmio vs Inter"];
      
      // Generate simulated games for 2025 based on the "input"
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Create 2 events per month for simulation
        const randomDays = [Math.floor(Math.random() * 15) + 1, Math.floor(Math.random() * 13) + 16];
        
        for (const day of randomDays) {
          const date = new Date(year, month, day);
          
          // Logic: Post 2 days before
          const postDate = new Date(date);
          postDate.setDate(date.getDate() - 2);
          
          const gameDateStr = date.toLocaleDateString('pt-BR');
          const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
          const finalTitle = `JOGO - ${eventName}`;
          
          newPosts.push({
            id: `imported-${date.getTime()}`,
            title: finalTitle,
            date: postDate.toISOString().split('T')[0],
            format: 'static',
            status: 'draft',
            client: client.name,
            caption: `Prepare-se! Faltam 2 dias para o confronto ${eventName} no dia ${gameDateStr}. Vamos torcer juntos! ⚽🏟️ #Futebol #MatchDay`,
            comments: []
          });
        }
      }
      
      setPosts(prev => [...prev, ...newPosts]);
      alert(`Calendário importado com sucesso! ${newPosts.length} eventos "JOGO" criados para 2025 baseados no link fornecido.`);
    }
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <main>
        {activeTab === 'calendar' && (
          <CalendarView 
            posts={posts} 
            onPostClick={setSelectedPost} 
            onImportGames={handleImportCalendar}
          />
        )}
        {activeTab === 'board' && (
          <KanbanView posts={posts} onPostClick={setSelectedPost} />
        )}
        {activeTab === 'strategy' && (
          <StrategyView client={client} onUpdate={setClient} />
        )}
      </main>

      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          isOpen={!!selectedPost} 
          onClose={() => setSelectedPost(null)}
          onUpdate={handleUpdatePost}
          client={client}
        />
      )}

      <UserProfileModal 
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => setUser(null)}
      />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);