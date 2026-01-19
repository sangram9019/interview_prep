import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../services/dataService';

const QuestionContext = createContext();

export const useQuestions = () => {
    const context = useContext(QuestionContext);
    if (!context) {
        throw new Error('useQuestions must be used within a QuestionProvider');
    }
    return context;
};

export const QuestionProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setIsLoading(true);
        try {
            const data = await DataService.getAll();
            // Sort by created_at desc
            const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setQuestions(sorted);
        } catch (err) {
            setError('Failed to load questions');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addQuestion = async (data) => {
        try {
            const result = await DataService.create(data);
            if (result.isOk) {
                setQuestions(prev => [result.data, ...prev]);
                return { success: true };
            }
            return { success: false, error: 'Failed to create question' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateQuestion = async (data) => {
        try {
            const result = await DataService.update(data);
            if (result.isOk) {
                setQuestions(prev => prev.map(q => q.__backendId === data.__backendId ? result.data : q));
                return { success: true };
            }
            return { success: false, error: 'Failed to update question' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteQuestion = async (id) => {
        try {
            // Find the object first as the service expects the object (matching original SDK) or we can adjust service. 
            // The service mock I wrote expects {__backendId: ...} or similar if following the pattern.
            // Let's passed the ID wrapped in an object to match the service signature if needed, or just the ID.
            // Looking at my DataService implementation: it expects `question` object and checks `question.__backendId`.
            const question = questions.find(q => q.__backendId === id);
            if (!question) return { success: false, error: 'Question not found' };

            const result = await DataService.delete(question);
            if (result.isOk) {
                setQuestions(prev => prev.filter(q => q.__backendId !== id));
                return { success: true };
            }
            return { success: false, error: 'Failed to delete question' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const getStats = () => {
        const topics = [...new Set(questions.map(q => q.topic))];
        const needsRevision = questions.filter(q => q.confidence <= 2).length;
        return {
            total: questions.length,
            topicsCount: topics.length,
            needsRevision,
            topicList: topics
        };
    };

    const value = {
        questions,
        isLoading,
        error,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        getStats,
        refresh: loadQuestions
    };

    return (
        <QuestionContext.Provider value={value}>
            {children}
        </QuestionContext.Provider>
    );
};
