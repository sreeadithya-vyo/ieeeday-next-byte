import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface PaymentProof {
  participant_name: string;
  participant_email: string;
  event_title: string;
  amount: number;
  transaction_id: string;
  proof_url: string;
  created_at: string;
}

export async function exportPaymentProofsToPDF(
  paymentProofs: PaymentProof[],
  filename: string
) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let isFirstPage = true;

  for (let i = 0; i < paymentProofs.length; i++) {
    const proof = paymentProofs[i];
    
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Payment Proof ${i + 1} of ${paymentProofs.length}`, margin, margin);

    // Add participant details
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    let yPosition = margin + 10;

    pdf.text(`Name: ${proof.participant_name}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Email: ${proof.participant_email}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Event: ${proof.event_title}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Amount: ₹${proof.amount}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Transaction ID: ${proof.transaction_id}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${new Date(proof.created_at).toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;

    // Add payment proof image
    try {
      const imageUrl = proof.proof_url.startsWith('http') 
        ? proof.proof_url 
        : supabase.storage.from('payment-proofs').getPublicUrl(proof.proof_url).data.publicUrl;

      // Fetch the image as blob
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Calculate image dimensions to fit within page
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageDataUrl;
      });

      const maxImageHeight = pageHeight - yPosition - margin;
      const maxImageWidth = contentWidth;
      
      let imageWidth = img.width;
      let imageHeight = img.height;
      
      // Scale down if needed
      const widthRatio = maxImageWidth / imageWidth;
      const heightRatio = maxImageHeight / imageHeight;
      const scale = Math.min(widthRatio, heightRatio, 1);
      
      imageWidth = imageWidth * scale;
      imageHeight = imageHeight * scale;

      // Convert pixels to mm (approximate)
      const mmWidth = imageWidth * 0.264583;
      const mmHeight = imageHeight * 0.264583;

      pdf.addImage(imageDataUrl, 'JPEG', margin, yPosition, 
        Math.min(mmWidth, contentWidth), 
        Math.min(mmHeight, maxImageHeight)
      );
    } catch (error) {
      console.error('Failed to add image to PDF:', error);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Failed to load payment proof image', margin, yPosition);
      pdf.setTextColor(0, 0, 0);
    }
  }

  // Save the PDF
  pdf.save(filename);
}
