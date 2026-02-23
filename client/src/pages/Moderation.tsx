import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Check,
  X,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useLocation } from "wouter";

type FilterStatus = "todos" | "pendente" | "aprovado" | "rejeitado";

interface Upload {
  id: number;
  uploadId: number;
  userId: number;
  title: string;
  description: string;
  type: "imagem" | "video" | "avatar";
  fileUrl: string;
  aiTools: string;
  inspirationSource: string;
  status: "pending" | "approved" | "rejected";
  moderationNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Moderation() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pendente");
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { data: moderationQueue = [], isLoading } = trpc.uploads.moderationQueue.useQuery({});
  const approveMutation = trpc.uploads.approve.useMutation();
  const rejectMutation = trpc.uploads.reject.useMutation();

  // Redirecionar se não autenticado ou não admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar a moderação</CardDescription>
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

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Acesso Negado
            </CardTitle>
            <CardDescription>Apenas administradores podem acessar a moderação</CardDescription>
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

  // Filtrar uploads
  const filteredUploads = useMemo(() => {
    let result = moderationQueue;

    if (filterStatus !== "todos") {
      const statusMap: Record<FilterStatus, string> = {
        todos: "",
        pendente: "pending",
        aprovado: "approved",
        rejeitado: "rejected",
      };
      result = result.filter((u) => u.status === statusMap[filterStatus]);
    }

    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [moderationQueue, filterStatus, searchTerm]);

  const handleApprove = async () => {
    if (!selectedUpload) return;

    setIsSubmitting(true);
    try {
      await approveMutation.mutateAsync({
        uploadId: selectedUpload.uploadId,
        notes: moderationNotes,
      });

      // Atualizar lista
      setSelectedUpload(null);
      setModerationNotes("");
    } catch (error) {
      console.error("Erro ao aprovar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUpload) return;

    setIsSubmitting(true);
    try {
      await rejectMutation.mutateAsync({
        uploadId: selectedUpload.uploadId,
        reason: moderationNotes || "Rejeitado pelo moderador",
      });

      // Atualizar lista
      setSelectedUpload(null);
      setModerationNotes("");
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Moderação</h1>
          <p className="text-lg text-gray-600">
            Revise e aprove/rejeite uploads da comunidade
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: moderationQueue.length, color: "bg-blue-50 text-blue-700" },
            {
              label: "Pendentes",
              count: moderationQueue.filter((u) => u.status === "pending").length,
              color: "bg-yellow-50 text-yellow-700",
            },
            {
              label: "Aprovados",
              count: moderationQueue.filter((u) => u.status === "approved").length,
              color: "bg-green-50 text-green-700",
            },
            {
              label: "Rejeitados",
              count: moderationQueue.filter((u) => u.status === "rejected").length,
              color: "bg-red-50 text-red-700",
            },
          ].map((stat) => (
            <Card key={stat.label} className={stat.color}>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stat.count}</div>
                <p className="text-sm font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {(["todos", "pendente", "aprovado", "rejeitado"] as const).map((status) => (
                  <Button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    variant={filterStatus === status ? "default" : "outline"}
                    className="capitalize"
                  >
                    {status === "todos" ? "Todos" : status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploads Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredUploads.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhum upload encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUploads.map((upload) => (
              <Card
                key={upload.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedUpload(upload)}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 h-40">
                  {upload.type === "video" ? (
                    <video
                      src={upload.fileUrl}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLVideoElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <img
                      src={upload.fileUrl}
                      alt={upload.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(upload.status)}`}>
                      {getStatusLabel(upload.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{upload.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{upload.description}</p>

                  {/* Type Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">
                      {upload.type === "imagem" && "🖼️"}
                      {upload.type === "video" && "🎬"}
                      {upload.type === "avatar" && "🤖"}
                    </span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize">
                      {upload.type}
                    </span>
                  </div>

                  {/* AI Tools */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {JSON.parse(upload.aiTools || "[]").slice(0, 2).map((tool: string) => (
                      <span key={tool} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {tool}
                      </span>
                    ))}
                    {JSON.parse(upload.aiTools || "[]").length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{JSON.parse(upload.aiTools || "[]").length - 2}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUpload(upload);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedUpload} onOpenChange={(open) => !open && setSelectedUpload(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUpload && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUpload.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Media */}
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg overflow-hidden">
                  {selectedUpload.type === "video" ? (
                    <video
                      src={selectedUpload.fileUrl}
                      controls
                      className="w-full h-auto max-h-96"
                    />
                  ) : (
                    <img
                      src={selectedUpload.fileUrl}
                      alt={selectedUpload.title}
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <p className="text-gray-900 capitalize">{selectedUpload.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusBadge(selectedUpload.status)}`}>
                      {getStatusLabel(selectedUpload.status)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <p className="text-gray-900">{selectedUpload.description}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fonte de Inspiração</label>
                    <p className="text-gray-900">{selectedUpload.inspirationSource || "Não informada"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ferramentas de IA</label>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(selectedUpload.aiTools || "[]").map((tool: string) => (
                        <span key={tool} className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Moderation Notes */}
                {selectedUpload.status !== "pending" && selectedUpload.moderationNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Notas do Moderador
                    </label>
                    <p className="text-blue-800">{selectedUpload.moderationNotes}</p>
                  </div>
                )}

                {/* Moderation Form (only for pending) */}
                {selectedUpload.status === "pending" && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentários/Notas
                      </label>
                      <textarea
                        value={moderationNotes}
                        onChange={(e) => setModerationNotes(e.target.value)}
                        placeholder="Adicione comentários sobre a aprovação ou rejeição..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Aprovar
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Rejeitar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
