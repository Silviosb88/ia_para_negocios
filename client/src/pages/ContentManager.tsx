import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

type ContentCategory = "blog" | "ia-info" | "divulgacao";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: ContentCategory;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  content: string;
  category: ContentCategory;
}

export default function ContentManager() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Introdução ao DALL-E",
      content: "DALL-E é um modelo de IA que gera imagens a partir de descrições em texto...",
      category: "ia-info",
      createdAt: "2026-02-20",
      updatedAt: "2026-02-20",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category: "blog",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">
            Apenas administradores podem acessar o gerenciador de conteúdo.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            ← Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        content: "",
        category: "blog",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSavePost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : p
        )
      );
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setPosts([newPost, ...posts]);
    }

    setIsDialogOpen(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este conteúdo?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const categoryLabels: Record<ContentCategory, string> = {
    blog: "📝 Blog",
    "ia-info": "🤖 Informações sobre IA",
    divulgacao: "📢 Divulgação",
  };

  const categoryColors: Record<ContentCategory, string> = {
    blog: "bg-blue-100 text-blue-800",
    "ia-info": "bg-purple-100 text-purple-800",
    divulgacao: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📝</div>
            <h1 className="text-2xl font-bold">Gerenciador de Conteúdo</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm opacity-90">
              👤 {user?.name || "Usuário"}
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
              <p className="text-sm">👤 {user?.name || "Usuário"}</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Gerenciar Conteúdo
              </h2>
              <p className="text-gray-600">
                Crie e edite blogs, informações sobre IA e conteúdo de divulgação
              </p>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Conteúdo
            </Button>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        categoryColors[post.category]
                      }`}
                    >
                      {categoryLabels[post.category]}
                    </span>
                  </div>
                  <CardDescription>
                    Atualizado em {post.updatedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.content}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDialog(post)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletePost(post.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">Nenhum conteúdo criado ainda</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Criar Primeiro Conteúdo
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Editar Conteúdo" : "Novo Conteúdo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Digite o título do conteúdo"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ContentCategory,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="blog">📝 Blog</option>
                <option value="ia-info">🤖 Informações sobre IA</option>
                <option value="divulgacao">📢 Divulgação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Digite o conteúdo aqui"
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePost}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="mt-12 text-center">
        <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-semibold">
          ← Voltar para Dashboard
        </a>
      </div>
    </div>
  );
}
