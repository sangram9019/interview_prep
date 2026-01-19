import React, { useMemo } from 'react';
import { useQuestions } from '../../context/QuestionContext';
import { Hexagon, BookOpen } from 'lucide-react';
import './TopicsView.css';

const TopicsView = () => {
    const { questions, isLoading } = useQuestions();

    const topicStats = useMemo(() => {
        const stats = {};

        questions.forEach(q => {
            // Normalize topic name (trim)
            const topic = q.topic.trim();
            if (!stats[topic]) {
                stats[topic] = {
                    count: 0,
                    easy: 0,
                    medium: 0,
                    hard: 0,
                    totalConfidence: 0
                };
            }

            stats[topic].count += 1;
            stats[topic][q.difficulty.toLowerCase()] += 1;
            stats[topic].totalConfidence += q.confidence;
        });

        // Convert to array and sort by count desc
        return Object.entries(stats)
            .map(([name, data]) => ({
                name,
                ...data,
                avgConfidence: Math.round(data.totalConfidence / data.count)
            }))
            .sort((a, b) => b.count - a.count);
    }, [questions]);

    const renderConfidenceDots = (level) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <div
                key={i}
                className={`confidence-dot-sm ${i < level ? 'filled' : ''}`}
            />
        ));
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="topics-page">
            <div className="topics-header">
                <h2 className="page-title">Topics</h2>
                <p className="page-subtitle">Overview of your question categories</p>
            </div>

            <div className="topics-grid">
                {topicStats.length > 0 ? (
                    topicStats.map(topic => (
                        <div key={topic.name} className="topic-card">
                            <div className="topic-header">
                                <div className="topic-icon-wrapper">
                                    <Hexagon size={24} className="topic-icon" />
                                </div>
                                <span className="topic-count">{topic.count}</span>
                            </div>

                            <h4 className="topic-name">{topic.name}</h4>

                            <div className="topic-badges">
                                {topic.easy > 0 && <span className="difficulty-tag ease"> {topic.easy} Easy</span>}
                                {topic.medium > 0 && <span className="difficulty-tag medium"> {topic.medium} Med</span>}
                                {topic.hard > 0 && <span className="difficulty-tag hard"> {topic.hard} Hard</span>}
                            </div>

                            <div className="topic-footer">
                                <span className="footer-label">Avg Confidence:</span>
                                <div className="confidence-wrapper">
                                    {renderConfidenceDots(topic.avgConfidence)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-topics">
                        <BookOpen size={48} />
                        <p className="font-medium">No topics yet</p>
                        <p>Topics will appear as you add questions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicsView;
