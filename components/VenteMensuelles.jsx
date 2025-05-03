"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { StaticIP } from "@/config/staticip";

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VenteMensuelle = () => {
  const [data, setData] = useState(Array(12).fill(0)); // Par défaut, tous les mois sont à 0

  useEffect(() => {
    axios.get(`${StaticIP}api/vente/ventes-par-mois`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des ventes", error);
      });
  }, []);

  // Labels des mois
  const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  // Configuration des données du graphique
  const chartData = {
    labels,
    datasets: [
      {
        label: "Montant total des ventes",
        data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
};

export default VenteMensuelle;
