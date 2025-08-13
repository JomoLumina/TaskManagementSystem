import React from "react";

const LoadingProgress: React.FC = () => {
  return (
    <div className="loading-progress">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingProgress;
