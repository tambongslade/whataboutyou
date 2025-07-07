// Email service interface - will need backend implementation
export interface EmailService {
  sendConfirmationEmail(email: string, registrationNumber: string, userData: any): Promise<boolean>;
}

// Email template interface
export interface ConfirmationEmailData {
  recipientEmail: string;
  recipientName: string;
  registrationNumber: string;
  conferenceDate: string;
  venue: string;
  situation: string;
}

// This will be implemented on your backend
export const sendConfirmationEmail = async (emailData: ConfirmationEmailData): Promise<boolean> => {
  try {
    // This should call your backend API endpoint
    const response = await fetch('/api/send-confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

// Email template content (will be used by backend)
export const getEmailTemplate = (data: ConfirmationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Confirmation d'inscription - What About You</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ff6b35;">What About You 2024</h1>
                <h2 style="color: #333;">Confirmation d'inscription</h2>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #ff6b35;">Bonjour ${data.recipientName}!</h3>
                <p>Votre inscription à la conférence What About You a été confirmée avec succès.</p>
                
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <strong>Votre numéro d'inscription: ${data.registrationNumber}</strong>
                </div>
                
                <h4>Détails de l'événement:</h4>
                <ul>
                    <li><strong>Date:</strong> ${data.conferenceDate}</li>
                    <li><strong>Lieu:</strong> ${data.venue}</li>
                    <li><strong>Votre catégorie:</strong> ${data.situation.toUpperCase()}</li>
                </ul>
                
                <p style="margin-top: 20px;">
                    <strong>Important:</strong> Veuillez conserver ce numéro d'inscription. 
                    Il vous sera demandé le jour de l'événement.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
                <p>À bientôt à What About You 2024!</p>
                <p>L'équipe What About You</p>
                <p style="font-size: 12px;">
                    Pour toute question: whatabout.officiel@gmail.com<br>
                    Tél: +237 6 91 94 58 95
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}; 