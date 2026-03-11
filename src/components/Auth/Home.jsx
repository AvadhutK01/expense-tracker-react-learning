import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Wallet, Tag, FileText, List } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [loading, setLoading] = useState(true);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Expense Form State
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Food');
    const [listLoading, setListLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);

    const categories = ['Food', 'Petrol', 'Rent', 'Entertainment', 'Shopping', 'Health', 'Other'];
    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/sh-p-f50d3/databases/(default)/documents/expense`;

    useEffect(() => {
        const init = async () => {
            await fetchUserData();
            await fetchExpenses();
        };
        init();
    }, []);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            const response = await axios.post(url, { idToken: token });
            if (response.data.users?.[0]) {
                const user = response.data.users[0];
                setUserName(user.displayName || user.email.split('@')[0]);
                setIsEmailVerified(user.emailVerified);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        setListLoading(true);
        try {
            const response = await axios.get(FIRESTORE_URL);
            if (response.data.documents) {
                const loadedExpenses = response.data.documents.map(doc => {
                    const fields = doc.fields;
                    return {
                        id: doc.name.split('/').pop(),
                        amount: parseFloat(fields.amount?.doubleValue || fields.amount?.integerValue || 0),
                        description: fields.description?.stringValue || '',
                        category: fields.category?.stringValue || 'Other',
                        date: fields.date?.stringValue || ''
                    };
                });
                setExpenses(loadedExpenses);
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
        } finally {
            setListLoading(false);
        }
    };

    const handleSendVerification = async () => {
        setVerifyLoading(true);
        setMessage({ type: '', text: '' });
        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            await axios.post(url, {
                requestType: 'VERIFY_EMAIL',
                idToken: token
            });
            setMessage({
                type: 'success',
                text: 'Check your email, you might have received a verification link. Click on it to verify.'
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || 'Failed to send verification email';
            setMessage({
                type: 'error',
                text: errorMsg.replace(/_/g, ' ')
            });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        setAddLoading(true);
        const newExpenseData = {
            fields: {
                amount: { doubleValue: parseFloat(amount) },
                description: { stringValue: description },
                category: { stringValue: category },
                date: { stringValue: new Date().toLocaleDateString() }
            }
        };

        try {
            const response = await axios.post(FIRESTORE_URL, newExpenseData);
            if (response.status === 200 || response.status === 201) {
                const addedDoc = response.data;
                const newExpense = {
                    id: addedDoc.name.split('/').pop(),
                    amount: parseFloat(addedDoc.fields.amount.doubleValue),
                    description: addedDoc.fields.description.stringValue,
                    category: addedDoc.fields.category.stringValue,
                    date: addedDoc.fields.date.stringValue
                };
                setExpenses([newExpense, ...expenses]);
                setAmount('');
                setDescription('');
                setCategory('Food');
            }
        } catch (err) {
            console.error('Error adding expense:', err);
            setMessage({ type: 'error', text: 'Failed to save expense to database.' });
        } finally {
            setAddLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container" style={{ background: '#0f172a' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div style={{ background: '#0f172a', minHeight: 'calc(100vh - 64px)', color: 'white' }}>
            <main className="home-main">
                <section className="welcome-section">
                    <h1 className="welcome-title">Welcome back, {userName}!</h1>
                    <p className="welcome-subtitle">Manage your daily expenses with ease.</p>
                </section>

                {/* Email Verification Banner */}
                {!isEmailVerified && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                        color: message.type === 'success' ? '#4ade80' : '#fbbf24',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                    }}>
                        <span>{message.text || 'Your email is not verified yet. Please verify for full access.'}</span>
                        {!message.text && (
                            <button
                                onClick={handleSendVerification}
                                disabled={verifyLoading}
                                style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {verifyLoading ? 'Sending...' : 'Verify Email'}
                            </button>
                        )}
                    </div>
                )}

                {/* Expense Form */}
                <div className="expense-form-card">
                    <form className="expense-form" onSubmit={handleAddExpense}>
                        <div className="form-group">
                            <label className="form-label">Amount</label>
                            <div style={{ position: 'relative' }}>
                                <Wallet size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input
                                    type="number"
                                    className="expense-input"
                                    style={{ paddingLeft: '40px', width: '100%' }}
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <div style={{ position: 'relative' }}>
                                <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input
                                    type="text"
                                    className="expense-input"
                                    style={{ paddingLeft: '40px', width: '100%' }}
                                    placeholder="What did you spend on?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <div style={{ position: 'relative' }}>
                                <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <select
                                    className="expense-select"
                                    style={{ paddingLeft: '40px', width: '100%' }}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="add-expense-btn" disabled={addLoading}>
                            {addLoading ? (
                                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <PlusCircle size={20} />
                                    <span>Add Expense</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Expense List */}
                <section className="expense-list-section">
                    <h2 className="section-title">
                        <List size={22} style={{ color: '#6366f1' }} />
                        Recent Expenses
                    </h2>

                    <div className="expense-list">
                        {listLoading ? (
                            <div className="empty-state" style={{ borderStyle: 'solid' }}>
                                <div className="loading-spinner" style={{ width: '30px', height: '30px', margin: '0 auto 20px' }}></div>
                                <p>Loading your expenses...</p>
                            </div>
                        ) : expenses.length > 0 ? (
                            expenses.map(expense => (
                                <div key={expense.id} className="expense-item">
                                    <div className="expense-info">
                                        <span className="expense-desc">{expense.description}</span>
                                        <div className="expense-meta">
                                            <span className="category-tag">{expense.category}</span>
                                            <span>{expense.date}</span>
                                        </div>
                                    </div>
                                    <span className="expense-amount">
                                        ₹{expense.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <PlusCircle size={40} style={{ marginBottom: '15px' }} />
                                <p>No expenses added yet. Start by adding your first expense above!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
