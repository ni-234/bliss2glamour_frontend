import React from "react";

interface ClickOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const ClickOverlay: React.FC<ClickOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/0 z-30 cursor-default"
      onClick={onClose}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default ClickOverlay;
