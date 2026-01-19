import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PlusSquare, BookOpen, Hexagon } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="flex items-center">
                    <div className="logo-icon">
                        <Hexagon size={24} color="white" fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="app-title">DevPrep</h1>
                        <p className="app-version mono">v1.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    end
                >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/questions"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <List size={20} />
                    <span className="font-medium">All Questions</span>
                </NavLink>

                <NavLink
                    to="/add"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <PlusSquare size={20} />
                    <span className="font-medium">Add Question</span>
                </NavLink>

                <NavLink
                    to="/topics"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <BookOpen size={20} />
                    <span className="font-medium">Topics</span>
                </NavLink>
            </nav>

            {/* User Section */}
            <div className="sidebar-footer">
                <div className="flex items-center">
                    <div className="user-avatar">
                        D
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium">Developer</p>
                        <p>Study Mode</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
