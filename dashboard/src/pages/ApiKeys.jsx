import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ApiKeys = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchKeys = async () => {
        try {
            const response = await api.get('/api-keys');
            setKeys(response.data);
        } catch (error) {
            console.error("Failed to fetch API keys", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleRegenerate = async (type, environment) => {
        if (!window.confirm(`Are you sure you want to regenerate the ${environment} ${type} key? The old key will stop working immediately.`)) {
            return;
        }

        try {
            const response = await api.post('/api-keys/regenerate', { type, environment });
            // Update local state: replace the old key or add the new one
            // Refresh list to be safe
            fetchKeys();
            alert('Key regenerated successfully. Make sure to copy your new secret key!');
        } catch (error) {
            console.error("Failed to regenerate key", error);
            alert("Failed to regenerate key");
        }
    };

    if (loading) return <div>Loading API keys...</div>;

    const sandboxKeys = keys.filter(k => k.environment === 'sandbox');
    // const liveKeys = keys.filter(k => k.environment === 'live'); // For future use

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">API Keys</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Sandbox Environment</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Use these keys for testing and integration.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {sandboxKeys.map((key) => (
                            <div key={key.id} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 capitalize">{key.key_type} Key</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                                    <span className="font-mono bg-gray-50 px-2 py-1 rounded">
                                        {key.key_type === 'secret' ? (
                                            '•'.repeat(20) + (key.key_value ? key.key_value.slice(-4) : '') // Simplified masking
                                        ) : (
                                            key.key_value
                                        )}
                                        {/* TODO: Add "Reveal" button for secret key logic */}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(key.key_value)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                        >
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => handleRegenerate(key.key_type, key.environment)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg opacity-50">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Live Environment</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Live keys will be available after KYC approval.</p>
                </div>
            </div>
        </div>
    );
};

export default ApiKeys;
