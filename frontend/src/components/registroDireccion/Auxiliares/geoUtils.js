/*  Para que no se pueda ir fuera de oaxaca*/ 
export const estaDentroDeOaxaca = (lat, lng) => {
  return (
    lat >= 15.65 && lat <= 18.65 && 
    lng >= -98.53 && lng <= -93.87  
  );
};