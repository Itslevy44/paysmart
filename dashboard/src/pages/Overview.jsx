import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Overview = () => {
    const [stats, setStats] = useState({
        totalVolume: 0,
        successRate: 0,
        activeWebhooks: 0,
        walletBalance: 0
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile for Wallet Balance
                const profileRes = await api.get('/auth/profile');

                const txRes = await api.get('/transactions');
                const webhooksRes = await api.get('/webhooks');

                const txs = txRes.data;
                const totalVol = txs.reduce((acc, curr) => acc + Number(curr.amount), 0);
                const successCount = txs.filter(t => t.status === 'completed').length;
                const rate = txs.length > 0 ? ((successCount / txs.length) * 100).toFixed(1) : 0;

                setStats({
                    totalVolume: totalVol,
                    successRate: rate,
                    activeWebhooks: webhooksRes.data.length,
                    walletBalance: profileRes.data.wallet_balance || 0
                });
                setTransactions(txs.slice(0, 5)); // Recent 5
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Wallet Balance</dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">KES {Number(stats.walletBalance).toLocaleString()}</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Volume</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">KES {stats.totalVolume.toLocaleString()}</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.successRate}%</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Webhooks</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeWebhooks}</dd>
                    </div>
                </div>
            </div>

            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4 mt-8">Recent Transactions</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                        {transaction.type} - {transaction.reference}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {transaction.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            KES {transaction.amount}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            {new Date(transaction.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {transactions.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500 text-sm">
                            No recent transactions.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Overview;
