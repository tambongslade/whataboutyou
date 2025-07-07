const fetch = require('node-fetch');

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function sendTestEmail() {
  const testRegistration = {
    situation: "rouge",
    nom: "Test",
    prenom: "User",
    age: "25",
    numeroTelephone: "+237123456789",
    email: "tambongslade17@gmail.com",
    quartier: "Test Quarter",
    statut: "etudiant",
    organisation: "Test Organization",
    aDejaParticipe: "non",
    nationalite: "Camerounaise"
  };

  try {
    console.log('🚀 Sending test registration to trigger email...');
    console.log('🌐 Using API URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRegistration)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ Test registration successful!');
    console.log('📧 Email sent to: tambongslade17@gmail.com');
    console.log('🎫 Registration Number:', result.registrationNumber);
    console.log('📋 Check your email for the confirmation!');
    
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
}

sendTestEmail(); 