import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Documentation = () => {
    return (
        <div>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Developer Documentation</h1>
                        <p className="mt-4 text-lg text-gray-500">Integrate PaySmart payments into your application in minutes.</p>
                    </div>

                    <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-xl leading-6 font-medium text-gray-900">Authentication</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Authenticate your requests using your API Keys from the Dashboard.
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6 space-y-4">
                            <p className="text-gray-700">
                                Include your API Key in the <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">x-api-key</code> header of every request.
                            </p>
                            <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                <code className="text-green-400">
                                    curl -X POST https://paysmart-five.vercel.app/api/v1/transactions \<br />
                                    &nbsp;&nbsp;-H "x-api-key: pk_sandbox_..." \<br />
                                    &nbsp;&nbsp;-H "Content-Type: application/json" ...
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-xl leading-6 font-medium text-gray-900">Initiate Payment (STK Push)</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Trigger an M-Pesa prompt on your customer's phone.
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6 space-y-4">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                    POST
                                </span>
                                <span className="ml-2 text-gray-700 font-mono">/api/v1/transactions</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Request Body</h3>
                                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                                        {`{
  "amount": 100,
  "phone_number": "254700000000",
  "reference": "Order123",
  "type": "mpesa"
}`}
                                    </pre>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Response</h3>
                                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                                        {`{
  "id": 42,
  "status": "pending",
  "amount": "100.00",
  "reference": "Order123",
  ...
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-xl leading-6 font-medium text-gray-900">Webhooks</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Receive real-time updates when a payment completes.
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6 space-y-4">
                            <p className="text-gray-700">
                                Configure your webhook URL in the <a href="https://paysmart-dashboard.vercel.app/webhooks" className="text-indigo-600 hover:underline">Dashboard</a>.
                                We will send a POST request with the transaction details upon completion.
                            </p>
                            <h3 className="text-sm font-medium text-gray-900">Payload Example</h3>
                            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                                {`{
  "event": "payment.success",
  "data": {
    "id": 42,
    "status": "completed",
    "amount": "100.00",
    "reference": "Order123",
    "mpesa_receipt": "QWE123RTY"
  }
}`}
                            </pre>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Documentation;
