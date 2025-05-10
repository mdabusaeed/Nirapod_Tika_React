import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api-client';

const ActivateAccount = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await apiClient.post("auth/users/activation/",{uid, token});
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } catch (error) {
                console.error('Activation failed:', error);
                setError(error.response?.data?.message || 'Activation failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        activateAccount();
    }, [uid, token, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{message}</span>
                        <p className="mt-2 text-sm">Redirecting to login page...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivateAccount; 