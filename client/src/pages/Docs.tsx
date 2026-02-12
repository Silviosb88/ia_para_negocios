import { useState } from "react";
import { ChevronRight, BookOpen, Zap, Code, Rocket, Wrench, Gift, Brain, Globe, Smartphone, Server, Bot, Gamepad2, Database, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

type Trail = "todos" | "beginner" | "intermediate";

export default function Docs() {
  const [selectedTrail, setSelectedTrail] = useState<Trail>("todos");

  const trails = [
    {
      id: "beginner",
      icon: "🟢",
      title: "Iniciante",
      subtitle: "Nunca programei ou usei GitHub",
      features: [
        "Explicações detalhadas",
        "Cada clique documentado",
        "Prints e exemplos visuais",
        "Glossário de termos",
        "Suporte passo a passo",
      ],
      buttonText: "Começar do Zero",
      buttonIcon: Rocket,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "intermediate",
      icon: "🔵",
      title: "Intermediário",
      subtitle: "Já conheço Git, HTML e CSS básico",
      features: [
        "Conteúdo direto ao ponto",
        "Foco em conceitos avançados",
        "Otimizações e boas práticas",
        "Integração com IA",
        "Troubleshooting avançado",
      ],
      buttonText: "Ir Direto ao Ponto",
      buttonIcon: Zap,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const modules = [
    {
      icon: BookOpen,
      title: "Fundamentos",
      description: "O básico para começar",
      href: "#",
    },
    {
      icon: Wrench,
      title: "Preparação",
      description: "Configure seu ambiente",
      href: "#",
    },
    {
      icon: Code,
      title: "Desenvolvimento",
      description: "Criando com IA",
      href: "#",
    },
    {
      icon: Rocket,
      title: "Deploy",
      description: "Publicando seu projeto",
      href: "#",
    },
    {
      icon: Wrench,
      title: "Manutenção",
      description: "Atualizações e melhorias",
      href: "#",
    },
    {
      icon: Brain,
      title: "Diálogos com IA",
      description: "Exemplos práticos",
      href: "#",
    },
  ];

  const capabilities = [
    { icon: Globe, title: "Aplicações Web", desc: "Sites, dashboards, SPAs, PWAs" },
    { icon: Smartphone, title: "Apps Mobile", desc: "React Native, Flutter, Ionic" },
    { icon: Server, title: "APIs e Backend", desc: "Node.js, Python, REST, GraphQL" },
    { icon: Bot, title: "Bots e Automações", desc: "Discord, Telegram, scripts" },
    { icon: Gamepad2, title: "Jogos", desc: "Unity, Godot, jogos web" },
    { icon: Database, title: "Análise de Dados", desc: "Python, R, visualizações" },
    { icon: Brain, title: "Machine Learning", desc: "TensorFlow, PyTorch, modelos" },
    { icon: Cog, title: "DevOps", desc: "Docker, CI/CD, infraestrutura" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 shadow-xl">
        <div className="container">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-5xl font-bold">Documentação Completa</h1>
          </div>
          <p className="text-center text-indigo-100 text-xl max-w-2xl mx-auto">
            Aprenda a criar projetos web do zero usando IA como seu copiloto
          </p>
        </div>
      </header>

      {/* Trail Selector */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">👋 Escolha sua Trilha de Aprendizado</h2>
            <p className="text-gray-600 text-lg">Selecione o nível que melhor se adapta à sua experiência</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {trails.map((trail) => (
              <div
                key={trail.id}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 ${trail.bgColor} ${trail.borderColor} hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="text-5xl mb-4">{trail.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{trail.title}</h3>
                <p className="text-gray-600 mb-6">{trail.subtitle}</p>

                <ul className="space-y-3 mb-8">
                  {trail.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                      <ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setSelectedTrail(trail.id as Trail)}
                  className={`w-full bg-gradient-to-r ${trail.color} text-white hover:shadow-lg transition-all`}
                >
                  <trail.buttonIcon className="w-5 h-5 mr-2" />
                  {trail.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flowchart */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🗺️ Mapa Visual do Projeto</h2>
            <p className="text-gray-600 text-lg">Entenda a estrutura completa e onde você está em cada etapa</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Level 1 */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg text-center w-full md:w-80">
                <div className="text-3xl mb-2">🏠</div>
                <h4 className="font-bold text-lg mb-1">Clube do Foco</h4>
                <p className="text-indigo-100">Galeria + Plataforma Educacional</p>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-transparent"></div>
            </div>

            {/* Level 2 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: "🖼️", title: "Galeria", desc: "Trabalhos dos estudantes" },
                { icon: "📚", title: "Documentação", desc: "Guias e tutoriais", active: true },
                { icon: "❓", title: "Ajuda", desc: "FAQ e suporte" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 text-center transition-all ${
                    item.active
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-gray-200 text-gray-900"
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className={item.active ? "text-indigo-100" : "text-gray-600"}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-transparent"></div>
            </div>

            {/* Level 3 - Phases */}
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { num: "1", label: "Fundamentos" },
                  { num: "2", label: "Preparação" },
                  { num: "3", label: "Desenvolvimento" },
                  { num: "4", label: "Deploy" },
                  { num: "5", label: "Manutenção" },
                ].map((phase) => (
                  <div
                    key={phase.num}
                    className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-indigo-200 rounded-lg hover:border-indigo-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
                      {phase.num}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{phase.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🚀 Acesso Rápido</h2>
            <p className="text-gray-600 text-lg">Comece seu aprendizado agora</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((module, idx) => {
              const Icon = module.icon;
              return (
                <a
                  key={idx}
                  href={module.href}
                  className="group p-6 bg-gradient-to-br from-slate-50 to-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                    {module.description}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </a>
              );
            })}
          </div>

          {/* Novo Recurso */}
          <div className="mt-8">
            <a
              href="#"
              className="block p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                NOVO! 🌟
              </div>
              <div className="flex items-start gap-4">
                <Gift className="w-8 h-8 text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">🎁 Recursos Gratuitos</h3>
                  <p className="text-indigo-100">Ferramentas e benefícios exclusivos para estudantes do Clube do Foco</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🤖 O que o GitHub Copilot Pode Fazer?</h2>
            <p className="text-gray-600 text-lg">Muito além de criar sites! Veja as possibilidades:</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{cap.title}</h3>
                  <p className="text-gray-600 text-sm">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-3">Clube do Foco</h3>
              <p className="text-sm">Explorando o potencial da IA na criatividade e educação.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Versão</h3>
              <p className="text-sm">v2.0 - Fevereiro de 2026</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Links Úteis</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Galeria
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-sm">
            <p>
              Desenvolvido com <span className="text-red-500">❤️</span> para o Clube do Foco | © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
