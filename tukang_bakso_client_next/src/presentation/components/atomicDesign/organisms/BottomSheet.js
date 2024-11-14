import React from "react";

const BottomSheet = ({
  isVisible,
  closeApp,
  toggleBottomSheet,
  bottomSheetText,
}) => {
  return (
    <div
      className={`container-modal ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex-center">
        <div className="h-1 w-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="flex-center">
        <img
          src="/images/close_alert.png"
          alt="Warning"
          className="img-center"
        />
      </div>
      <p className="text-center text-gray-700 mb-6">{bottomSheetText}</p>
      <div className="flex flex-col gap-2">
        <div onClick={closeApp} className="btn-primary">
          OK
        </div>
        <div onClick={toggleBottomSheet} className="btn-secondary">
          Batal
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
