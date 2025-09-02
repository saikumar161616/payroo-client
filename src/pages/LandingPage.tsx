import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import { getToken } from '../api/employees';

const LandingPage: React.FC = () => {

    const [token, setToken] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const generateToken = async () => {
        console.log("Generating token for name:", name);
        setLoading(true);
        setError(null);
        try {
            const response = await getToken(name);
            if (response) {
                setToken(response);
                localStorage.setItem('token', response);
                navigate('/employees');
            } else {
                setError('Failed to generate token. Please try again.');
            }
        } catch (err) {
            console.log("Error generating token:", err);
            setError('An error occurred while generating the token.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header>
                <h1>Payroo Mini Payrun</h1>
            </header>
            <main>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                />
                <button onClick={() => generateToken()} disabled={loading || !name} > {loading ? 'Generating' : 'Generate token to access'}</button>
                {error && <p className="error">{error}</p>}
            </main>
        </div>
    );
};

export default LandingPage;