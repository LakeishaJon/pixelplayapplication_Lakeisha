import { useAuth } from '../js/auth';
import { AuthPage } from '../pages/AuthPage';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    // Show loading if auth is still being verified
    if (isAuthenticated === null) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // If not authenticated, show auth page
    if (!isAuthenticated || !user) {
        return <AuthPage />;
    }

    // If authenticated, render the protected content
    return children;
};