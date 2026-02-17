import React, { useState } from 'react';
import api from '../services/api';

const Sandbox = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        type: 'success', // success, failed, timeout
        amount: '100',
        phone_number: '254700000000'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSimulate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const response = await api.post('/sandbox/simulate', formData);
            setResult({ success: true, data: response.data });
        } catch (error) {
            console.error("Simulation failed", error);
            setResult({ success: false, error: 'Simulation failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Sandbox Simulator</h1>
            <p className="mb-4 text-gray-600">Trigger fake payments to test your integration and webhooks.</p>

            <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg">
                <form onSubmit={handleSimulate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Simulation Type</label>
                        <select
                            name="type"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="success">Successful Payment (STK Push)</option>
                            <option value="failed">Failed Payment (Insufficient Funds/Users Cancelled)</option>
                            <option value="timeout">Timeout (User didn't respond)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
                        <input
                            type="number"
                            name="amount"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Test Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full
                            ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Simulating...' : 'Trigger Simulation'}
                    </button>
                </form>

                {result && (
                    <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <h4 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                            {result.success ? 'Simulation Triggered!' : 'Simulation Failed'}
                        </h4>
                        {result.success && (
                            <div className="mt-2 text-sm text-green-700">
                                <p>{result.data.message}</p>
                                <pre className="mt-2 text-xs bg-white p-2 rounded border border-green-200 overflow-auto">
                                    {JSON.stringify(result.data.transaction, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sandbox;
