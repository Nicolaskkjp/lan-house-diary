import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, FileText, BarChart3, TrendingUp, Users, Award } from "lucide-react";
import Layout from "@/components/Layout";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";

interface Relatorio {
  id: number;
  funcionario: string;
  tipoAtendimento: string;
  descricao: string;
  horarioEnvio: string;
}

const Index = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);

  useEffect(() => {
    const savedRelatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
    setRelatorios(savedRelatorios);
  }, []);

  const today = new Date().toDateString();
  const relatoriosHoje = relatorios.filter(r => 
    new Date(r.horarioEnvio).toDateString() === today
  );

  const totalAtendimentos = relatorios.length;
  const atendimentosHoje = relatoriosHoje.length;
  const funcionariosAtivos = [...new Set(relatorios.map(r => r.funcionario))].length;

  // Data for charts
  const relatoriosPorAtendente = relatorios.reduce((acc, r) => {
    if (r.funcionario) {
      acc[r.funcionario] = (acc[r.funcionario] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const tiposPorAtendimento = relatorios.reduce((acc, r) => {
    if (r.tipoAtendimento) {
      acc[r.tipoAtendimento] = (acc[r.tipoAtendimento] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Chart data preparation
  const pieChartData = Object.entries(relatoriosPorAtendente).map(([nome, quantidade]) => ({
    name: nome,
    value: quantidade,
    fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  const barChartData = Object.entries(tiposPorAtendimento)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([tipo, quantidade]) => ({
      tipo: tipo.length > 20 ? tipo.substring(0, 17) + "..." : tipo,
      quantidade
    }));

  // Line chart data (last 7 days)
  const getLast7DaysData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = relatorios.filter(r => new Date(r.horarioEnvio).toDateString() === dateStr).length;
      last7Days.push({
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        atendimentos: count
      });
    }
    return last7Days;
  };

  const lineChartData = getLast7DaysData();

  // Attendant of the week
  const getAtendenteDaSemana = () => {
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
    
    const relatoriosDaSemana = relatorios.filter(r => 
      new Date(r.horarioEnvio) >= umaSemanaAtras
    );
    
    const atendentesContagem = relatoriosDaSemana.reduce((acc, r) => {
      if (r.funcionario) {
        acc[r.funcionario] = (acc[r.funcionario] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const [nomeAtendente, quantidade] = Object.entries(atendentesContagem)
      .sort(([,a], [,b]) => b - a)[0] || ["Nenhum", 0];
    
    return { nome: nomeAtendente, quantidade };
  };

  const atendenteDaSemana = getAtendenteDaSemana();

  const chartConfig = {
    atendimentos: {
      label: "Atendimentos",
      color: "hsl(var(--chart-1))",
    },
    quantidade: {
      label: "Quantidade",
      color: "hsl(var(--chart-2))",
    },
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>

        {/* Attendant of the Week Highlight */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-gaming-warning" />
              <span>Atendente Destaque da Semana</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-primary mb-2">
                {atendenteDaSemana.nome}
              </div>
              <p className="text-muted-foreground">
                com {atendenteDaSemana.quantidade} atendimentos esta semana
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Reports by Attendant */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gaming-primary" />
                <span>Relatórios por Atendente</span>
              </CardTitle>
              <CardDescription>
                Mostra a quantidade de relatórios feitos por cada atendente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart - Service Types */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gaming-secondary" />
                <span>Tipos de Atendimento Mais Comuns</span>
              </CardTitle>
              <CardDescription>
                Exibe os tipos de atendimento mais frequentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {barChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="tipo" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="quantidade" fill="hsl(var(--gaming-secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Line Chart - Attendance Evolution */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gaming-success" />
              <span>Atendimentos por Dia</span>
            </CardTitle>
            <CardDescription>
              Visualiza o número de atendimentos por dia ao longo da última semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lineChartData.some(d => d.atendimentos > 0) ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="atendimentos" 
                      stroke="hsl(var(--gaming-success))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--gaming-success))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum atendimento registrado nos últimos 7 dias
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
