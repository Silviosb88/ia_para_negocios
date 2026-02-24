import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface Trabalho {
  id: number;
  estudante: string;
  tipo: "imagem" | "video" | "avatar";
  titulo: string;
  descricao: string;
  url: string;
  videoUrl?: string;
  data: string;
  ferramentas: string[];
}

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading: authLoading, error: authError, isAuthenticated, logout } = useAuth();

  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [filtrados, setFiltrados] = useState<Trabalho[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"todos" | "imagem" | "video" | "avatar">("todos");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTrabalhos = async () => {
      try {
        const response = await fetch("/src/data/trabalhos.json");
        const data = await response.json();
        setTrabalhos(data.trabalhos);
        setFiltrados(data.trabalhos);
      } catch (error) {
        console.error("Erro ao carregar trabalhos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTrabalhos();
  }, []);

  useEffect(() => {
    let resultado = trabalhos;

    if (filterType !== "todos") {
      resultado = resultado.filter((t) => t.tipo === filterType);
    }

    if (searchTerm) {
      resultado = resultado.filter(
        (t) =>
          t.estudante.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltrados(resultado);
  }, [searchTerm, filterType, trabalhos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "imagem":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "avatar":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (selectedIndex === 0) {
      setSelectedIndex(filtrados.length - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filtrados.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (selectedIndex === filtrados.length - 1) {
      setSelectedIndex(0);
    }
  };

  const handleUploadClick = () => {
    if (isAuthenticated) {
      window.location.href = "/upload";
    } else {
      window.location.href = getLoginUrl("/upload");
    }
  };

  const selectedTrabalho = selectedIndex !== null ? filtrados[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎨</div>
              <h1 className="text-4xl font-bold">Clube do Foco</h1>
            </div>
            <div className="flex items-center gap-3">
              <a href="/landing.html" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-white no-underline">
                <span>🏠</span>
                Menu Principal
              </a>
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-white border-0 cursor-pointer font-medium"
              >
                <span>📤</span>
                Enviar Trabalho
              </button>
              <Link href="/docs" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                <BookOpen className="w-5 h-5" />
                Documentacao
              </Link>
            </div>
          </div>
          <p className="text-center text-indigo-100 text-lg">
            Galeria de Trabalhos com IA - Explorando o Futuro da Criatividade
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container py-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nome do estudante ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {(["todos", "imagem", "video", "avatar"] as const).map((tipo) => (
              <Button
                key={tipo}
                onClick={() => setFilterType(tipo)}
                variant={filterType === tipo ? "default" : "outline"}
                className={`rounded-full px-6 py-2 font-medium transition-all ${
                  filterType === tipo
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {tipo === "todos" && "📋 Todos"}
                {tipo === "imagem" && "🖼️ Imagens"}
                {tipo === "video" && "🎬 Vídeos"}
                {tipo === "avatar" && "🤖 Avatares"}
              </Button>
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-gray-600">
            Mostrando <span className="font-bold text-indigo-600">{filtrados.length}</span> trabalho
            {filtrados.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <main className="container py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando trabalhos...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">Nenhum trabalho encontrado</p>
            <p className="text-gray-500">Tente ajustar seus filtros ou termo de busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((trabalho, index) => (
              <div
                key={trabalho.id}
                onClick={() => setSelectedIndex(index)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 h-56">
                  <img
                    src={trabalho.url}
                    alt={trabalho.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23667eea' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getBadgeColor(trabalho.tipo)}`}>
                      {trabalho.tipo}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{trabalho.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <span>👤</span> {trabalho.estudante}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trabalho.descricao}</p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trabalho.ferramentas.slice(0, 2).map((tool) => (
                      <span key={tool} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        {tool}
                      </span>
                    ))}
                    {trabalho.ferramentas.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{trabalho.ferramentas.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-500">📅 {formatDate(trabalho.data)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTrabalho && (
            <div className="relative">
              {/* Close Button */}
              <DialogClose className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </DialogClose>

              {/* Navigation Buttons */}
              {filtrados.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Media */}
              <div className="mb-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg overflow-hidden">
                {selectedTrabalho.tipo === "video" && selectedTrabalho.videoUrl ? (
                  <video controls className="w-full h-auto max-h-96">
                    <source src={selectedTrabalho.videoUrl} type="video/mp4" />
                    Seu navegador não suporta vídeo.
                  </video>
                ) : (
                  <img
                    src={selectedTrabalho.url}
                    alt={selectedTrabalho.titulo}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTrabalho.titulo}</h2>
                    <p className="text-lg text-gray-600 flex items-center gap-2">
                      <span>👤</span> {selectedTrabalho.estudante}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getBadgeColor(selectedTrabalho.tipo)}`}>
                    {selectedTrabalho.tipo}
                  </span>
                </div>

                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{selectedTrabalho.descricao}</p>

                {/* Tools */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Ferramentas Utilizadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrabalho.ferramentas.map((tool) => (
                      <span key={tool} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <p className="text-gray-600 flex items-center gap-2">
                  <span>📅</span> {formatDate(selectedTrabalho.data)}
                </p>

                {/* Counter */}
                {filtrados.length > 1 && (
                  <p className="text-sm text-gray-500 mt-4">
                    {selectedIndex! + 1} de {filtrados.length}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    
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
