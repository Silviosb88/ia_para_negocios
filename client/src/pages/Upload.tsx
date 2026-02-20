import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload as UploadIcon, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

type UploadType = "imagem" | "video" | "avatar";

const AI_TOOLS = [
  "DALL-E",
  "Midjourney",
  "Stable Diffusion",
  "ChatGPT",
  "Claude",
  "Copilot",
  "Leonardo AI",
  "Runway",
  "HeyGen",
  "D-ID",
  "Synthesia",
  "Outro",
];

export default function Upload() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "imagem" as UploadType,
    aiTools: [] as string[],
    inspirationSource: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createUploadMutation = trpc.uploads.create.useMutation();

  // Redirecionar se não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para fazer upload</CardDescription>
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

  const handleFileSelect = (selectedFile: File) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      setErrorMessage("Arquivo muito grande (máximo 100MB)");
      setErrorDialog(true);
      return;
    }

    setFile(selectedFile);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const toggleAITool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      aiTools: prev.aiTools.includes(tool)
        ? prev.aiTools.filter((t) => t !== tool)
        : [...prev.aiTools, tool],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Por favor, selecione um arquivo");
      setErrorDialog(true);
      return;
    }

    if (!formData.title.trim()) {
      setErrorMessage("Por favor, insira um título");
      setErrorDialog(true);
      return;
    }

    if (formData.aiTools.length === 0) {
      setErrorMessage("Por favor, selecione pelo menos uma ferramenta de IA");
      setErrorDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];

        try {
          const result = await createUploadMutation.mutateAsync({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            aiTools: formData.aiTools,
            inspirationSource: formData.inspirationSource,
            fileData: base64,
            fileName: file.name,
            mimeType: file.type,
          });

          if (result.success) {
            setSuccessDialog(true);
            // Limpar formulário
            setFormData({
              title: "",
              description: "",
              type: "imagem",
              aiTools: [],
              inspirationSource: "",
            });
            setFile(null);
            setPreview("");
          }
        } catch (error: any) {
          setErrorMessage(error.message || "Erro ao fazer upload");
          setErrorDialog(true);
        } finally {
          setIsSubmitting(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao processar arquivo");
      setErrorDialog(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compartilhe seu Trabalho com IA</h1>
          <p className="text-lg text-gray-600">
            Envie suas criações geradas com ferramentas de IA para nossa galeria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>1. Selecione seu Arquivo</CardTitle>
              <CardDescription>Imagem, vídeo ou avatar (máximo 100MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept="image/*,video/*"
                  className="hidden"
                />

                {preview ? (
                  <div className="space-y-4">
                    {formData.type === "video" ? (
                      <video src={preview} className="max-h-48 mx-auto rounded" controls />
                    ) : (
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                    )}
                    <p className="text-sm text-gray-600">{file?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview("");
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Trocar arquivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-700">Arraste seu arquivo aqui</p>
                    <p className="text-sm text-gray-500">ou clique para selecionar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle>2. Tipo de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {(["imagem", "video", "avatar"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === type
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {type === "imagem" && "🖼️"}
                      {type === "video" && "🎬"}
                      {type === "avatar" && "🤖"}
                    </div>
                    <p className="font-medium capitalize">{type}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações */}
          <Card>
            <CardHeader>
              <CardTitle>3. Informações do Trabalho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Paisagem Futurista com IA"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva seu trabalho..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte de Inspiração
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Referência de um artista, conceito, etc"
                  value={formData.inspirationSource}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      inspirationSource: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Ferramentas de IA */}
          <Card>
            <CardHeader>
              <CardTitle>4. Ferramentas de IA Utilizadas *</CardTitle>
              <CardDescription>Selecione todas as ferramentas usadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AI_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleAITool(tool)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      formData.aiTools.includes(tool)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {formData.aiTools.includes(tool) && (
                      <Check className="w-4 h-4 inline mr-1" />
                    )}
                    {tool}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Enviar para Moderação
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="px-8"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              Upload Enviado com Sucesso!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Seu trabalho foi enviado para moderação. Você receberá uma notificação quando for
              aprovado.
            </p>
            <Button
              onClick={() => {
                setSuccessDialog(false);
                navigate("/");
              }}
              className="w-full"
            >
              Voltar para Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Erro ao Enviar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{errorMessage}</p>
            <Button onClick={() => setErrorDialog(false)} className="w-full">
              Tentar Novamente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
