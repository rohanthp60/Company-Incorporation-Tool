import { useState } from 'react';

const CompanyEnterForm = ({ onSubmit }) => {
    const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
    const [shareHoldersCount, setShareHoldersCount] = useState(Number(localStorage.getItem('shareHoldersCount')) || '');
    const [totalCapitalsInvested, setTotalCapitalsInvested] = useState(Number(localStorage.getItem('totalCapitalsInvested')) || '');

    const handleCompanyNameChange = (e) => {
        setCompanyName(e.target.value);
        localStorage.setItem('companyName', e.target.value);
    };

    const handleShareHoldersCountChange = (e) => {
        setShareHoldersCount(Number(e.target.value));
        localStorage.setItem('shareHoldersCount', e.target.value);
    };

    const handleTotalCapitalsInvestedChange = (e) => {
        setTotalCapitalsInvested(Number(e.target.value));
        localStorage.setItem('totalCapitalsInvested', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.removeItem('companyName');
        localStorage.removeItem('shareHoldersCount');
        localStorage.removeItem('totalCapitalsInvested');
        onSubmit({ name: companyName, shareHoldersCount, totalCapitalsInvested });
    };

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                    id="companyName"
                    type="text"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="shareholdersCount">Number of Shareholders</label>
                <input
                    id="shareholdersCount"
                    type="number"
                    placeholder="Enter number of shareholders"
                    value={shareHoldersCount}
                    onChange={handleShareHoldersCountChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="totalCapital">Total Capital Invested ($)</label>
                <input
                    id="totalCapital"
                    type="number"
                    placeholder="Enter total capital invested"
                    value={totalCapitalsInvested}
                    onChange={handleTotalCapitalsInvestedChange}
                    required
                />
            </div>
            <button className="btn btn-primary" type="submit">Add Company</button>
        </form>
    );
};

export { CompanyEnterForm };
