import React, { useContext, useState } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';
import { PlusIcon, TrashIcon, FolderIcon } from '@heroicons/react/solid';

const Projects = () => {
    const { projects, selectedProject, selectProject, createProject, deleteProject } = useContext(ProjectContext);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(newName, newDesc);
            setIsCreating(false);
            setNewName('');
            setNewDesc('');
        } catch (err) {
            alert('Failed to create project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? transactions and keys will be lost.')) {
            try {
                await deleteProject(id);
            } catch (err) {
                alert('Failed to delete project');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Projects
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={() => setIsCreating(true)}
                        type="button"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
                    <form onSubmit={handleCreate}>
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects Grid */}
            <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => selectProject(project)}
                        className={`flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 ${selectedProject?.id === project.id ? 'border-indigo-500' : 'border-transparent'
                            }`}
                    >
                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                                            <FolderIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {project.name}
                                    </h3>
                                </div>
                                <p className="mt-3 text-base text-gray-500">
                                    {project.description || 'No description'}
                                </p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    {selectedProject?.id === project.id ? (
                                        <span className="text-green-600 font-medium">Active</span>
                                    ) : (
                                        <span>Click to switch</span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project.id);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
