"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { StaticIP } from "@/config/staticip";

const VenteBoissonJour = () => {
  const [ventes, setVentes] = useState([]);
  const [montantGlobal, setMontantGlobal] = useState(0);

  useEffect(() => {
    axios.get(`${StaticIP}api/vente/ventes-boisson-du-jour`)
      .then(response => {
        setVentes(response.data.ventes);
        setMontantGlobal(response.data.montantGlobal);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des ventes", error);
      });
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Désignation</th>
            <th className="border p-2 text-center">Qté Totale Vendue</th>
            <th className="border p-2 text-center">Montant Total</th>
          </tr>
        </thead>
        <tbody>
          {ventes.length > 0 ? (
            ventes.map((vente, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{vente["produit.designation"]} - {vente["produit.unite"]}</td>
                <td className="border p-2 text-center">{vente.quantiteTotale}</td>
                <td className="border p-2 text-center">{vente.montantTotal.toLocaleString()} </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">Aucune vente enregistrée</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-bold">
            <td className="border p-2 text-right" colSpan="2"><b>Montant Total :</b></td>
            <td className="border p-2 text-center"><b>{montantGlobal.toLocaleString()}</b></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default VenteBoissonJour;
