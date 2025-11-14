import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const FirebaseTest = () => {
  const [status, setStatus] = useState<string>('Not tested yet');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setError(null);
    setStatus('Testing...');

    try {
      // Test 1: Check if db is initialized
      if (!db) {
        throw new Error('Firebase db is not initialized');
      }
      setStatus('✓ Firebase db initialized');

      // Test 2: Try to write a test document
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test submission'
      };

      const docRef = await addDoc(collection(db, 'surveys'), testData);
      setStatus(`✓ Successfully connected! Document ID: ${docRef.id}`);

    } catch (err: any) {
      console.error('Firebase test error:', err);
      setError(err.message || 'Unknown error');
      setStatus('✗ Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Firebase Connection Test
        </h1>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Status:</h3>
            <p className={`text-lg ${status.includes('✓') ? 'text-green-600' : status.includes('✗') ? 'text-red-600' : 'text-gray-700'}`}>
              {status}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Error Details:</h3>
              <p className="text-red-700 font-mono text-sm break-all">{error}</p>

              <div className="mt-4 text-sm text-red-800">
                <p className="font-semibold mb-2">Common Issues:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Missing Firebase credentials in .env file</li>
                  <li>Invalid Firebase project configuration</li>
                  <li>Firestore not enabled in Firebase Console</li>
                  <li>Incorrect security rules</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            </div>
          )}

          <button
            onClick={testFirebaseConnection}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Testing...
              </div>
            ) : (
              'Test Firebase Connection'
            )}
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Setup Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-yellow-800">
              <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.firebase.google.com</a></li>
              <li>Enable Firestore Database in your Firebase project</li>
              <li>Copy your Firebase config credentials</li>
              <li>Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your credentials to the .env file (see .env.example)</li>
              <li>Restart the dev server</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Current Firebase Config Check:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify({
                hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
                hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
                hasStorageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                hasMessagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
              }, null, 2)}
            </pre>
          </div>

          <a
            href="/#/"
            className="block text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
