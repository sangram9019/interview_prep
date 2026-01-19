import React, { useMemo } from 'react';
import { useQuestions } from '../../context/QuestionContext';
import QuestionCard from '../../components/QuestionCard';
import { List, BookOpen, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, colorClass, subtext }) => (
    <div className="stat-card">
        <div className="flex justify-between items-center">
            <div>
                <p className="stat-title">{title}</p>
                <p className="stat-value">{value}</p>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="stat-footer">
            {subtext}
        </div>
    </div>
);

const Dashboard = () => {
    const { questions, getStats, isLoading } = useQuestions();
    const navigate = useNavigate();
    const stats = useMemo(() => getStats(), [questions]);

    // Get recent 5 questions
    const recentQuestions = questions.slice(0, 5);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="page-subtitle">Track your interview preparation progress</p>
                </div>
                {/* <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="search-input"
                        onClick={() => navigate('/questions')}
                    />
                </div> */}
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Questions"
                    value={stats.total}
                    icon={List}
                    colorClass="icon-indigo"
                    subtext={<span className="badge badge-emerald">Active</span>}
                />
                <StatCard
                    title="Topics Covered"
                    value={stats.topicsCount}
                    icon={BookOpen}
                    colorClass="icon-purple"
                    subtext={
                        <span className="badge badge-purple" style={{ maxWidth: '100%' }}>
                            {stats.topicsCount > 0 ? stats.topicList.slice(0, 3).join(', ') : 'No topics yet'}
                        </span>
                    }
                />
                <StatCard
                    title="Needs Revision"
                    value={stats.needsRevision}
                    icon={AlertCircle}
                    colorClass="icon-amber"
                    subtext={<span className="badge badge-amber">Confidence ≤ 2</span>}
                />
            </div>

            {/* Recent Questions */}
            <div className="recent-section">
                <div className="recent-question-section">
                    <h3 className="section-title">Recent Questions</h3>
                    <button
                        onClick={() => navigate('/add')}
                        className="btn btn-primary"
                    >
                        Add Question
                    </button>
                </div>

                <div className="questions-list">
                    {recentQuestions.length > 0 ? (
                        recentQuestions.map(q => (
                            <QuestionCard key={q.__backendId} question={q} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <List size={48} />
                            <p className="font-medium">No questions yet</p>
                            <p>Start building your question bank</p>
                            <button
                                onClick={() => navigate('/add')}
                                className="btn btn-primary mt-4"
                            >
                                Add Your First Question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
