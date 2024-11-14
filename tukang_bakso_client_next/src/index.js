import React, { useState } from "react";
import { useApp } from "../presentation/provider/AppProvider";

export default function Verification() {
  const {
    initUserLocation,
    setCurrentRole,
    setUserName,
    currentRole,
    userName,
  } = useApp();

  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAgreed) {
      alert(
        "Anda harus menyetujui untuk membagikan lokasi sebelum melanjutkan."
      );
      return;
    }
    console.log("Name:", userName);
    console.log("Role:", currentRole);
    // Lakukan sesuatu dengan data yang dikirim
    initUserLocation();
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 60) {
      setUserName(value);
      setErrorMessage("");
    } else {
      setErrorMessage("Nama tidak boleh lebih dari 30 karakter.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-4">
          <img
            src="/images/verification.png"
            alt="Verifikasi"
            className="h-24 w-24"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verifikasi
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Masukkan nama dan role Anda di bawah ini:
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={handleNameChange}
              maxLength={60} // Batas maksimal 10 karakter
              placeholder="Masukkan nama"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Pilih Role</option>
              <option value="customer">Customer</option>
              <option value="tukang">Tukang</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Join
          </button>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreement"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              required
            />
            <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
              Dengan menggunakan aplikasi ini Anda telah setuju untuk membagikan
              lokasi Anda kepada para tukang Bakso Keliling.
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
