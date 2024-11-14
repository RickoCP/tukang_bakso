import React, { useState } from "react";
import FormField from "../molecules/FormField";
import SelectField from "../atoms/SelectField";
import Checkbox from "../atoms/Checkbox";
import { useApp } from "../../../../presentation/provider/AppProvider";

const VerificationForm = () => {
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
      alert("Anda harus menyetujui untuk membagikan lokasi sebelum melanjutkan.");
      return;
    }
    console.log("Name:", userName);
    console.log("Role:", currentRole);
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
    <form onSubmit={handleSubmit} className="form-container">
      <FormField
        label="Nama"
        id="name"
        type="text"
        value={userName}
        onChange={handleNameChange}
        placeholder="Masukkan nama"
        maxLength={60}
        required
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <SelectField
        id="role"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
        options={[
          { value: "customer", label: "Customer" },
          { value: "tukang", label: "Tukang" },
        ]}
        label="Role"
      />
      <Checkbox
        id="agreement"
        checked={isAgreed}
        onChange={() => setIsAgreed(!isAgreed)}
        label="Dengan menggunakan aplikasi ini Anda telah setuju untuk membagikan lokasi Anda kepada para tukang Bakso Keliling."
      />
      <button type="submit" className="btn-primary">
        Join
      </button>
    </form>
  );
};

export default VerificationForm;
