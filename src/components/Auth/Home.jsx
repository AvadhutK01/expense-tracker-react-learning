import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Wallet, Tag, FileText, List, AlertCircle, Edit2, Trash2, CheckCircle } from 'lucide-react';
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
    const [editingId, setEditingId] = useState(null);
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
        const expenseData = {
            fields: {
                amount: { doubleValue: parseFloat(amount) },
                description: { stringValue: description },
                category: { stringValue: category },
                date: { stringValue: new Date().toLocaleDateString() }
            }
        };

        try {
            if (editingId) {
                // Update existing expense
                const updateUrl = `${FIRESTORE_URL}/${editingId}?updateMask.fieldPaths=amount&updateMask.fieldPaths=description&updateMask.fieldPaths=category&updateMask.fieldPaths=date`;
                const response = await axios.patch(updateUrl, expenseData);

                if (response.status === 200) {
                    const updatedExpenses = expenses.map(exp =>
                        exp.id === editingId ? {
                            ...exp,
                            amount: parseFloat(amount),
                            description: description,
                            category: category
                        } : exp
                    );
                    setExpenses(updatedExpenses);
                    setEditingId(null);
                    setMessage({ type: 'success', text: 'Expense updated successfully!' });
                }
            } else {
                // Add new expense
                const response = await axios.post(FIRESTORE_URL, expenseData);
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
                    setMessage({ type: 'success', text: 'Expense added successfully!' });
                }
            }
            setAmount('');
            setDescription('');
            setCategory('Food');
        } catch (err) {
            console.error('Error saving expense:', err);
            setMessage({ type: 'error', text: 'Failed to save expense.' });
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;

        try {
            const response = await axios.delete(`${FIRESTORE_URL}/${id}`);
            if (response.status === 200 || response.status === 204) {
                setExpenses(expenses.filter(exp => exp.id !== id));
                console.log('Expense successfully deleted');
                setMessage({ type: 'success', text: 'Expense deleted successfully!' });
            }
        } catch (err) {
            console.error('Error deleting expense:', err);
            setMessage({ type: 'error', text: 'Failed to delete expense.' });
        }
    };

    const handleEditClick = (expense) => {
        setAmount(expense.amount);
        setDescription(expense.description);
        setCategory(expense.category);
        setEditingId(expense.id);
        setMessage({ type: '', text: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setAmount('');
        setDescription('');
        setCategory('Food');
        setMessage({ type: '', text: '' });
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

                {/* Status Messages */}
                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: message.type === 'success' ? '#4ade80' : '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <AlertCircle size={18} />
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Email Verification Banner */}
                {!isEmailVerified && !message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                    }}>
                        <span>Your email is not verified yet. Please verify for full access.</span>
                        <button
                            onClick={handleSendVerification}
                            disabled={verifyLoading}
                            style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {verifyLoading ? 'Sending...' : 'Verify Email'}
                        </button>
                    </div>
                )}

                {/* Expense Form */}
                <div className="expense-form-card" style={{ border: editingId ? '1px solid rgba(99, 102, 241, 0.5)' : '' }}>
                    {editingId && (
                        <div style={{ color: '#818cf8', fontSize: '0.875rem', fontWeight: 600, marginBottom: '15px' }}>
                            Editing Expense
                        </div>
                    )}
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

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="add-expense-btn" disabled={addLoading} style={{ flex: 1 }}>
                                {addLoading ? (
                                    <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                ) : (
                                    <>
                                        {editingId ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
                                        <span>{editingId ? 'Update' : 'Add Expense'}</span>
                                    </>
                                )}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="add-expense-btn"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', width: 'auto', padding: '0 15px' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <span className="expense-amount">
                                            ₹{expense.amount.toFixed(2)}
                                        </span>
                                        <div className="expense-actions" style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleEditClick(expense)}
                                                className="action-btn edit"
                                                title="Edit Expense"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                className="action-btn delete"
                                                title="Delete Expense"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
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
