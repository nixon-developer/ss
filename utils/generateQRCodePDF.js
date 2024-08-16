import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

export const generateQRCodePDF = async (staffId) => {
  const qrCodeData = await QRCode.toBuffer(staffId);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 600]);
  const qrImage = await pdfDoc.embedPng(qrCodeData);
  
  page.drawImage(qrImage, {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
  });
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
