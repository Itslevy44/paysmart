import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Settings = () => {
    const [settlementNumber, setSettlementNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setSettlementNumber(res.data.settlement_number || '');
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.put('/auth/settings', { settlement_number: settlementNumber });
            setMessage('Settings updated successfully');
        } catch (err) {
            console.error(err);
            setMessage('Failed to update settings');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg max-w-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="settlementNumber" className="block text-sm font-medium text-gray-700">
                                Settlement Number (Till / Paybill / Phone)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="settlementNumber"
                                    id="settlementNumber"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="e.g. 174379"
                                    value={settlementNumber}
                                    onChange={(e) => setSettlementNumber(e.target.value)}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                This is where your funds will be settled manually or automatically.
                            </p>
                        </div>
                        <div className="mt-5">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Save Settings
                            </button>
                        </div>
                        {message && (
                            <div className={`mt-3 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
