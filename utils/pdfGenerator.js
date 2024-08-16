import { jsPDF } from 'jspdf';

export const generatePDF = (staffName, qrCodeData) => {
  const doc = new jsPDF();
  doc.text(`Staff Name: ${staffName}`, 10, 10);
  doc.addImage(qrCodeData, 'PNG', 10, 20, 50, 50);
  doc.save(`${staffName}_QRCode.pdf`);
};
