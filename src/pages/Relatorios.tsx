import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Search, Calendar, User, Clock, FileText } from "lucide-react";
import Layout from "@/components/Layout";

interface Relatorio {
  id: number;
  funcionario: string;
  cliente: string;
  tipoAtendimento: string;
  descricao: string;
  duracao: string;
  timestamp: string;
}

const Relatorios = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [filtros, setFiltros] = useState({
    search: "",
    funcionario: "",
    tipo: "",
  });

  useEffect(() => {
    const savedRelatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
    setRelatorios(savedRelatorios);
  }, []);

  const relatoriosFiltrados = relatorios.filter((relatorio) => {
    const matchSearch = 
      relatorio.cliente.toLowerCase().includes(filtros.search.toLowerCase()) ||
      relatorio.descricao.toLowerCase().includes(filtros.search.toLowerCase());
    
    const matchFuncionario = 
      !filtros.funcionario || relatorio.funcionario === filtros.funcionario;
    
    const matchTipo = 
      !filtros.tipo || relatorio.tipoAtendimento === filtros.tipo;

    return matchSearch && matchFuncionario && matchTipo;
  });

  const funcionariosUnicos = [...new Set(relatorios.map(r => r.funcionario))];
  const tiposUnicos = [...new Set(relatorios.map(r => r.tipoAtendimento))];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR");
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      "Trocar óculos de realidade virtual": "bg-gaming-primary",
      "Trocar conta do PC": "bg-gaming-secondary", 
      "Ajudar cliente no PS5": "bg-gaming-success",
      "Ajudar no cockpit": "bg-gaming-warning",
      "Configurar jogo": "bg-blue-600",
      "Resolver problema técnico": "bg-red-600",
      "Orientação sobre equipamentos": "bg-purple-600",
      "Limpeza de equipamento": "bg-green-600",
      "Outros": "bg-gray-600"
    };
    return colors[tipo] || "bg-gray-600";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios de Atendimento</h1>
            <p className="text-muted-foreground">
              Total de {relatorios.length} atendimentos registrados
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-gaming-primary" />
            <span className="text-sm text-muted-foreground">
              {relatoriosFiltrados.length} resultados
            </span>
          </div>
        </div>

        {/* Filtros */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gaming-primary" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <Input
                  placeholder="Cliente ou descrição..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Funcionário</label>
                <Select 
                  value={filtros.funcionario} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, funcionario: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {funcionariosUnicos.map((funcionario) => (
                      <SelectItem key={funcionario} value={funcionario}>
                        {funcionario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Atendimento</label>
                <Select 
                  value={filtros.tipo} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {tiposUnicos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Relatórios */}
        <div className="grid gap-4">
          {relatoriosFiltrados.length === 0 ? (
            <Card className="bg-gradient-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum relatório encontrado
                </p>
                <p className="text-sm text-muted-foreground">
                  {relatorios.length === 0 
                    ? "Registre seu primeiro atendimento!" 
                    : "Tente ajustar os filtros de busca"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            relatoriosFiltrados.map((relatorio) => (
              <Card key={relatorio.id} className="bg-gradient-card border-border hover:shadow-gaming transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <User className="h-4 w-4 text-gaming-primary" />
                        <span>Cliente: {relatorio.cliente}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{relatorio.funcionario}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(relatorio.timestamp)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{relatorio.duracao} min</span>
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getTipoColor(relatorio.tipoAtendimento)} text-white`}>
                      {relatorio.tipoAtendimento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{relatorio.descricao}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Relatorios;