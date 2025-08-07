import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, User, Clock, Tag } from "lucide-react";
import Layout from "@/components/Layout";

const NovoRelatorio = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const tiposAtendimento = [
    "Trocar óculos de realidade virtual",
    "Trocar conta do PC", 
    "Ajudar cliente no PS5",
    "Ajudar no cockpit",
    "Configurar jogo",
    "Resolver problema técnico",
    "Orientação sobre equipamentos",
    "Limpeza de equipamento",
    "Outros"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const relatorio = {
      funcionario: formData.get("funcionario"),
      tipoAtendimento: formData.get("tipoAtendimento"),
      descricao: formData.get("descricao"),
      horarioEnvio: new Date().toISOString(),
    };

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Salvar no localStorage por enquanto
    const relatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
    relatorios.push({ ...relatorio, id: Date.now() });
    localStorage.setItem("relatorios", JSON.stringify(relatorios));

    toast({
      title: "Relatório salvo com sucesso!",
      description: "O atendimento foi registrado no sistema.",
    });

    // Limpar formulário
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Novo Relatório de Atendimento</h1>
          <p className="text-muted-foreground">Registre o atendimento realizado ao cliente</p>
        </div>

        <Card className="bg-gradient-card border-border shadow-gaming">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gaming-primary" />
              <CardTitle className="text-foreground">Dados do Atendimento</CardTitle>
            </div>
            <CardDescription>
              Preencha todos os campos para registrar o atendimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="funcionario" className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gaming-primary" />
                    <span>Nome do Atendente</span>
                  </Label>
                  <Input
                    id="funcionario"
                    name="funcionario"
                    placeholder="Seu nome"
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoAtendimento" className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gaming-primary" />
                  <span>Tipo de Atendimento</span>
                </Label>
                <Select name="tipoAtendimento" required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o tipo de atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAtendimento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva o que foi feito durante o atendimento..."
                  rows={4}
                  required
                  className="bg-background"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-gaming hover:opacity-90 shadow-gaming"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Relatório"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NovoRelatorio;