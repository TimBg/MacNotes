export const convertToHHMM = (timestamp: number): string => {
  const date: Date = new Date(timestamp);

  return (
    date.getHours().toString().padStart(2, '0') + 
    ":" +
    date.getMinutes().toString().padStart(2, '0')
  );
};

export const toStandardDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 
  const hours = String(date.getHours()).padStart(2, '0'); 
  const minutes = String(date.getMinutes()).padStart(2, '0'); 
  const seconds = String(date.getSeconds()).padStart(2, '0'); 

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}