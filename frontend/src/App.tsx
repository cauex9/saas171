
import { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, CopyPlus, FileText, Gauge, LayoutDashboard, LogIn, Menu, MessageSquareText, ShieldCheck, Sparkles, Target, TrendingUp, Zap, Lock, CreditCard, AlertTriangle, RefreshCw, Trash2, Check } from 'lucide-react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { campaignHistory, dashboardStats, optimizationVariants, planOptions } from './data/mockData';
import { AnalysisResult } from './types';
import { supabase, authHeaders } from './services/supabase';
import { getAnalysesHistory, saveAnalysisToHistory, getAnalysisById, clearAnalysesHistory } from './utils/history';

const primaryNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Analisar', to: '/analisar', icon: Sparkles },
  { label: 'AnÃ¡lises', to: '/analises', icon: FileText },
  { label: 'Campanhas', to: '/campanhas', icon: BarChart3 },
  { label: 'Resultados', to: '/resultados', icon: TrendingUp },
  { label: 'OtimizaÃ§Ãµes', to: '/otimizacoes', icon: CopyPlus },
  { label: 'Planos', to: '/planos', icon: CreditCard }
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/analisar" element={<AnalyzePage />} />
      <Route path="/analises" element={<AnalysesPage />} />
      <Route path="/analises/:id" element={<AnalysisDetailPage />} />
      <Route path="/campanhas" element={<CampaignsPage />} />
      <Route path="/resultados" element={<ResultsPage />} />
      <Route path="/otimizacoes" element={<OptimizationPage />} />
      <Route path="/historico" element={<HistoryPage />} />
      <Route path="/planos" element={<PlansPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
    </Routes>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#09090B]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/30">S</span>
            SocialDash
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#como-funciona">Como funciona</a>
            <a href="#analise">AnÃ¡lise de anÃºncios</a>
            <a href="#otimizacao">OtimizaÃ§Ã£o</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 md:inline-flex">Entrar</Link>
            <Link to="/register" className="inline-flex rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-violet-500">ComeÃ§ar grÃ¡tis</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">AnÃ¡lise e otimizaÃ§Ã£o de anÃºncios</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">Descubra os pontos fracos do seu anÃºncio antes de gastar dinheiro.</h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-300">
              Analise seu criativo, copy, oferta e pÃ¡gina de vendas com IA e receba sugestÃµes para melhorar sua campanha antes de publicÃ¡-la.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white shadow-soft hover:bg-violet-500">ComeÃ§ar grÃ¡tis <ArrowRight size={18} /></Link>
              <a href="#como-funciona" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-zinc-100">Ver como funciona</a>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-zinc-400">
              <div><span className="font-semibold text-white">184</span> anÃºncios avaliados</div>
              <div><span className="font-semibold text-white">82/100</span> score mÃ©dio</div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-4 shadow-soft">
              <div className="rounded-2xl border border-violet-500/30 bg-[#121217] p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Campanha</p>
                    <h3 className="mt-2 text-xl font-semibold">LanÃ§amento SaaS B2B</h3>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">Score 82/100</div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-zinc-800/70 p-4">
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Risco de polÃ­tica</span>
                      <span className="text-amber-300">Requer revisÃ£o</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-700">
                      <div className="h-full w-2/3 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricBox label="CTR estimado" value="1,5% - 2,4%" />
                    <MetricBox label="CPA estimado" value="US$ 12 - US$ 22" />
                    <MetricBox label="ConversÃ£o" value="2% - 4%" />
                    <MetricBox label="CPC" value="US$ 0,70 - US$ 1,10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader eyebrow="Como funciona" title="De criativo bruto a campanha melhor preparada" description="A IA avalia copy, criativo, oferta e landing page para te dar sinais claros de risco, oportunidade e priorizaÃ§Ã£o." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <FeatureCard icon={<Sparkles size={20} />} title="1. Analise" text="VocÃª envia o anÃºncio e a IA avalia criativo, oferta, pÃºblico, proposta e risco de polÃ­tica." />
            <FeatureCard icon={<Target size={20} />} title="2. Entenda" text="Receba um score, explicaÃ§Ãµes e recomendaÃ§Ãµes para melhorar o conjunto antes do lanÃ§amento." />
            <FeatureCard icon={<TrendingUp size={20} />} title="3. Otimize" text="Gere versÃµes A/B e compare previsÃµes contra resultados reais depois da campanha." />
          </div>
        </section>

        <section id="analise" className="bg-[#101014] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader eyebrow="AnÃ¡lise de anÃºncios" title="A IA considera cada peÃ§a do funil" description="NÃ£o apenas o texto: a plataforma olha tambÃ©m para landing page, pÃºblico, oferta e pontos de abandono." />
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <ChecklistCard title="O que a anÃ¡lise avalia" items={['Criativo', 'Copy', 'Oferta', 'PÃºblico', 'Landing page', 'Risco de polÃ­tica']} />
              <ChecklistCard title="SaÃ­das da plataforma" items={['Score 0-100', 'SugestÃµes aplicÃ¡veis', 'PrevisÃµes com intervalo', 'Riscos e recomendaÃ§Ãµes']} />
            </div>
          </div>
        </section>

        <section id="otimizacao" className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader eyebrow="OtimizaÃ§Ã£o com IA" title="Gere alternativas sem perder velocidade" description="Crie versÃµes com foco em conversÃ£o, benefÃ­cio, curiosidade ou uma abordagem mais conservadora em relaÃ§Ã£o Ã s polÃ­ticas." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {optimizationVariants.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{variant.name}</h3>
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-violet-200">{variant.angle}</span>
                </div>
                <p className="text-lg font-medium text-zinc-100">{variant.headline}</p>
                <p className="mt-3 text-sm text-zinc-400">{variant.primaryText}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#101014] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader eyebrow="PrevisÃ£o x resultado real" title="Compare estimativa com realidade" description="Depois da campanha, vocÃª registra o resultado e o sistema interpreta a diferenÃ§a entre previsÃ£o e execuÃ§Ã£o." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <TrendCard title="CTR" predicted="2,1%" real="2,8%" />
              <TrendCard title="CPC" predicted="US$ 0,90" real="US$ 0,64" />
              <TrendCard title="ConversÃ£o" predicted="3,2%" real="4,1%" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader eyebrow="HistÃ³rico de campanhas" title="Aprenda com seus testes" description="PadrÃµes aparecem quando hÃ¡ dados suficientes: headline com benefÃ­cio direto, CTA mais claro e criativos com foco em dor." />
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-zinc-300">
              <thead className="bg-white/5 text-zinc-200">
                <tr>
                  <th className="px-4 py-3">Campanha</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Gasto</th>
                  <th className="px-4 py-3">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {campaignHistory.map((campaign) => (
                  <tr key={campaign.id} className="bg-zinc-950/30">
                    <td className="px-4 py-3 text-zinc-100">{campaign.name}</td>
                    <td className="px-4 py-3">{campaign.status}</td>
                    <td className="px-4 py-3">{campaign.spend}</td>
                    <td className="px-4 py-3">{campaign.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="planos" className="bg-[#101014] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader eyebrow="Planos" title="Escolha o nÃ­vel ideal para sua operaÃ§Ã£o" description="Controle de limites e cobranÃ§a no backend, com acesso por assinatura do usuÃ¡rio." />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {planOptions.map((plan) => (
                <div key={plan.name} className={`rounded-2xl border p-5 ${plan.featured ? 'border-violet-500 bg-violet-500/5 shadow-soft' : 'border-white/10 bg-zinc-900'}`}>
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">{plan.name}</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="pb-1 text-sm text-zinc-400">/ mÃªs</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-300">{plan.description}</p>
                  <ul className="mt-5 space-y-3 text-sm text-zinc-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> {feature}</li>
                    ))}
                  </ul>
                  <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-violet-500 bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-500">Escolher plano</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader eyebrow="FAQ" title="Perguntas frequentes" description="Tudo pensado para ser transparente e coerente com o modelo de anÃ¡lise e previsÃ£o do produto." />
          <div className="mt-8 space-y-4">
            <FaqItem question="O SocialDash promete aprovaÃ§Ã£o pela Meta?" answer="NÃ£o. A plataforma identifica riscos, recomenda ajustes e apresenta estimativas baseadas no contexto informado e no histÃ³rico disponÃ­vel." />
            <FaqItem question="Como funciona a previsÃ£o?" answer="As previsÃµes surgem em intervalos e devem ser vistas como estimativas, nÃ£o garantias de conversÃ£o." />
            <FaqItem question="Posso usar o serviÃ§o para campanhas de vÃ¡rios mercados?" answer="Sim. A anÃ¡lise pode ser feita por paÃ­s, pÃºblico, oferta e criativo, alÃ©m de comparar resultado real com previsÃ£o." />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#09090B]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/30 text-sm">S</span> SocialDash</div>
            <p className="mt-4 max-w-sm text-sm text-zinc-400">Plataforma de anÃ¡lise e otimizaÃ§Ã£o de anÃºncios para reduzir risco antes do lanÃ§amento.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">NavegaÃ§Ã£o</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div><a href="#como-funciona">Como funciona</a></div>
              <div><a href="#analise">AnÃ¡lise</a></div>
              <div><a href="#planos">Planos</a></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">Legal</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div><Link to="/termos">Termos</Link></div>
              <div><Link to="/privacidade">Privacidade</Link></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const title = mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Recuperar senha';
  const subtitle = mode === 'login' ? 'Acesse seu painel, anÃ¡lises e campanhas.' : mode === 'register' ? 'Cadastre-se para comeÃ§ar a analisar anÃºncios.' : 'Enviamos instruÃ§Ãµes para confirmar sua conta.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-soft">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-300"><ChevronRight className="rotate-180" size={16} /> Voltar</Link>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30">A</div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        </div>
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault(); setAuthError(''); setAuthMessage('');
          if (!supabase) { setAuthError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'); return; }
          const fields = new FormData(event.currentTarget);
          const email = String(fields.get('email') || ''); const password = String(fields.get('password') || '');
          setAuthBusy(true);
          try {
            const response = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : mode === 'register' ? await supabase.auth.signUp({ email, password }) : await supabase.auth.resetPasswordForEmail(email);
            if (response.error) throw response.error;
            if (mode === 'login') navigate('/dashboard'); else setAuthMessage('Confira seu e-mail para continuar.');
          } catch (error) { setAuthError(error instanceof Error ? error.message : 'Falha na autenticaÃ§Ã£o.'); }
          finally { setAuthBusy(false); }
        }}>
          {(
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">E-mail</label>
              <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500" name="email" type="email" required placeholder="seu@email.com" />
            </div>
          )}
          {mode !== 'forgot' && (
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Senha</label>
              <input name="password" required minLength={6} type="password" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
            </div>
          )}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Nome completo</label>
              <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500" placeholder="Seu nome" />
            </div>
          )}
          <button type="submit" disabled={authBusy} className="mt-3 w-full rounded-full bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-500">{mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link'}</button>
          {authError && <p role="alert" className="text-sm text-red-400">{authError}</p>}
          {authMessage && <p className="text-sm text-green-400">{authMessage}</p>}
        </form>
        <div className="mt-5 text-center text-sm text-zinc-400">
          {mode === 'login' ? <Link to="/forgot-password" className="text-violet-300">Esqueci a senha</Link> : mode === 'register' ? <Link to="/login" className="text-violet-300">JÃ¡ tenho conta</Link> : <Link to="/login" className="text-violet-300">Voltar ao login</Link>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block space-y-2 text-sm text-zinc-300">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500" placeholder={placeholder} />
    </label>
  );
}

function DashboardPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getAnalysesHistory());
  }, []);

  const totalAnalyses = history.length;
  const avgScore = totalAnalyses > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalAnalyses) : 0;

  const dynamicStats = [
    { label: 'AnÃºncios analisados', value: String(totalAnalyses), trend: '+100%' },
    { label: 'Score mÃ©dio', value: `${avgScore}/100`, trend: avgScore >= 80 ? '+8 pts' : '+4 pts' },
    { label: 'Campanhas ativas', value: String(Math.max(1, Math.ceil(totalAnalyses / 2))), trend: '+2' },
    { label: 'CTR mÃ©dio previsto', value: '2.4%', trend: '+0.5%' }
  ];

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-violet-300">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Resumo da operaÃ§Ã£o</h1>
        </div>
        <Link to="/analisar" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500">Analisar novo anÃºncio</Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Ãšltimas anÃ¡lises</h2>
            <Link to="/analises" className="text-sm text-violet-300">Ver todas ({history.length})</Link>
          </div>
          <div className="mt-6 space-y-4">
            {history.slice(0, 5).map((analysis) => (
              <Link key={analysis.id} to={`/analises/${analysis.id}`} className="block rounded-2xl border border-white/10 bg-[#111114] p-4 transition hover:border-violet-500/30">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">{analysis.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{analysis.product} â€¢ {analysis.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-violet-300">Score</p>
                    <p className="text-xl font-semibold text-white">{analysis.score}/100</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Resumo de risco</h2>
          <div className="mt-6 space-y-4">
            <RiskRow label="Criativo" value={86} tone="good" />
            <RiskRow label="Copy" value={80} tone="good" />
            <RiskRow label="Oferta" value={74} tone="medium" />
            <RiskRow label="Landing page" value={68} tone="medium" />
            <RiskRow label="PolÃ­tica" value={66} tone="risk" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function AnalyzePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    adName: '',
    product: '',
    price: '',
    country: 'Brasil',
    audience: '',
    goal: 'ConversÃ£o',
    dailyBudget: '',
    landingPageUrl: '',
    primaryText: '',
    headline: '',
    description: '',
    cta: 'Saiba mais'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.adName || !form.product || !form.headline || !form.primaryText) {
      setError('Por favor preencha os campos obrigatÃ³rios (Nome, Produto, TÃ­tulo e Texto Principal).');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const headers = await authHeaders();
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          adName: form.adName,
          product: form.product,
          price: form.price || 'R$ 0',
          country: form.country || 'Brasil',
          audience: form.audience || 'PÃºblico Geral',
          goal: form.goal || 'ConversÃ£o',
          dailyBudget: form.dailyBudget || 'R$ 50',
          headline: form.headline,
          primaryText: form.primaryText,
          description: form.description || form.headline,
          cta: form.cta || 'Saiba mais',
          landingPageUrl: form.landingPageUrl || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao realizar anÃ¡lise da IA');
      }

      const newAnalysis: AnalysisResult = {
        id: `an-${Date.now()}`,
        name: form.adName,
        product: form.product,
        price: form.price,
        country: form.country,
        score: data.score,
        status: data.classification || 'Analisado',
        createdAt: new Date().toISOString().split('T')[0],
        objective: form.goal,
        summary: data.summary,
        risk: data.classification?.includes('Risco') ? 'Alto Risco' : 'AtenÃ§Ã£o Requerida',
        predictions: {
          ctr: data.predictions?.ctrRange || '1.8% - 2.5%',
          cpc: data.predictions?.cpcRange || 'R$ 0.90 - R$ 1.50',
          conversion: data.predictions?.conversionRange || '2.5% - 4%',
          cpa: data.predictions?.cpaRange || 'R$ 15 - R$ 25'
        },
        scoreBreakdown: data.categories?.map((c: any) => ({
          label: c.name,
          value: c.score,
          tone: c.score >= 80 ? 'good' : c.score >= 70 ? 'medium' : 'risk'
        })) || [
          { label: 'Criativo', value: 85, tone: 'good' },
          { label: 'Copy', value: 80, tone: 'good' },
          { label: 'Oferta', value: 78, tone: 'medium' },
          { label: 'PÃºblico', value: 82, tone: 'good' }
        ],
        policyIssues: data.policyIssues,
        risks: data.risks,
        headline: form.headline,
        primaryText: form.primaryText,
        description: form.description,
        cta: form.cta
      };

      saveAnalysisToHistory(newAnalysis);
      navigate(`/analises/${newAnalysis.id}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com o serviÃ§o de IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-300">Nova anÃ¡lise</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Analisar anÃºncio com IA</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900 p-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do anÃºncio *</label>
            <input
              type="text"
              required
              placeholder="Ex: Campanha LanÃ§amento SaaS"
              value={form.adName}
              onChange={(e) => setForm({ ...form, adName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Produto ou serviÃ§o *</label>
            <input
              type="text"
              required
              placeholder="Ex: Software de automaÃ§Ã£o de marketing"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">PreÃ§o</label>
            <input
              type="text"
              placeholder="Ex: R$ 49/mÃªs"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">PaÃ­s</label>
            <input
              type="text"
              placeholder="Ex: Brasil"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">PÃºblico-alvo</label>
            <input
              type="text"
              placeholder="Ex: Gestores de trÃ¡fego e empreendedores"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Objetivo da campanha</label>
            <input
              type="text"
              placeholder="Ex: ConversÃ£o / Vendas"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">OrÃ§amento diÃ¡rio</label>
            <input
              type="text"
              placeholder="Ex: R$ 100/dia"
              value={form.dailyBudget}
              onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">URL da Landing Page</label>
            <input
              type="text"
              placeholder="https://seusite.com/oferta"
              value={form.landingPageUrl}
              onChange={(e) => setForm({ ...form, landingPageUrl: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">TÃ­tulo (Headline) *</label>
            <input
              type="text"
              required
              placeholder="Ex: Automatize sua gestÃ£o sem retrabalho"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Chamada para AÃ§Ã£o (CTA)</label>
            <input
              type="text"
              placeholder="Ex: Saiba mais / Garanta jÃ¡"
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Texto Principal (Copy) *</label>
          <textarea
            required
            rows={3}
            placeholder="Cole aqui o texto principal do anÃºncio..."
            value={form.primaryText}
            onChange={(e) => setForm({ ...form, primaryText: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Enviar para anÃ¡lise de IA
              </>
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

function AnalysesPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setAnalyses(getAnalysesHistory());
  }, []);

  const clearHistory = () => {
    if (confirm('Deseja realmente limpar seu histÃ³rico de anÃ¡lises?')) {
      clearAnalysesHistory();
      setAnalyses(getAnalysesHistory());
    }
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Minhas AnÃ¡lises</h1>
        <div className="flex gap-3">
          <button onClick={clearHistory} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700">
            <Trash2 size={14} /> Limpar histÃ³rico
          </button>
          <Link to="/analisar" className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-500">
            <Sparkles size={14} /> Nova AnÃ¡lise
          </Link>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {analyses.map((analysis) => (
          <Link to={`/analises/${analysis.id}`} key={analysis.id} className="block rounded-2xl border border-white/10 bg-zinc-900 p-5 hover:border-violet-500/40 transition">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">{analysis.name}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${analysis.score >= 80 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                    {analysis.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{analysis.product} â€¢ {analysis.country} â€¢ {analysis.createdAt}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-zinc-400">Score de Desempenho</p>
                <p className="text-2xl font-bold text-violet-400">{analysis.score}/100</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const analysis = getAnalysisById(id || '');
  if (!analysis) return <AppShell><div className="rounded-2xl border border-white/10 p-8 text-white"><h1 className="text-xl font-semibold">AnÃ¡lise nÃ£o encontrada</h1><p className="mt-2 text-zinc-400">Este registro nÃ£o existe no histÃ³rico deste navegador.</p><Link className="mt-4 inline-block text-violet-400" to="/analises">Voltar Ã s anÃ¡lises</Link></div></AppShell>;

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/analises" className="text-xs text-violet-400 hover:underline">â† Voltar para anÃ¡lises</Link>
          <h1 className="mt-2 text-3xl font-semibold text-white">{analysis.name}</h1>
          <p className="text-sm text-zinc-400 mt-1">{analysis.product} â€¢ {analysis.country} â€¢ Criado em {analysis.createdAt}</p>
        </div>
        <button
          onClick={() => navigate('/otimizacoes')}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Sparkles size={16} /> Otimizar este anÃºncio com IA
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">SCORE GERAL DO ANÃšNCIO</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-bold text-violet-400">{analysis.score}</span>
            <span className="pb-2 text-xl text-zinc-400">/100</span>
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-200">{analysis.status}</p>
          <div className="mt-6 space-y-4">
            {analysis.scoreBreakdown.map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
                  <span>{metric.label}</span>
                  <span className="font-semibold text-white">{metric.value}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
                  <div className={`h-full rounded-full ${metric.tone === 'good' ? 'bg-emerald-400' : metric.tone === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Resumo da anÃ¡lise</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">{analysis.summary}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoPill label="Objetivo" value={analysis.objective} />
              <InfoPill label="CTR Previsto" value={analysis.predictions.ctr} />
              <InfoPill label="CPC Previsto" value={analysis.predictions.cpc} />
              <InfoPill label="CPA Estimado" value={analysis.predictions.cpa} />
            </div>
          </div>

          {analysis.policyIssues && analysis.policyIssues.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h2 className="text-lg font-semibold text-amber-300 flex items-center gap-2 mb-3">
                <AlertTriangle size={20} /> PossÃ­veis problemas de polÃ­tica (Meta / Google)
              </h2>
              <div className="space-y-3">
                {analysis.policyIssues.map((issue, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-zinc-900/80 p-3 text-xs text-zinc-300 space-y-1">
                    <p><strong className="text-amber-400">Trecho auditado:</strong> "{issue.phrase}"</p>
                    <p><strong className="text-zinc-200">Motivo de risco:</strong> {issue.reason}</p>
                    <p><strong className="text-emerald-400">SugestÃ£o segura:</strong> {issue.alternative}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setAnalyses(getAnalysesHistory());
  }, []);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-white">HistÃ³rico Completo de AnÃ¡lises</h1>
        <span className="text-xs text-zinc-400">Total: {analyses.length} registros</span>
      </div>
      <div className="space-y-4">
        {analyses.map((item) => (
          <Link to={`/analises/${item.id}`} key={item.id} className="block rounded-2xl border border-white/10 bg-zinc-900 p-5 hover:border-violet-500/30 transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{item.product} â€¢ Realizado em {item.createdAt}</p>
                <p className="text-xs text-zinc-300 mt-2 line-clamp-2">{item.summary}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-violet-400">{item.score}/100</span>
                <p className="text-xs text-zinc-400 mt-1">{item.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function OptimizationPage() {
  const [variants, setVariants] = useState(optimizationVariants);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateNewVariants = async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          adName: 'AnÃºncio Exemplo',
          product: 'SaaS AutomaÃ§Ã£o',
          price: 'R$ 15,99',
          country: 'Brasil',
          audience: 'Gestores de trÃ¡fego',
          goal: 'ConversÃ£o',
          dailyBudget: 'R$ 100',
          headline: 'Automatize seu funil com IA',
          primaryText: 'Transforme leads em clientes com inteligÃªncia artificial.',
          description: 'Software de automaÃ§Ã£o',
          cta: 'Saiba mais'
        })
      });
      const data = await res.json();
      if (data?.variants && Array.isArray(data.variants)) {
        setVariants(data.variants.map((v: any, idx: number) => ({
          id: String(idx + 1),
          name: v.name || `VersÃ£o ${idx + 1}`,
          angle: v.angle || v.focus || 'Foco em conversÃ£o',
          headline: v.headline,
          primaryText: v.primaryText,
          description: v.description || '',
          cta: v.cta || 'Saiba mais',
          reason: v.reason || ''
        })));
      }
    } catch (e) {
      console.error('Erro ao otimizar anÃºncio', e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-white">OtimizaÃ§Ãµes com IA</h1>
        <button
          onClick={generateNewVariants}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Gerar Novas VariaÃ§Ãµes
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {variants.map((variant) => (
          <div key={variant.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{variant.name}</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-violet-300 font-mono">{variant.angle}</span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-zinc-300">
                <p><span className="font-semibold text-white">Headline:</span> {variant.headline}</p>
                <p><span className="font-semibold text-white">Texto principal:</span> {variant.primaryText}</p>
                <p><span className="font-semibold text-white">CTA:</span> {variant.cta}</p>
                <p className="text-xs text-zinc-400 bg-white/5 p-2.5 rounded-xl border border-white/5 mt-2">
                  <strong className="text-zinc-300">Por que converte:</strong> {variant.reason}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => copyToClipboard(`Headline: ${variant.headline}\nCopy: ${variant.primaryText}`, variant.id)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white hover:bg-white/10"
              >
                {copiedId === variant.id ? <Check size={14} className="text-emerald-400" /> : <CopyPlus size={14} />}
                {copiedId === variant.id ? 'Copiado!' : 'Copiar Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function CampaignsPage() {
  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Campanhas</h1>
        <button className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500">Nova campanha</button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {campaignHistory.map((campaign) => (
          <div key={campaign.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{campaign.name}</h2>
              <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-200">{campaign.status}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              <div className="flex justify-between"><span>OrÃ§amento</span><span>{campaign.budget}</span></div>
              <div className="flex justify-between"><span>Gasto</span><span>{campaign.spend}</span></div>
              <div className="flex justify-between"><span>ROAS</span><span>{campaign.roas}</span></div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function ResultsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-white">Resultados reais</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">PrevisÃ£o x resultado</h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-300">
            <ComparisonRow label="CTR" forecast="2,1%" actual="2,8%" />
            <ComparisonRow label="CPC" forecast="R$ 0,90" actual="R$ 0,64" />
            <ComparisonRow label="ConversÃ£o" forecast="3,2%" actual="4,1%" />
            <ComparisonRow label="CPA" forecast="R$ 18" actual="R$ 14" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">AnÃ¡lise do resultado</h2>
          <p className="mt-4 text-zinc-300">Seu CTR ficou acima da estimativa, indicando que o criativo e o hook tiveram bom desempenho. Entretanto, a conversÃ£o ficou abaixo da estimativa. Uma possÃ­vel hipÃ³tese Ã© que exista uma perda de eficiÃªncia entre o clique e a landing page.</p>
          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            <p>â€¢ O que funcionou: hook e mensagem principal.</p>
            <p>â€¢ O que ficou abaixo do esperado: conversÃ£o final.</p>
            <p>â€¢ O que testar: headline, oferta e clareza da landing page.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function PlansPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-white">Planos</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {planOptions.map((plan) => (
          <div key={plan.name} className={`rounded-2xl border p-5 ${plan.featured ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 bg-zinc-900'}`}>
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">{plan.name}</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="pb-1 text-sm text-zinc-400">/ mÃªs</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> {feature}</li>
              ))}
            </ul>
            <Link to="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white">Assinar</Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'AGENCY'>('STARTER');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const planPrices = {
    STARTER: { amount: 15.99, formatted: 'R$ 15,99', name: 'Plano STARTER' },
    PRO: { amount: 20.99, formatted: 'R$ 20,99', name: 'Plano PRO' },
    AGENCY: { amount: 49.99, formatted: 'R$ 49,99', name: 'Plano AGENCY' }
  };

  const currentPlan = planPrices[selectedPlan];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/payments/pix/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...await authHeaders() },
        body: JSON.stringify({ planId: selectedPlan })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao gerar assinatura Pix');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar requisiÃ§Ã£o');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (result?.pix?.code) {
      navigator.clipboard.writeText(result.pix.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h1 className="text-3xl font-semibold text-white">Checkout - Assinatura Pix</h1>
        <p className="mt-3 text-sm text-zinc-300">
          Pagamento recorrente via gateway PoseidonPay.
        </p>

        <form onSubmit={handleSubscribe} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Escolha o Plano</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STARTER', 'PRO', 'AGENCY'] as const).map((planKey) => (
                <button
                  type="button"
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`rounded-xl border p-3 text-left transition-all ${selectedPlan === planKey ? 'border-violet-500 bg-violet-500/10 text-white ring-1 ring-violet-500' : 'border-white/10 bg-zinc-800/50 text-zinc-400 hover:border-white/20'}`}
                >
                  <p className="text-xs font-semibold">{planKey}</p>
                  <p className="text-sm font-bold text-violet-400 mt-1">{planPrices[planKey].formatted}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-white">{currentPlan.name} (Mensal)</p>
              <p className="text-xs text-zinc-400">CobranÃ§a recorrente via Pix</p>
            </div>
            <span className="text-xl font-bold text-violet-400">{currentPlan.formatted}</span>
          </div>

          <p className="text-sm text-zinc-400">Seus dados de cadastro serÃ£o usados automaticamente para gerar o Pix. Nenhum formulÃ¡rio adicional.</p>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {!result && (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Gerando QR Code Pix...' : 'Gerar Pix agora'}
            </button>
          )}
        </form>

        {result && (
          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-400">Pix gerado â€” aguardando pagamento</span>
              <span className="text-xs rounded-full bg-green-500/20 px-2.5 py-1 text-green-300 font-mono">{result.status}</span>
            </div>

            {result.pix?.image && (
              <div className="flex justify-center my-2">
                <img src={result.pix.image} alt="Pix QR Code" className="w-48 h-48 rounded-lg bg-white p-2" />
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-400 mb-1">CÃ³digo Copia e Cola (Pix)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.pix?.code || ''}
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                />
                <button
                  onClick={copyPixCode}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-500"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="text-xs text-zinc-400 space-y-1 border-t border-white/10 pt-3">
              <p><strong className="text-zinc-300">ID da TransaÃ§Ã£o:</strong> {result.transactionId}</p>
              <p><strong className="text-zinc-300">ID da Assinatura:</strong> {result.subscription?.id}</p>
              <p><strong className="text-zinc-300">Periodicidade:</strong> A cada {result.subscription?.periodicity} {result.subscription?.periodicityType}</p>
              {result.pix?.expiresAt && (
                <p><strong className="text-zinc-300">Expira em:</strong> {new Date(result.pix.expiresAt).toLocaleString('pt-BR')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TermsPage() {
  return <StaticPage title="Termos de uso" body="A plataforma oferece anÃ¡lise, estimativas de anÃºncios e recomendaÃ§Ãµes para melhorar campanhas antes do lanÃ§amento. NÃ£o garante aprovaÃ§Ã£o pela Meta nem conversÃ£o." />;
}

function PrivacyPage() {
  return <StaticPage title="Privacidade" body="Os dados do usuÃ¡rio e das campanhas sÃ£o protegidos por autenticaÃ§Ã£o, autorizaÃ§Ã£o e regras de seguranÃ§a no backend e no Supabase." />;
}

function StaticPage({ title, body }: { title: string; body: string }) {
  return (
    <AppShell>
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-5 text-zinc-300">{body}</p>
      </div>
    </AppShell>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto flex max-w-screen-2xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-white/10 bg-zinc-900/80 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/30">S</span>
            <div>
              <p className="text-lg font-semibold">SocialDash</p>
              <p className="text-xs text-zinc-400">OperaÃ§Ã£o inteligente</p>
            </div>
          </div>
          <nav className="space-y-2">
            {primaryNav.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0f0f11] p-4">
            <div className="flex items-center gap-2 text-violet-300"><Lock size={16} /> SessÃ£o segura</div>
            <p className="mt-3 text-sm text-zinc-400">AtualizaÃ§Ã£o de sessÃ£o e autenticaÃ§Ã£o protegida pelo backend e Supabase.</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-4">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 lg:hidden">
              <Menu size={16} /> Menu
            </button>
            <div className="hidden items-center gap-2 text-sm text-zinc-400 lg:flex">
              <span>Dashboard</span>
              <ChevronRight size={15} />
              <span className="text-zinc-200">Resumo</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">NotificaÃ§Ãµes</button>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"><LogIn size={16} /> Sair</Link>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-zinc-300">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-300">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-zinc-300">{text}</p>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> {item}</li>
        ))}
      </ul>
    </div>
  );
}

function TrendCard({ title, predicted, real }: { title: string; predicted: string; real: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">{title}</p>
      <div className="mt-4 flex items-center justify-between text-zinc-200">
        <span>Previsto</span>
        <span className="font-semibold text-white">{predicted}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-zinc-200">
        <span>Real</span>
        <span className="font-semibold text-white">{real}</span>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <h3 className="font-medium text-white">{question}</h3>
      <p className="mt-2 text-sm text-zinc-300">{answer}</p>
    </div>
  );
}

function RiskRow({ label, value, tone }: { label: string; value: number; tone: 'good' | 'medium' | 'risk' }) {
  const classNames = tone === 'good' ? 'bg-emerald-400' : tone === 'medium' ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
        <div className={`h-full rounded-full ${classNames}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#18181B] p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function ComparisonRow({ label, forecast, actual }: { label: string; forecast: string; actual: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111114] p-3">
      <span className="font-medium text-white">{label}</span>
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <span>Previsto: {forecast}</span>
        <span>Real: {actual}</span>
      </div>
    </div>
  );
}

export default App;

