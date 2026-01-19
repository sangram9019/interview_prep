import React, { useState, useMemo } from 'react';
import { useQuestions } from '../../context/QuestionContext';
import QuestionCard from '../../components/QuestionCard';
import { Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuestionsList.css';

const QuestionsList = () => {
    const { questions, isLoading } = useQuestions();
    const navigate = useNavigate();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedConfidence, setSelectedConfidence] = useState('');

    // Derived Data
    const topics = useMemo(() => {
        return [...new Set(questions.map(q => q.topic))].sort();
    }, [questions]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch =
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.answer && q.answer.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTopic = selectedTopic ? q.topic === selectedTopic : true;
            const matchesDifficulty = selectedDifficulty ? q.difficulty === selectedDifficulty : true;
            const matchesConfidence = selectedConfidence ? q.confidence === parseInt(selectedConfidence) : true;

            return matchesSearch && matchesTopic && matchesDifficulty && matchesConfidence;
        });
    }, [questions, searchTerm, selectedTopic, selectedDifficulty, selectedConfidence]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTopic('');
        setSelectedDifficulty('');
        setSelectedConfidence('');
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="questions-page">
            <div className="questions-header">
                <div>
                    <h2 className="page-title">All Questions</h2>
                    <p className="page-subtitle">Browse and manage your question bank</p>
                </div>
                <button
                    onClick={() => navigate('/add')}
                    className="btn btn-primary"
                >
                    Add Question
                </button>
            </div>

            {/* Filters Section */}
            <div className="filters-card">
                <div className="filters-grid">
                    {/* Search */}
                    <div className="filter-group">
                        <div className="search-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Topic Filter */}
                    <div className="filter-group">
                        <select
                            className="filter-select"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="">All Topics</option>
                            {topics.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="filter-group">
                        <select
                            className="filter-select"
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Confidence Filter */}
                    <div className="filter-group">
                        <select
                            className="filter-select"
                            value={selectedConfidence}
                            onChange={(e) => setSelectedConfidence(e.target.value)}
                        >
                            <option value="">All Confidence Levels</option>
                            <option value="1">1 - Very Low</option>
                            <option value="2">2 - Low</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - High</option>
                            <option value="5">5 - Very High</option>
                        </select>
                    </div>

                    {/* Clear Buttons */}
                    <div className="filter-actions">
                        <button
                            onClick={clearFilters}
                            className="btn-text"
                            title="Clear Filters"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="questions-list-container">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map(q => (
                        <QuestionCard key={q.__backendId} question={q} />
                    ))
                ) : (
                    <div className="empty-state">
                        <Search size={48} />
                        <p className="font-medium">No questions found</p>
                        <p>Try adjusting your filters</p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-primary mt-4"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionsList;
