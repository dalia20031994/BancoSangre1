// indicar el paso en el quwe se encuentra la edicion 
import React from 'react';
const Indicador = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div className="flex mb-6 space-x-4">
      {steps.map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div className="flex items-center">
              <div className={`h-1 w-8 ${currentStep >= step + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
export default Indicador;