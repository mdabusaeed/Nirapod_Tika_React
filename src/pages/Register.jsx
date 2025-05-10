import { useForm } from 'react-hook-form';
import useAuthContext from '../hooks/useAuthContext';
import ErrorAlert from '../components/Common/ErrorAlert';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { errorMassage, registerUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    const navigate = useNavigate();

    const handleSubmitForm = async (data) => {
        setIsLoading(true);
        setSuccessMessage("");
        try {
            await registerUser(data);
            setSuccessMessage("Registration successful! Please check your email for verification.");
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } catch (error) {
            console.log('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    {errorMassage && <ErrorAlert error={errorMassage} />}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{successMessage}</span>
                        </div>
                    )}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="first-name" className="sr-only">
                                First Name
                            </label>
                            <input
                                id="first-name"
                                name="first_name"
                                type="text"
                                autoComplete="given-name"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="First Name"
                                {...register('first_name', { required: "First name is required" })}
                            />
                            {errors.first_name && <span className="text-red-500">{errors.first_name.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="last-name" className="sr-only">
                                Last Name
                            </label>
                            <input
                                id="last-name"
                                name="last_name"
                                type="text"
                                autoComplete="family-name"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Last Name"
                                {...register('last_name', { required: "Last name is required" })}
                            />
                            {errors.last_name && <span className="text-red-500">{errors.last_name.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Email address"
                                {...register('email', { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </div>
                        <div>
                                <label htmlFor="phone-number" className="sr-only">
                                    Phone Number
                                </label>
                                <input
                                    id="phone-number"
                                    name="phone_number"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Phone Number (e.g., 01xxxxxxxxx)"
                                    {...register('phone_number', { 
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^(01)[0-9]{9}$|^\+8801[0-9]{9}$/,
                                            message: "Please enter a valid Bangladesh phone number (e.g., 01xxxxxxxxx or +88 format)"
                                        }
                                    })}
                                />
                                {errors.phone_number && <span className="text-red-500">{errors.phone_number.message}</span>}
                                <p className="mt-1 text-xs text-gray-500">Enter a valid Bangladesh phone number (e.g., 01767730638 or +8801767730638)</p>
                        </div>
                        <div>
                            <label htmlFor="nid" className="sr-only">
                                NID
                            </label>
                            <input
                                id="nid"
                                name="nid"
                                type="text"
                                autoComplete="nid"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.nid ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="NID"       
                                {...register('nid', { required: "NID is required" })}
                            />
                            {errors.nid && <span className="text-red-500">{errors.nid.message}</span>}
                        </div>
                        
                        <div>
                            <label htmlFor="address" className="sr-only">
                                Address
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="street-address"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Address"
                                {...register('address', { required: "Address is required" })}
                            />
                            {errors.address && <span className="text-red-500">{errors.address.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Password"
                                {...register('password', { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                            />
                            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm_password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Confirm Password"
                                {...register('confirm_password', { 
                                    required: "Please confirm your password",
                                    validate: value => value === document.getElementById('password').value || "Passwords do not match"
                                })}
                            />
                            {errors.confirm_password && <span className="text-red-500">{errors.confirm_password.message}</span>}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            {...register('terms', { required: "You must accept the terms and conditions" })}
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            I agree to the{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Terms and Conditions
                            </a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg
                                            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    Register
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;