import { useState } from 'react';

const ShareholderEnterForm = ({ onSubmit, onAllDone, companyId, shareHoldersCount }) => {
    const [shareholders, setShareholders] = useState(
        Array.from({ length: shareHoldersCount }, () => ({ firstName: '', lastName: '', nationality: '', companyId: companyId }))
    );

    const handleChange = (index, field, value) => {
        setShareholders(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(shareholders);
        onAllDone();
    };

    return (
        <form className="form-card" onSubmit={handleSubmit}>
            {shareholders.map((s, i) => (
                <div key={i} className="shareholder-group">
                    <h4 className="shareholder-heading">Shareholder {i + 1}</h4>
                    <div className="form-group">
                        <label htmlFor={`firstName-${i}`}>First Name</label>
                        <input
                            id={`firstName-${i}`}
                            type="text"
                            placeholder="Enter first name"
                            value={s.firstName}
                            onChange={(e) => handleChange(i, 'firstName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`lastName-${i}`}>Last Name</label>
                        <input
                            id={`lastName-${i}`}
                            type="text"
                            placeholder="Enter last name"
                            value={s.lastName}
                            onChange={(e) => handleChange(i, 'lastName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`nationality-${i}`}>Nationality</label>
                        <input
                            id={`nationality-${i}`}
                            type="text"
                            placeholder="Enter nationality"
                            value={s.nationality}
                            onChange={(e) => handleChange(i, 'nationality', e.target.value)}
                            required
                        />
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" type="submit">Submit All Shareholders</button>
        </form>
    );
};

export { ShareholderEnterForm };
