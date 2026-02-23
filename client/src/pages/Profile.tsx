import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"stats" | "history" | "approved">("stats");

  // Queries
  const { data: stats = { total: 0, approved: 0, pending: 0, rejected: 0, totalViews: 0 }, isLoading: statsLoading } =
    trpc.uploads.userStats.useQuery();
  const { data: history = [], isLoading: historyLoading } = trpc.uploads.userHistory.useQuery({
    limit: 20,
    offset: 0,
  });
  const { data: approved = [], isLoading: approvedLoading } = trpc.uploads.userApproved.useQuery();

  // Redirecionar se não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar seu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-lg text-gray-600">Bem-vindo, {user?.name || "Usuário"}!</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            {[
              {
                label: "Total Enviado",
                value: stats.total,
                icon: FileText,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Aprovados",
                value: stats.approved,
                icon: CheckCircle,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Pendentes",
                value: stats.pending,
                icon: Clock,
                color: "bg-yellow-50 text-yellow-700",
              },
              {
                label: "Rejeitados",
                value: stats.rejected,
                icon: XCircle,
                color: "bg-red-50 text-red-700",
              },
              {
                label: "Visualizações",
                value: stats.totalViews,
                icon: Eye,
                color: "bg-purple-50 text-purple-700",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={stat.color}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-75">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <Icon className="w-8 h-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Meus Uploads
              </CardTitle>
              <div className="flex gap-2">
                {[
                  { id: "stats", label: "Estatísticas" },
                  { id: "history", label: "Histórico" },
                  { id: "approved", label: "Aprovados" },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Histórico Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-20">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Nenhum upload encontrado</p>
                    <Button onClick={() => navigate("/upload")} className="mt-4">
                      Fazer Upload
                    </Button>
                  </div>
                ) : (
                  history.map((upload: any) => (
                    <div
                      key={upload.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{upload.title}</h3>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(upload.status)}`}
                            >
                              {getStatusIcon(upload.status)}
                              {getStatusLabel(upload.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{upload.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {upload.aiTools.slice(0, 3).map((tool: string) => (
                              <span
                                key={tool}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                            {upload.aiTools.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{upload.aiTools.length - 3}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Enviado em {new Date(upload.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {upload.moderationNotes && upload.status !== "pending" && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                          <p className="font-medium mb-1">Notas do Moderador:</p>
                          <p>{upload.moderationNotes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Aprovados Tab */}
            {activeTab === "approved" && (
              <div>
                {approvedLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : approved.length === 0 ? (
                  <div className="text-center py-20">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Nenhum upload aprovado ainda</p>
                    <Button onClick={() => navigate("/upload")} className="mt-4">
                      Fazer Upload
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approved.map((item: any) => (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 h-40">
                          {item.type === "video" ? (
                            <video
                              src={item.fileUrl}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLVideoElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <img
                              src={item.fileUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Aprovado
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{item.views || 0} visualizações</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.aiTools.slice(0, 2).map((tool: string) => (
                              <span
                                key={tool}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                            {item.aiTools.length > 2 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{item.aiTools.length - 2}
                              </span>
                            )}
                          </div>

                          <Button variant="outline" className="w-full" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Taxa de Aprovação",
                      value: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0,
                      unit: "%",
                      color: "text-green-600",
                    },
                    {
                      title: "Média de Visualizações",
                      value: stats.approved > 0 ? Math.round(stats.totalViews / stats.approved) : 0,
                      unit: "por trabalho",
                      color: "text-purple-600",
                    },
                  ].map((stat) => (
                    <Card key={stat.title}>
                      <CardContent className="pt-6">
                        <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                        <p className={`text-4xl font-bold ${stat.color}`}>
                          {stat.value}
                          <span className="text-lg ml-2">{stat.unit}</span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Aprovados", value: stats.approved, color: "bg-green-500" },
                        { label: "Pendentes", value: stats.pending, color: "bg-yellow-500" },
                        { label: "Rejeitados", value: stats.rejected, color: "bg-red-500" },
                      ].map((item) => {
                        const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                        return (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{item.label}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {item.value} ({Math.round(percentage)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
