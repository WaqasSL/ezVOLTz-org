import React, { useState } from "react";

const useDisplayModal = (intialDisplay) => {
  const [isVisible, setIsVisible] = useState(intialDisplay);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  return [isVisible, toggleModal];
};

export default useDisplayModal;
