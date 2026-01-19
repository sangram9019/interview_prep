import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestions } from '../../context/QuestionContext';
import { Save, X, AlertCircle } from 'lucide-react';
import './QuestionForm.css';

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addQuestion, updateQuestion, questions } = useQuestions();

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        topic: '',
        difficulty: '',
        confidence: 3
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const questionToEdit = questions.find(q => q.__backendId === id);
            if (questionToEdit) {
                setFormData({
                    question: questionToEdit.question,
                    answer: questionToEdit.answer || '',
                    topic: questionToEdit.topic,
                    difficulty: questionToEdit.difficulty,
                    confidence: questionToEdit.confidence
                });
            } else {
                // If question not found (maybe reload on edit page), could fetch strictly or redirect
                // For now, assuming context is loaded. If deep link, context might still be loading.
                // But context handles loading state. If not found after loading, maybe redirect.
            }
        }
    }, [id, questions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!formData.question || !formData.topic || !formData.difficulty) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        const payload = { ...formData };

        let result;
        if (id) {
            result = await updateQuestion({ ...payload, __backendId: id });
        } else {
            result = await addQuestion(payload);
        }

        setIsLoading(false);

        if (result.success) {
            navigate('/questions');
        } else {
            setError(result.error || 'Failed to save question');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'confidence' ? parseInt(value) : value
        }));
    };

    const confidenceLabels = {
        1: '1 - Very Low',
        2: '2 - Low',
        3: '3 - Medium',
        4: '4 - High',
        5: '5 - Very High'
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <div className="form-header">
                    <h2 className="form-title">{id ? 'Edit Question' : 'Add Question'}</h2>
                    <p className="form-subtitle">
                        {id ? 'Update your interview question' : 'Create a new interview question'}
                    </p>
                </div>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="question-form">
                    <div className="form-group">
                        <label htmlFor="question" className="form-label">Question *</label>
                        <textarea
                            id="question"
                            name="question"
                            rows="3"
                            className="form-input"
                            placeholder="Enter your interview question..."
                            value={formData.question}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="answer" className="form-label">Answer</label>
                        <textarea
                            id="answer"
                            name="answer"
                            rows="6"
                            className="form-input mono"
                            placeholder="Write your answer or notes here..."
                            value={formData.answer}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="topic" className="form-label">Topic *</label>
                            <input
                                type="text"
                                id="topic"
                                name="topic"
                                className="form-input"
                                placeholder="e.g., Arrays, System Design"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty" className="form-label">Difficulty *</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                className="form-select"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confidence" className="form-label">Confidence Level</label>
                        <div className="range-wrapper">
                            <input
                                type="range"
                                id="confidence"
                                name="confidence"
                                min="1"
                                max="5"
                                step="1"
                                className="range-input"
                                value={formData.confidence}
                                onChange={handleChange}
                            />
                            <span className="range-value">{confidenceLabels[formData.confidence]}</span>
                        </div>
                        <div className="range-labels">
                            <span>Very Low</span>
                            <span>Very High</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            <Save size={20} />
                            {isLoading ? 'Saving...' : 'Save Question'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionForm;
