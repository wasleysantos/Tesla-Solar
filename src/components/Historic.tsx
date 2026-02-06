import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
} from "lucide-react";
import jsPDF from "jspdf";

interface HistoricProps {
  cpf: string;
}

export function Historic({ cpf }: HistoricProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!cpf) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("measurements")
        .select("*")
        .eq("user_cpf", cpf)
        .order("timestamp", { ascending: false })
        .limit(20);

      if (data) setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, [cpf]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Energia - Laboratório Tesla", 14, 20);
    doc.setFontSize(10);
    doc.text(`Cliente CPF: ${cpf}`, 14, 30);

    let y = 45;
    history.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleString("pt-BR");
      // ✅ PDF agora detalhado com os valores reais
      doc.text(
        `${date} - Tens: ${item.voltage}V | Gen: ${item.solar_generation}kW | Cons: ${item.house_consumption}kW`,
        14,
        y,
      );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`historico-${cpf}.pdf`);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-white animate-pulse">
        Consultando banco de dados...
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Histórico Real</h2>
          <div className="flex items-center gap-2 text-green-400 text-xs mt-1">
            <User className="w-3 h-3" />
            <span>{cpf || "Nenhum cliente selecionado"}</span>
          </div>
        </div>
        <button
          onClick={exportToPDF}
          disabled={!cpf || history.length === 0}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
      </div>

      {!cpf ? (
        <div className="bg-[#1a2942] rounded-2xl p-10 text-center border border-dashed border-gray-700">
          <p className="text-gray-500">Selecione um CPF no Painel Geral.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-[10px] uppercase font-bold">
                  Geração Solar
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {history[0]?.solar_generation || 0}{" "}
                <span className="text-xs font-normal text-gray-400">kW</span>
              </p>
            </div>

            <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-[10px] uppercase font-bold">
                  Carga Casa
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {history[0]?.house_consumption || 0}{" "}
                <span className="text-xs font-normal text-gray-400">kW</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a2942] rounded-xl p-4 border-l-4 border-green-500 hover:bg-[#233554] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {new Date(item.timestamp).toLocaleTimeString("pt-BR")}
                      </h3>
                      <p className="text-gray-500 text-[10px]">
                        Tensão: {item.voltage}V
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* ✅ Cálculo do saldo instantâneo por linha */}
                    <p className="text-white font-bold text-xs">
                      Saldo:{" "}
                      {(
                        (item.solar_generation || 0) -
                        (item.house_consumption || 0)
                      ).toFixed(2)}{" "}
                      kW
                    </p>
                    <p className="text-green-400 text-[10px]">
                      In: {item.solar_generation} kW
                    </p>
                    <p className="text-blue-400 text-[10px]">
                      Out: {item.house_consumption} kW
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
