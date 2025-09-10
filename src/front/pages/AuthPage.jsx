import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export const AuthPage = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="text-center mb-4">
                            <h1 className="text-white mb-3">🎮 PixelPlay</h1>
                            <p className="text-white-50">Avatar Management System</p>
                        </div>

                        {mode === 'login' ? (
                            <LoginForm onToggleMode={setMode} />
                        ) : (
                            <RegisterForm onToggleMode={setMode} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};