import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Webhooks = () => {
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        url: '',
        events: ['payment.success', 'payment.failed'], // Default events
        environment: 'sandbox'
    });

    const fetchWebhooks = async () => {
        try {
            const response = await api.get('/api/webhooks'); // Use absolute path if baseURL issue, but relative should work
            setWebhooks(response.data);
        } catch (error) {
            console.error("Failed to fetch webhooks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fix for double slash issue if present in api.js, let's just use /webhooks based on baseURL
        const fetch = async () => {
            try {
                const response = await api.get('/webhooks');
                setWebhooks(response.data);
            } catch (error) {
                console.error("Failed to fetch webhooks", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/webhooks', formData);
            setFormData({ ...formData, url: '' }); // Reset URL
            const fetch = async () => {
                const response = await api.get('/webhooks');
                setWebhooks(response.data);
            };
            fetch();
            alert('Webhook added successfully');
        } catch (error) {
            console.error("Failed to add webhook", error);
            alert("Failed to add webhook");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/webhooks/${id}`);
            setWebhooks(webhooks.filter(w => w.id !== id));
        } catch (error) {
            console.error("Failed to delete webhook", error);
        }
    };

    if (loading) return <div>Loading webhooks...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Webhooks</h1>

            <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Endpoint</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">Endpoint URL</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="https://your-api.com/webhook"
                            value={formData.url}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="environment" className="block text-sm font-medium text-gray-700">Environment</label>
                        <select
                            name="environment"
                            id="environment"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.environment}
                            onChange={handleChange}
                        >
                            <option value="sandbox">Sandbox</option>
                            <option value="live" disabled>Live (Coming Soon)</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Webhook
                    </button>
                </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secret</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Env</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {webhooks.map((webhook) => (
                            <tr key={webhook.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{webhook.url}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{webhook.events.join(', ')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {webhook.secret.slice(0, 10)}...
                                    <button
                                        onClick={() => navigator.clipboard.writeText(webhook.secret)}
                                        className="ml-2 text-indigo-600 hover:text-indigo-900 text-xs"
                                    >
                                        Copy
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{webhook.environment}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(webhook.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {webhooks.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No webhooks configured.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Webhooks;
