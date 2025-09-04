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
        <div className="container-fluid" style={{ padding: '15px', height: '100%', width: '100%' }}>
            <header className='mb-4'>
                <h1 className='text-center'>Welcome to Payroo Mini Payrun</h1>
                <p className='text-center'>Please enter anything random to generate an access token, This is to demonstrating authentication middleware</p>
            </header>
            <main className='d-flex flex-column justify-content-center align-items-center'>
                <div className='mb-3' style={{ maxWidth: 400, }}>
                    <input
                        id='fullname'
                        type="text"
                        className='form-control'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Eg: Fullname"
                    />
                    <button  className='btn btn-primary' onClick={() => generateToken()} disabled={loading || !name} > {loading ? 'Generating' : 'Generate token to access'}</button>
                    {error && <p className="error">{error}</p>}
                </div>

            </main>
        </div>
    );
};

export default LandingPage;