import { useState } from 'react';
import { useAuth } from '../js/auth';

const LoginForm = ({ onToggleMode }) => {
    const { login, googleLogin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        setLoading(false);
        if (!result.success) {
            setError(result.error);
        }
    };

    const handleGoogleLogin = () => {
        googleLogin();
    };

    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title text-center mb-4">Login to Avatar Dashboard</h3>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            Continue with Google
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p>
                        Don't have an account?{' '}
                        <button
                            className="btn btn-link p-0"
                            onClick={() => onToggleMode('register')}
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;