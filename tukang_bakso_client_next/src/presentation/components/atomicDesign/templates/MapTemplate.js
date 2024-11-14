import React from "react";
import MapView from "../organisms/MapView";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import BottomSheet from "../organisms/BottomSheet"; // Import komponen BottomSheet

const MapTemplate = ({
  toggleBottomSheet,
  isSheetVisible,
  closeApp,
  bottomSheetText,
}) => (
  <div className="relative min-h-screen">
    <div
      className="absolute top-0 left-0 w-full h-full bg-gray-300 z-0"
    >
      <MapView />
    </div>
    <Button
      onClick={toggleBottomSheet}
      className="absolute top-4 right-4 bg-white z-20 rounded-full "
    >
      <Icon className="w-6 h-6 text-gray-800" />
    </Button>
    {/* Gunakan komponen BottomSheet */}
    <BottomSheet
      isVisible={isSheetVisible}
      closeApp={closeApp}
      toggleBottomSheet={toggleBottomSheet}
      bottomSheetText={bottomSheetText}
    />
  </div>
);

export default MapTemplate;
