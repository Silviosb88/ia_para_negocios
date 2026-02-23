import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { BarChart3, Upload, CheckCircle, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar autenticado para acessar o painel administrativo.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            🔐 Fazer Login
          </Button>
          <div className="mt-6">
            <a href="/landing.html" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Voltar para Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Upload,
      label: "Enviar Trabalho",
      href: "/upload",
      description: "Faça upload de seus trabalhos criados com IA",
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      icon: CheckCircle,
      label: "Moderação",
      href: "/moderation",
      description: "Valide e aprove trabalhos enviados",
      color: "bg-green-100",
      textColor: "text-green-600",
      adminOnly: true,
    },
    {
      icon: User,
      label: "Meu Perfil",
      href: "/profile",
      description: "Veja seu histórico e estatísticas",
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      icon: BarChart3,
      label: "Gerenciar Conteúdo",
      href: "/content-manager",
      description: "Crie e edite blogs e informações sobre IA",
      color: "bg-orange-100",
      textColor: "text-orange-600",
      adminOnly: true,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎨</div>
            <h1 className="text-2xl font-bold">Clube do Foco</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm opacity-90">
              👤 {user?.name || "Usuário"}
              {user?.role === "admin" && <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">ADMIN</span>}
            </span>
            <Button
              variant="outline"
              onClick={() => logout()}
              className="text-white border-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 px-4 py-4 border-t border-indigo-500">
            <div className="mb-4 pb-4 border-b border-indigo-500">
              <p className="text-sm">
                👤 {user?.name || "Usuário"}
                {user?.role === "admin" && (
                  <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-white border-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Bem-vindo, {user?.name}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Escolha uma opção abaixo para continuar
            </p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a className="block">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center cursor-pointer h-full">
                      <div className={`${item.color} ${item.textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.label}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          {user?.role === "admin" && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Painel de Administração</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Como administrador, você tem acesso a ferramentas especiais de moderação e gerenciamento.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-600 font-semibold">📤 Validação de Trabalhos</p>
                  <p className="text-sm text-gray-600 mt-1">Revise e aprove uploads de alunos</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-600 font-semibold">✅ Moderação</p>
                  <p className="text-sm text-gray-600 mt-1">Gerencie a fila de moderação</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-600 font-semibold">📊 Estatísticas</p>
                  <p className="text-sm text-gray-600 mt-1">Veja dados de uploads e aprovações</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <a href="/landing.html" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Voltar para página inicial
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
