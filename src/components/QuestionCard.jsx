import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../context/QuestionContext';
import './QuestionCard.css';

const QuestionCard = ({ question }) => {
    const navigate = useNavigate();
    const { deleteQuestion } = useQuestions();

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this question?')) {
            await deleteQuestion(question.__backendId);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit/${question.__backendId}`);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'badge-emerald';
            case 'Medium': return 'badge-amber';
            case 'Hard': return 'badge-red';
            default: return 'badge-slate';
        }
    };

    const renderConfidenceDots = (level) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <div
                key={i}
                className={`confidence-dot ${i < level ? 'filled' : ''}`}
            />
        ));
    };

    return (
        <div className="question-card">
            <div className="flex items-start">
                <div>
                    <h4 className="question-text">{question.question}</h4>
                    {question.answer && (
                        <p className="answer-text mono">
                            {question.answer.length > 150
                                ? `${question.answer.substring(0, 150)}...`
                                : question.answer}
                        </p>
                    )}

                    <div className="card-meta">
                        <span className="badge badge-indigo">{question.topic}</span>
                        <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        <div className="confidence-wrapper">
                            {renderConfidenceDots(question.confidence)}
                        </div>
                    </div>
                </div>

                <div className="card-actions">
                    <button
                        onClick={handleEdit}
                        className="action-btn"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="action-btn"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
