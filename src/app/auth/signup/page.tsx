'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InputBox from '@/components/inputbox.component';
import AnimationWrapper from '@/components/page.animation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { signup } from '@/services/page';
import { useProfile } from '@/context/page';

const SignupPage = () => {
    const { user, setUser, loading } = useProfile();
    const router = useRouter();

    const [termsCondition, setTermsCondition] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string[] | null>(null);

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);

    if (loading) return <div>Loading...</div>;

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (error) {
            setError(error.filter((err) => !err.toLowerCase().includes(name.toLowerCase())));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill all the fields');
            return;
        }

        if (!termsCondition) {
            toast.error('Please accept terms and conditions');
            return;
        }

        try {
            const res = await toast.promise(signup(formData), {
                loading: 'Signing up...',
                success: 'Signup successful!',
                error: 'Signup failed',
            });

            if (res.success && res.token) {
                console.log('Signup response token:', res.token);
                localStorage.setItem('token', res.token);
                setUser(res.user || null); // Update user context if user data is returned
                router.push('/dashboard');
            } else {
                toast.error(res.message || 'Signup failed');
                if (res.message) setError([res.message]);
            }
        } catch (error: any) {
            // console.log('Signup error:', error);
            setError(error?.message || ['Unexpected error occurred']);
            toast.error(error?.message || 'Unexpected error occurred');
            // setError(error.response?.data?.message || ['Unexpected error occurred']);
            // if (Array.isArray(error.response?.data?.message)) {
            //     setError(error.response.data.message);
            // } else {
            //     setError(error.response.data.message);
            //     toast.error(error.message || 'An unexpected error occurred.');
            // }
        }
    };

    return (
        <AnimationWrapper>
            <div className="flex relative px-1 md:px-0 justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white relative rounded-3xl shadow-xl flex items-center justify-between px-2 max-w-4xl overflow-hidden">
                    <div className="absolute w-16 opacity-50 h-16 rounded-full bg-blue-500 -top-1 -left-6 z-20" />

                    <div className="w-1/2 bg-blue-400 ml-6 hidden lg:flex rounded-3xl overflow-hidden items-center justify-center">
                        <Image
                            alt="Signup Visual"
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                            src="https://res.cloudinary.com/dglwzejwk/image/upload/v1752307118/signup-image_ebpvhf.png"
                        />
                    </div>

                    <div className="left max-w-xl px-2 md:px-5 py-6 z-10">
                        <div className="headers flex flex-col items-center justify-center my-5">
                            <p className="text-slate-800 w-fit font-semibold tracking-normal text-xl">Join the Fastest Growing</p>
                            <p className="text-slate-800 w-fit font-semibold tracking-normal text-xl">
                                <span className="text-blue-500">Community</span>
                            </p>
                        </div>

                        <div className="social-buttons flex justify-center w-full gap-4">
                            <button className="cursor-pointer hover:border-blue-500 flex items-center justify-center w-fit py-1 px-2 border border-slate-200 rounded-full text-white">
                                <img className="w-8 h-8 bg-center" src="https://www.pngmart.com/files/22/Google-PNG-File.png" alt="Google" />
                                <span className="text-slate-400 text-xs font-light">Sign up with Google</span>
                            </button>
                        </div>

                        <div className="text-center mb-1 text-slate-400">OR</div>
                        <p className={`my-2 mb-4 w-full py-2 px-2 border-l-2 ${error ? " border-red-500 bg-red-100 text-red-600 " : " border-slate-700 bg-slate-100 text-gray-600 "} truncate text-sm`}>
                            {error ? error : "Name, Email and Password are required to register"}
                        </p>

                        <div className="classical-login my-5 mt-2 min-w-80">
                            <form className="flex flex-col items-center justify-center gap-5" onSubmit={handleFormSubmit}>
                                <InputBox value={formData.name} onChange={handleFormDataChange} name="name" type="text" label="Enter name" required />
                                <InputBox value={formData.email} onChange={handleFormDataChange} name="email" type="email" label="Enter email" required />
                                <InputBox value={formData.password} onChange={handleFormDataChange} name="password" type="password" label="Enter password" required />

                                <div className="flex items-center w-full justify-between">
                                    <div className="flex w-full items-center justify-start gap-2 ml-2">
                                        <span
                                            onClick={() => setTermsCondition((prev) => !prev)}
                                            className="w-4 h-4 cursor-pointer border border-slate-200 bg-blue-50 flex items-center"
                                        >
                                            {termsCondition ? <i className="fi fi-rr-check text-blue-600" /> : ''}
                                        </span>
                                        <span className="text-sm font-light text-slate-500">Accept Terms and Conditions</span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="cursor-pointer min-w-fit py-1 px-3 border bg-slate-50 text-slate-600 font-light uppercase text-sm border-slate-400 hover:border-blue-500 rounded-full"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </form>

                            {/* {error && (
                                <div className="text-red-500 text-xs mt-1">
                                    {error.map((item, idx) => (
                                        <p key={idx}>{item}</p>
                                    ))}
                                </div>
                            )} */}
                        </div>

                        <div className="w-full text-center font-light text-slate-500 text-sm mt-5">
                            Already have an account?{' '}
                            <span className="text-blue-600 font-medium cursor-pointer" onClick={() => router.push('/auth/login')}>
                                Sign in
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-3 w-full text-center font-light text-slate-500 text-sm mt-10">
                    &copy; 2025 Dashboard. All rights reserved.
                </div>
            </div>
        </AnimationWrapper>
    );
};

export default SignupPage;
