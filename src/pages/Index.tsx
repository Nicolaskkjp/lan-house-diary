import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, FileText, BarChart3, TrendingUp, Users, Clock } from "lucide-react";
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

const Index = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);

  useEffect(() => {
    const savedRelatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
    setRelatorios(savedRelatorios);
  }, []);

  const today = new Date().toDateString();
  const relatoriosHoje = relatorios.filter(r => 
    new Date(r.timestamp).toDateString() === today
  );

  const totalAtendimentos = relatorios.length;
  const atendimentosHoje = relatoriosHoje.length;
  const funcionariosAtivos = [...new Set(relatorios.map(r => r.funcionario))].length;
  const duracaoMedia = relatorios.length > 0 
    ? Math.round(relatorios.reduce((acc, r) => acc + parseInt(r.duracao), 0) / relatorios.length)
    : 0;

  const tiposPopulares = relatorios.reduce((acc, r) => {
    acc[r.tipoAtendimento] = (acc[r.tipoAtendimento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tipoMaisComum = Object.entries(tiposPopulares)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center bg-gradient-gaming rounded-lg p-8 text-white shadow-gaming">
          <Monitor className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Sistema de Relatórios - LanHouse Pro
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Gerencie e monitore todos os atendimentos da sua lan house
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/relatorio">
              <Button size="lg" variant="secondary" className="bg-white text-gaming-primary hover:bg-gray-100">
                <FileText className="h-5 w-5 mr-2" />
                Novo Relatório
              </Button>
            </Link>
            <Link to="/relatorios">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gaming-primary">
                <BarChart3 className="h-5 w-5 mr-2" />
                Ver Relatórios
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Atendimentos
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gaming-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-primary">{totalAtendimentos}</div>
              <p className="text-xs text-muted-foreground">
                Registros no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Atendimentos Hoje
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gaming-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-secondary">{atendimentosHoje}</div>
              <p className="text-xs text-muted-foreground">
                Registrados hoje
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Funcionários Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-gaming-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-success">{funcionariosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                Com atendimentos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Duração Média
              </CardTitle>
              <Clock className="h-4 w-4 text-gaming-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-warning">{duracaoMedia} min</div>
              <p className="text-xs text-muted-foreground">
                Por atendimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-gaming-primary" />
                <span>Tipo de Atendimento Mais Comum</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tipoMaisComum ? (
                <div className="space-y-3">
                  <Badge className="bg-gaming-primary text-white">
                    {tipoMaisComum[0]}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {tipoMaisComum[1]} atendimentos registrados
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nenhum atendimento registrado ainda
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gaming-secondary" />
                <span>Últimos Atendimentos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatorios.length > 0 ? (
                <div className="space-y-3">
                  {relatorios.slice(-3).reverse().map((relatorio) => (
                    <div key={relatorio.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{relatorio.cliente}</p>
                        <p className="text-sm text-muted-foreground">
                          {relatorio.funcionario}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{relatorio.duracao} min</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(relatorio.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    Nenhum atendimento registrado ainda
                  </p>
                  <Link to="/relatorio">
                    <Button size="sm" className="bg-gaming-primary hover:bg-gaming-primary/90">
                      Registrar Primeiro Atendimento
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
