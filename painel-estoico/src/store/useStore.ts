import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface DayLog {
  date: string;
  focus?: string;
  premeditation?: string;
  goodThings?: string;
  failures?: string;
  masteryRating?: number;
  completed: boolean;
  mentorAdvice?: string;
}

interface Concern {
  id: string;
  text: string;
  inControl: boolean;
}

interface User {
  name: string;
  email: string;
}

interface AppState {
  view: 'home' | 'escudo' | 'navalha' | 'timeline' | 'cidadela' | 'meditation' | 'auth' | 'success' | 'quiz' | 'squad-publicador';
  user: User | null;
  streak: number;
  logs: Record<string, DayLog>;
  currentChallenge: string;
  concerns: Concern[];
  virtues: {
    sabedoria: number;
    coragem: number;
    temperanca: number;
    justica: number;
  };
  level: number;
  isPremium: boolean;
  setView: (view: AppState['view']) => void;
  setUser: (user: User) => void;
  saveLog: (date: string, log: Partial<DayLog>) => void;
  updateStreak: () => void;
  setChallenge: (challenge: string) => void;
  addConcern: (text: string, inControl: boolean) => void;
  removeConcern: (id: string) => void;
  addVirtuePoints: (v: keyof AppState['virtues'], points: number) => void;
  resetData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'auth',
      user: null,
      streak: 0,
      logs: {},
      currentChallenge: '',
      concerns: [],
      virtues: {
        sabedoria: 0,
        coragem: 0,
        temperanca: 0,
        justica: 0
      },
      level: 1,
      isPremium: false,

      setView: (view) => {
        const challenges = [
          "Tome um banho frio para dominar seus instintos.",
          "Passe 1 hora em silêncio absoluto, apenas observando.",
          "Não reclame de absolutamente nada durante todo o dia.",
          "Coma apenas o básico. Evite temperos e luxos hoje.",
          "Visualize o pior cenário possível para seus planos atuais.",
          "Pratique o desconforto: sente-se no chão ou durma sem travesseiro.",
          "Escreva 3 coisas pelas quais você seria grato se perdesse tudo.",
          "Ignore um insulto ou crítica sem responder ou se abalar.",
          "Doe algo que você valoriza mas que não é essencial.",
          "Caminhe 20 minutos focado apenas na sua respiração.",
          "Abstenha-se de usar redes sociais por 4 horas seguidas.",
          "Trate uma pessoa difícil com paciência extrema hoje.",
          "Reflita sobre sua mortalidade: 'Eu posso deixar a vida agora'.",
          "Não fale sobre si mesmo ou suas conquistas hoje.",
          "Ajude alguém sem que essa pessoa saiba que foi você.",
          "Acorde 30 minutos mais cedo e contemple o amanhecer.",
          "Beba apenas água hoje. Sinta a pureza da simplicidade.",
          "Liste 3 medos e encare o menor deles de frente.",
          "Não compre nada que não seja estritamente necessário.",
          "Pense em alguém que te magoou e deseje o bem a ela.",
          "Mantenha a postura ereta e o olhar firme o dia todo.",
          "Realize uma tarefa que você está adiando há muito tempo.",
          "Observe um objeto comum como se fosse a primeira vez.",
          "Agradeça a alguém que te serve (garçom, porteiro, caixa).",
          "Coma em silêncio, sem celular ou distrações.",
          "Imagine que este é o seu último dia de vida.",
          "Não julgue as ações de ninguém hoje, apenas as suas.",
          "Suba as escadas em vez de usar o elevador.",
          "Escreva uma carta de gratidão a alguém do seu passado.",
          "Passe 10 minutos na natureza ou olhando para o céu.",
          "Releia seu parágrafo favorito do Ebook e medite sobre ele."
        ];
        
        if (view === 'squad-publicador') {
          set({ view, currentChallenge: '' });
          return;
        }
        
        const day = new Date().getDate();
        const challenge = challenges[(day - 1) % challenges.length];
        
        set({ view, currentChallenge: challenge });
      },

      setUser: async (user) => {
        set({ user });
        if (user) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              set({
                level: profile.level || 1,
                streak: profile.streak || 0,
                isPremium: profile.is_premium || false,
                virtues: {
                  sabedoria: profile.sabedoria || 0,
                  coragem: profile.coragem || 0,
                  temperanca: profile.temperanca || 0,
                  justica: profile.justica || 0
                }
              });
            }
          }
        }
      },

      resetData: () => set({
        streak: 0,
        logs: {},
        currentChallenge: '',
        concerns: [],
        virtues: { sabedoria: 0, coragem: 0, temperanca: 0, justica: 0 },
        level: 1,
        isPremium: false,
        view: 'auth',
        user: null
      }),

      addConcern: (text, inControl) => set((state) => ({
        concerns: [...state.concerns, { id: Math.random().toString(36).substr(2, 9), text, inControl }]
      })),

      removeConcern: (id) => set((state) => ({
        concerns: state.concerns.filter(c => c.id !== id)
      })),

      addVirtuePoints: async (v, points) => {
        const state = get();
        const newVirtues = { ...state.virtues, [v]: state.virtues[v] + points };
        const totalPoints = Object.values(newVirtues).reduce((a, b) => a + b, 0);
        const newLevel = Math.floor(totalPoints / 100) + 1;
        
        set({ virtues: newVirtues, level: newLevel });

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('profiles').update({
            sabedoria: newVirtues.sabedoria,
            coragem: newVirtues.coragem,
            temperanca: newVirtues.temperanca,
            justica: newVirtues.justica,
            level: newLevel
          }).eq('id', session.user.id);
        }
      },

      setChallenge: (currentChallenge) => set({ currentChallenge }),
      
      saveLog: (date, log) => set((state) => ({
        logs: {
          ...state.logs,
          [date]: {
            ...(state.logs[date] || { date, completed: false }),
            ...log,
          }
        }
      })),
      
      updateStreak: () => {
        const { logs } = get();
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        let checkDate = today;
        
        while (logs[checkDate]?.completed) {
          currentStreak++;
          const d = new Date(checkDate);
          d.setDate(d.getDate() - 1);
          checkDate = d.toISOString().split('T')[0];
        }
        
        set({ streak: currentStreak });
      }
    }),
    {
      name: 'painel-estoico-v2',
    }
  )
);
