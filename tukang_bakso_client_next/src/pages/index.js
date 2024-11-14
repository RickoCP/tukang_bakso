import React from "react";
import VerificationForm from "../presentation/components/atomicDesign/organisms/VerificationForm";

const Verification = () => (
  <div className="container-verification">
    <div className="flex justify-center mb-4">
      <img
        src="/images/verification.png"
        alt="Verifikasi"
        className="verification-image"
      />
    </div>
    <h1 className="verification-title">
      Verifikasi
    </h1>
    <p className="verification-description">
      Masukkan nama dan role Anda di bawah ini:
    </p>
    <div className="verification-card">
      <VerificationForm />
    </div>
  </div>
);

export default Verification;
