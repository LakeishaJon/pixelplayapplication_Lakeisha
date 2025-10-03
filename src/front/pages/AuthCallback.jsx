import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthTokens } from '../utils/auth';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        if (error) {
            alert(`Authentication failed: ${error}`);
            navigate('/login');
            return;
        }

        if (accessToken) {
            // Store tokens
            setAuthTokens(accessToken, refreshToken, true);
            
            // Redirect to home
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)'
        }}>
            <div style={{ color: 'white', fontSize: '1.5rem' }}>
                Completing sign in...
            </div>
        </div>
    );
};

export default AuthCallback;