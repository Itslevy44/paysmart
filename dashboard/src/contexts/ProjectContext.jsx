import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch projects when user is logged in
    const fetchProjects = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/projects');
            setProjects(response.data);

            // Auto-select first project or restore from local storage
            const storedProjectId = localStorage.getItem('selectedProjectId');
            if (storedProjectId) {
                const found = response.data.find(p => p.id === parseInt(storedProjectId));
                if (found) {
                    setSelectedProject(found);
                } else if (response.data.length > 0) {
                    setSelectedProject(response.data[0]);
                }
            } else if (response.data.length > 0) {
                setSelectedProject(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    // Update selected project and save to local storage
    const selectProject = (project) => {
        setSelectedProject(project);
        localStorage.setItem('selectedProjectId', project.id);
    };

    const createProject = async (name, description) => {
        try {
            const response = await api.post('/projects', { name, description });
            setProjects([response.data, ...projects]);
            selectProject(response.data); // Switch to new project
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            const remaining = projects.filter(p => p.id !== id);
            setProjects(remaining);
            if (selectedProject.id === id) {
                setSelectedProject(remaining.length > 0 ? remaining[0] : null);
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProject,
            selectProject,
            createProject,
            deleteProject,
            loading,
            fetchProjects
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
