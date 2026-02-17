import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-indigo-600">PaySmart</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Overview
                    </Link>
                    <Link to="/transactions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Transactions
                    </Link>
                    <Link to="/api-keys" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        API Keys
                    </Link>
                    <Link to="/webhooks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Webhooks
                    </Link>
                    <Link to="/sandbox" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Sandbox Simulator
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 rounded-md mt-8"
                    >
                        Logout
                    </button>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
