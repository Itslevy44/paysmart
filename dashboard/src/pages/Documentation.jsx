import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';

const CodeBlock = ({ code, language }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    return (
        <div className="rounded-md overflow-hidden">
            <pre className="!m-0 !rounded-none">
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

const Documentation = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Documentation</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-900">1. Authentication</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        All API requests must be authenticated using your Project's API Keys.
                    </p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-4">
                    <p className="text-gray-700">
                        Include your <strong>Public Key</strong> in the <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">x-api-key</code> header.
                        <br />
                        <span className="text-sm text-gray-500">You can find your keys in the <strong>API Keys</strong> section of this dashboard.</span>
                    </p>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-900">2. Initiate Payment (STK Push)</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Endpoint to trigger an M-Pesa prompt on a customer's phone.
                    </p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                    <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                            POST
                        </span>
                        <span className="ml-2 text-gray-700 font-mono">https://paysmart-five.vercel.app/api/v1/transactions</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Request Payload</h3>
                            <CodeBlock language="json" code={`{
  "amount": 100,
  "phone_number": "254700000000",
  "reference": "YourRef123",
  "type": "mpesa"
}`} />
                            <h4 className="text-sm font-medium text-gray-900 mt-4">Parameters</h4>
                            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                                <li><strong>amount</strong>: (Number) Amount to charge.</li>
                                <li><strong>phone_number</strong>: (String) Customer phone (2547...).</li>
                                <li><strong>reference</strong>: (String) Your unique order ID.</li>
                                <li><strong>type</strong>: (String) Payment type (always "mpesa").</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Success Response (201 Created)</h3>
                            <CodeBlock language="json" code={`{
  "id": 42,
  "status": "pending",
  "amount": "100.00",
  "phone_number": "254700000000",
  "reference": "YourRef123",
  "checkout_request_id": "ws_CO_...",
  "created_at": "2023-10-27T10:00:00.000Z"
}`} />
                            <p className="mt-2 text-sm text-gray-500">
                                The status is initially <strong>pending</strong>. We will notify your webhook when it changes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-900">3. Webhook Notifications</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Receive real-time updates when a payment completes.
                    </p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                    <p className="text-gray-700">
                        Configure your Webhook URL in the <strong>Webhooks</strong> section. We send a POST request for every status change.
                    </p>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Webhook Payload</h3>
                        <CodeBlock language="json" code={`{
  "event": "payment.success",
  "data": {
    "id": 42,
    "status": "completed",
    "amount": "100.00",
    "reference": "YourRef123",
    "checkout_request_id": "ws_CO_...",
    "mpesa_receipt": "QWE123RTY"
  }
}`} />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Event Types</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li><code className="text-red-600">payment.success</code>: Transaction completed successfully.</li>
                            <li><code className="text-red-600">payment.failed</code>: Transaction failed (insufficient funds, cancelled, etc).</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-900">4. Code Examples</h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Node.js (Axios)</h3>
                    <CodeBlock language="javascript" code={`const axios = require('axios');

const pay = async () => {
  try {
    const response = await axios.post('https://paysmart-five.vercel.app/api/v1/transactions', {
      amount: 100,
      phone_number: '254712345678',
      reference: 'Order123',
      type: 'mpesa'
    }, {
      headers: {
        'x-api-key': 'pk_sandbox_your_public_key'
      }
    });

    console.log('Payment Initiated:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

pay();`} />
                </div>
            </div>

        </div>
    );
};

export default Documentation;
