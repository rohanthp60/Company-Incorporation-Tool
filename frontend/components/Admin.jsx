import { useState, useEffect } from 'react';

import axios from 'axios';
import { getToken } from '../utils/Auth.js';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function authHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
}

const Admin = ({ onLogout }) => {
    const [companies, setCompanies] = useState([]);
    const [shareholders, setShareholders] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/admin/company`, authHeaders())
            .then(res => setCompanies(res.data.companies))
            .catch(err => setError(err.response?.data?.message || 'Failed to load companies'));
    }, []);

    const handleSelectCompany = (companyId) => {
        setSelectedCompanyId(companyId);
        axios.get(`${API_BASE_URL}/admin/shareholder/${companyId}`, authHeaders())
            .then(res => setShareholders(res.data.shareholders))
            .catch(err => setError(err.response?.data?.message || 'Failed to load shareholders'));
    };

    

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <button className="btn btn-logout" onClick={onLogout}>Logout</button>
            </header>
            {error && <p className="error-message">{error}</p>}

            <section className="dashboard-section">
                <h2 className="section-title">Companies</h2>
                <ul className="item-list">
                    {companies.map(c => (
                        <li key={c.id} className={`item-card${selectedCompanyId === c.id ? ' item-card--active' : ''}`}>
                            <span className="item-name">{c.name}</span>
                            <span className="item-detail">{c.shareholderscount} shareholders</span>
                            <span className="item-detail">${c.totalcapitalsinvested}</span>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSelectCompany(c.id)}>
                                {selectedCompanyId === c.id ? 'Refresh' : 'View Shareholders'}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {selectedCompanyId && (
                <section className="dashboard-section">
                    <h2 className="section-title">
                        Shareholders
                        <span className="badge">
                            {companies.find(c => c.id === selectedCompanyId)?.name || `Company #${selectedCompanyId}`}
                        </span>
                    </h2>
                    {shareholders.length === 0 ? (
                        <p className="info-message">No shareholders found for this company.</p>
                    ) : (
                        <ul className="item-list">
                            {shareholders.map(s => (
                                <li key={s.id} className="item-card">
                                    <span className="item-name">{s.first_name} {s.last_name}</span>
                                    <span className="item-detail">{s.nationality}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
};

export default Admin;