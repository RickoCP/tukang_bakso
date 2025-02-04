import React, { useState } from "react";
// import MapTemplate from "../presentation/components/atomicDesign/templates/MapTemplate";
import { useApp } from "../presentation/provider/AppProvider";

import dynamic from 'next/dynamic';

const MapTemplate = dynamic(() => import('../presentation/components/atomicDesign/templates/MapTemplate'), {
  ssr: false,
});


const MapPage = () => {
  const { closeApp,bottomSheetText } = useApp();
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setIsSheetVisible(!isSheetVisible);
  };

  return (
    <MapTemplate
      toggleBottomSheet={toggleBottomSheet}
      isSheetVisible={isSheetVisible}
      closeApp={closeApp}
      bottomSheetText={bottomSheetText}
    />
  );
};

export default MapPage;
