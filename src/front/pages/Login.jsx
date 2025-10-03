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
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/api/auth/google-login`;
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
                {/* Logo */}
                <div style={{
                    marginBottom: '1rem',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4))'
                    }}>
                        <img 
                            src="/pixelplay-logo.png" 
                            alt="PixelPlay Logo" 
                            style={{
                                width: '150%',
                                height: '150%',
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

            {/* Modal */}
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
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        maxWidth: '440px',
                        width: '100%',
                        position: 'relative',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9CA3AF',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#F3F4F6';
                                e.target.style.color = '#6B7280';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'none';
                                e.target.style.color = '#9CA3AF';
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{
                            background: 'linear-gradient(135deg, #A78BFA, #EC4899)',
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 0 1.5rem 0',
                            fontSize: '1.75rem'
                        }}>
                            🎮
                        </div>

                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            margin: '0 0 0.5rem 0'
                        }}>
                            {modalType === 'signin' ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p style={{
                            color: '#6B7280',
                            margin: '0 0 2rem 0',
                            fontSize: '0.95rem'
                        }}>
                            {modalType === 'signin' 
                                ? 'Sign in to continue your adventure' 
                                : 'Start your learning journey today'}
                        </p>

                        {errors.form && (
                            <div style={{
                                background: '#FEE2E2',
                                border: '1px solid #EF4444',
                                color: '#DC2626',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <AlertCircle size={16} />
                                {errors.form}
                            </div>
                        )}

                        <div>
                            {modalType === 'signup' && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <User style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#9CA3AF',
                                            width: '20px',
                                            height: '20px'
                                        }} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem 1rem 0.875rem 3rem',
                                                border: errors.name ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s ease',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                if (!errors.name) {
                                                    e.target.style.borderColor = '#8B5CF6';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                                }
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    {errors.name && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginTop: '0.5rem',
                                            color: '#EF4444',
                                            fontSize: '0.875rem'
                                        }}>
                                            <AlertCircle size={16} />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9CA3AF',
                                        width: '20px',
                                        height: '20px'
                                    }} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            border: errors.email ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            if (!errors.email) {
                                                e.target.style.borderColor = '#8B5CF6';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = errors.email ? '#EF4444' : '#E5E7EB';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginTop: '0.5rem',
                                        color: '#EF4444',
                                        fontSize: '0.875rem'
                                    }}>
                                        <AlertCircle size={16} />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: modalType === 'signup' ? '1.25rem' : '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9CA3AF',
                                        width: '20px',
                                        height: '20px'
                                    }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 3rem 0.875rem 3rem',
                                            border: errors.password ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            if (!errors.password) {
                                                e.target.style.borderColor = '#8B5CF6';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = errors.password ? '#EF4444' : '#E5E7EB';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#9CA3AF',
                                            padding: '0.25rem'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.5rem',
                                        marginTop: '0.5rem',
                                        color: '#EF4444',
                                        fontSize: '0.875rem'
                                    }}>
                                        <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            {modalType === 'signup' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Lock style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#9CA3AF',
                                            width: '20px',
                                            height: '20px'
                                        }} />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem 3rem 0.875rem 3rem',
                                                border: errors.confirmPassword ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s ease',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                if (!errors.confirmPassword) {
                                                    e.target.style.borderColor = '#8B5CF6';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                                }
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = errors.confirmPassword ? '#EF4444' : '#E5E7EB';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '1rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#9CA3AF',
                                                padding: '0.25rem'
                                            }}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginTop: '0.5rem',
                                            color: '#EF4444',
                                            fontSize: '0.875rem'
                                        }}>
                                            <AlertCircle size={16} />
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>
                            )}

                            {modalType === 'signin' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label 
                                        htmlFor="rememberMe" 
                                        style={{ 
                                            cursor: 'pointer', 
                                            fontSize: '0.9rem',
                                            color: '#6B7280'
                                        }}
                                    >
                                        Remember me
                                    </label>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.0625rem',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {isLoading ? 'Loading...' : (modalType === 'signin' ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '1.5rem 0',
                            gap: '1rem'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                            <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: 'white',
                                border: '2px solid #E5E7EB',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                color: '#1F2937'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#F9FAFB';
                                e.target.style.borderColor = '#D1D5DB';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.borderColor = '#E5E7EB';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.8 10.2273C19.8 9.51818 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5818C15.3455 13.3 14.6182 14.3591 13.5273 15.0682V17.5773H16.8182C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                                <path d="M10.2 20C12.9 20 15.1727 19.1045 16.8182 17.5773L13.5273 15.0682C12.6182 15.6682 11.4818 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58182 11.9H1.18182V14.4909C2.81818 17.7591 6.24545 20 10.2 20Z" fill="#34A853"/>
                                <path d="M4.58182 11.9C4.38182 11.3 4.26818 10.6591 4.26818 10C4.26818 9.34091 4.38182 8.7 4.58182 8.1V5.50909H1.18182C0.509091 6.84545 0.109091 8.37727 0.109091 10C0.109091 11.6227 0.509091 13.1545 1.18182 14.4909L4.58182 11.9Z" fill="#FBBC05"/>
                                <path d="M10.2 3.97727C11.5909 3.97727 12.8273 4.48182 13.7909 5.40909L16.6909 2.50909C15.1682 1.09091 12.8955 0.2 10.2 0.2C6.24545 0.2 2.81818 2.44091 1.18182 5.70909L4.58182 8.3C5.38182 5.93636 7.59545 4.17727 10.2 4.17727V3.97727Z" fill="#EA4335"/>
                            </svg>
                            Sign {modalType === 'signin' ? 'in' : 'up'} with Google
                        </button>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '1.5rem',
                            fontSize: '0.9375rem',
                            color: '#6B7280'
                        }}>
                            {modalType === 'signin' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setModalType(modalType === 'signin' ? 'signup' : 'signin');
                                    resetForm();
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8B5CF6',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline'
                                }}
                            >
                                {modalType === 'signin' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </div>
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