const STORAGE_KEY = 'devprep_questions';

export const DataService = {
    // Simulate async behavior to match potential future API
    async getAll() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = localStorage.getItem(STORAGE_KEY);
                resolve(data ? JSON.parse(data) : []);
            }, 300); // Small delay to simulate loading
        });
    },

    async create(questionData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = this._getFromStorage();
                const newQuestion = {
                    ...questionData,
                    __backendId: crypto.randomUUID(), // Use UUID for ID like the backend did
                    created_at: new Date().toISOString()
                };
                questions.push(newQuestion);
                this._saveToStorage(questions);
                resolve({ isOk: true, data: newQuestion });
            }, 300);
        });
    },

    async update(questionData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = this._getFromStorage();
                const index = questions.findIndex(q => q.__backendId === questionData.__backendId);
                if (index !== -1) {
                    questions[index] = { ...questions[index], ...questionData };
                    this._saveToStorage(questions);
                    resolve({ isOk: true, data: questions[index] });
                } else {
                    resolve({ isOk: false, error: 'Question not found' });
                }
            }, 300);
        });
    },

    async delete(question) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = this._getFromStorage();
                const newQuestions = questions.filter(q => q.__backendId !== question.__backendId);
                this._saveToStorage(newQuestions);
                resolve({ isOk: true });
            }, 300);
        });
    },

    // Helper functions (synchronous)
    _getFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    _saveToStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};
