import { useState, useEffect } from 'react';
import { CompanyEnterForm } from './forms/Company.jsx';
import { ShareholderEnterForm } from './forms/Shareholders.jsx';
import axios from 'axios';
import { getToken } from '../utils/Auth.js';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function authHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
}

const User = ({ onLogout }) => {
    const [error, setError] = useState('');
    const [formStage, setFormStage] = useState(null); // null = loading
    const [companyId, setCompanyId] = useState(null);
    const [companyDraft, setCompanyDraft] = useState(null);
    const [shareholderCount, setShareholderCount] = useState(0);
    // On mount: check if user has an in-progress company
    useEffect(() => {
        axios.get(`${API_BASE_URL}/user/draft`, authHeaders())
            .then(res => {
                const draft = res.data.draft;
                if (draft) {
                    setCompanyId(draft.id);
                    setCompanyDraft(draft);
                    setFormStage(1); // already have company, go to shareholders
                } else {
                    setFormStage(0);
                }
            })
            .catch(() => setFormStage(0));
    }, []);

    const handleAddCompany = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/company`, data, authHeaders());
            setCompanyId(response.data.company.id);
            setCompanyDraft(response.data.company);
            setFormStage(1);
            setShareholderCount(response.data.company.shareholderscount);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add company');
        }
    };

    const handleAddShareholder = async (shareholders) => {
        try {
            await axios.post(
                `${API_BASE_URL}/shareholders`,
                { shareholders, companyId },
                authHeaders()
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add shareholders');
            throw err;
        }
    };

    const handleAllShareholdersDone = async () => {
        await axios.delete(`${API_BASE_URL}/user/draft`, authHeaders());
        setFormStage(2);
    };

    if (formStage === null) {
        return <div className="dashboard-container"><div className="loading-spinner"><p>Loading...</p></div></div>;
    }

    if (formStage === 0) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>User Dashboard</h1>
                    <button className="btn btn-logout" onClick={onLogout}>Logout</button>
                </header>
                {error && <p className="error-message">{error}</p>}
                <section className="dashboard-section">
                    <h2 className="section-title">Step 1: Company Information</h2>
                    <CompanyEnterForm onSubmit={handleAddCompany} />
                </section>
            </div>
        );
    }

    if (formStage === 1) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>User Dashboard</h1>
                    <button className="btn btn-logout" onClick={onLogout}>Logout</button>
                </header>
                {error && <p className="error-message">{error}</p>}
                <section className="dashboard-section">
                    <h2 className="section-title">Step 2: Add Shareholders</h2>
                    {companyDraft && (
                        <p className="info-message">Resuming: <strong>{companyDraft.name}</strong></p>
                    )}
                    <ShareholderEnterForm
                        onSubmit={handleAddShareholder}
                        onAllDone={handleAllShareholdersDone}
                        companyId={companyId}
                        shareHoldersCount={companyDraft?.shareholderscount || 1}
                    />
                </section>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>User Dashboard</h1>
                <button className="btn btn-logout" onClick={onLogout}>Logout</button>
            </header>
            <section className="dashboard-section success-section">
                <p className="success-message">Company and shareholders added successfully!</p>
                <button className="btn btn-primary" onClick={() => { setCompanyDraft(null); setFormStage(0); }}>Add Another Company</button>
            </section>
        </div>
    );
};

export default User;
