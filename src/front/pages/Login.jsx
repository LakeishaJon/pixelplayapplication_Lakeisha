import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, register, isAuthenticated } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('signin');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/home');
        }
    }, [navigate]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /[0-9]/.test(password);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (modalType === 'signup' && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (modalType === 'signup' && !validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }

        if (modalType === 'signup') {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            let result;
            
            if (modalType === 'signin') {
                result = await login(formData.email, formData.password, rememberMe);
            } else {
                result = await register(formData.email, formData.password, formData.confirmPassword);
                
                if (result.success) {
                    result = await login(formData.email, formData.password, rememberMe);
                }
            }

            setIsLoading(false);

            if (result.success) {
                navigate('/home');
            } else {
                setErrors({ form: result.message || 'Authentication failed' });
            }
        } catch (error) {
            setIsLoading(false);
            setErrors({ form: error.message || 'An error occurred' });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleGoogleSignIn = () => {
        setErrors({ form: 'Google Sign In is not yet configured. Please use email/password.' });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
        setRememberMe(false);
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
        resetForm();
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                top: '-100px',
                left: '-100px',
                filter: 'blur(40px)'
            }} />
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                bottom: '-80px',
                right: '-80px',
                filter: 'blur(40px)'
            }} />

            <div style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                maxWidth: '600px',
                padding: '2rem'
            }}>
                {/* Logo - Updated to use image */}
                <div style={{
                    marginBottom: '1rem',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <div style={{
                      
                        width: '150px',
                        height: '150px',
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        padding: '20px'
                    }}>
                        <img 
                            src="/pixelplay-logo.png" 
                            alt="PixelPlay Logo" 
                            style={{
                                width: '200%',
                                height: '200%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    color: 'white',
                    margin: '1.5rem 0 0.5rem 0',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-1px'
                }}>
                    Pixel Play AI
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 2.5rem 0',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                    Your adventure in learning, creativity, and fun starts now!
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => openModal('signin')}
                        style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'white',
                            color: '#8B5CF6',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            minWidth: '140px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => openModal('signup')}
                        style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            minWidth: '140px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            {/* Modal - Keep all your existing modal code here */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    {/* ... rest of your modal code stays the same ... */}
                </div>
            )}

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;