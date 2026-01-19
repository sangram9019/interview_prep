import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../../context/QuestionContext';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Edit2, Calendar } from 'lucide-react';
import './QuestionDetails.css';

// We need to import the highlight.js css for code blocks
import 'highlight.js/styles/github-dark.css';

const QuestionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { questions, isLoading } = useQuestions();

    const question = useMemo(() => {
        return questions.find(q => q.__backendId === id);
    }, [questions, id]);

    if (isLoading) return <div>Loading...</div>;

    if (!question) {
        return (
            <div className="details-error">
                <h3>Question not found</h3>
                <button onClick={() => navigate('/questions')} className="btn btn-primary">
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="details-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="details-container">
                <div className="details-header">
                    <div className="details-meta">
                        <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                            {question.difficulty}
                        </span>
                        <span className="topic-badge">{question.topic}</span>
                        <span className="date-badge">
                            <Calendar size={14} />
                            {new Date(question.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="question-title">{question.question}</h1>

                    <div className="details-actions">
                        <button
                            onClick={() => navigate(`/edit/${question.__backendId}`)}
                            className="action-btn"
                            title="Edit Question"
                        >
                            <Edit2 size={18} />
                            Edit
                        </button>
                    </div>
                </div>

                <div className="answer-section">
                    <h3 className="section-label">Answer</h3>
                    <div className="markdown-content">
                        {question.answer ? (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {question.answer}
                            </ReactMarkdown>
                        ) : (
                            <p className="no-answer">No answer provided yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;
