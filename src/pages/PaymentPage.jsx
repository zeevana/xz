import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const { amount = 0, type = "Unknown" } = location.state || {};

  const handlePayment = async () => {
    try {
      if (amount <= 0) {
        alert("Jumlah pembayaran tidak valid.");
        return;
      }
  
      console.log("Sending request to API with:", { amount, type });
  
      const response = await axios.post("/api/transaction", {
        totalAmount: amount,
        type: type,
      });
  
      const snapToken = response.data.token;
  
      if (!snapToken) {
        alert("Gagal mendapatkan token pembayaran.");
        return;
      }
  
      window.snap.pay(snapToken, {
        onSuccess: (result) => alert("Transaksi berhasil! " + JSON.stringify(result)),
        onPending: (result) => alert("Transaksi pending: " + JSON.stringify(result)),
        onError: (result) => alert("Terjadi kesalahan: " + JSON.stringify(result)),
        onClose: () => alert("Pembayaran dibatalkan"),
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Gagal membuat transaksi.");
    }
  };
  

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client--jucMGGRSNhaA_C1"); // Ganti dengan client key Anda
    script.async = true;

    script.onload = () => console.log("Snap.js berhasil dimuat");
    script.onerror = () => console.error("Snap.js gagal dimuat");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="payment-container">
      <h1>Pembayaran</h1>
      <div>
        <p><b>Tipe Produk:</b> {type}</p>
        <p><b>Total Pembayaran:</b> Rp {amount.toLocaleString("id-ID")}</p>
        <button onClick={handlePayment}>Bayar Sekarang</button>
      </div>
    </div>
  );
};

export default PaymentPage;
