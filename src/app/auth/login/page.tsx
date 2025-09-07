'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import InputBox from '@/components/inputbox.component';
import AnimationWrapper from '@/components/page.animation';
import { login } from '@/services/page';
import { useProfile } from '@/context/page';

const LoginPage = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState<string[] | null>(null);
    const { user,setUser, loading } = useProfile();
    const router = useRouter();

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

        if (!formData.email || !formData.password) {
            toast.error('Please enter email and password');
            return;
        }

        try {
            const res = await toast.promise(login(formData), {
                loading: 'Logging in...',
                success: 'Login successful!',
                error: 'Login failed',
            });

            if (res.success && res.token) {
                localStorage.setItem('token', res.token);
                setUser(res.user || null); // Update user context if user data is returned
                router.push('/dashboard');
            } else {
                toast.error(res.message || 'Login failed');
                setError([res.message || 'Login failed']);
            }
        } catch (err: any) {
            toast.error(err?.message || 'Unexpected error');
            setError([err?.message || 'Unexpected error']);
        }
    };

    return (
        <AnimationWrapper>
            <div className="flex relative px-1 md:px-0 justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white relative rounded-3xl shadow-xl flex items-center justify-between px-2 max-w-4xl overflow-hidden">
                    <div className="absolute w-16 opacity-50 h-16 rounded-full bg-blue-500 -top-1 -left-6 z-20" />

                    <div className="w-1/2 bg-blue-400 ml-6 hidden lg:flex rounded-3xl overflow-hidden items-center justify-center">
                        <Image
                            alt="Login Visual"
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                            src="https://res.cloudinary.com/dglwzejwk/image/upload/v1752307118/signup-image_ebpvhf.png"
                        />
                    </div>

                    <div className="left max-w-xl px-2 md:px-5 py-6 z-10">
                        <div className="headers flex flex-col items-center justify-center my-5">
                            <p className="text-slate-800 w-fit font-semibold tracking-normal text-2xl">Welcome back to the</p>
                            <p className="text-slate-800 w-fit font-semibold tracking-normal text-xl">
                                <span className="text-blue-500">Community</span>
                            </p>
                        </div>

                        <div className="social-buttons flex justify-center w-full gap-4">
                            <button className="cursor-pointer hover:border-blue-500 flex items-center justify-center w-fit py-1 px-2 border border-slate-200 rounded-full text-white">
                                <Image width={32} height={32} className="w-8 h-8 bg-center" src="https://www.pngmart.com/files/22/Google-PNG-File.png" alt="Google" />
                                <span className="text-slate-400 text-xs font-light">Sign in with Google</span>
                            </button>
                        </div>

                        <div className="text-center mb-1 text-slate-400">OR</div>
                        <p className={`my-2 mb-3 w-full py-2 px-2 border-l-2 ${error ? " border-red-500 bg-red-100 text-red-600 " : " border-slate-700 bg-slate-100 text-gray-600 "}  truncate text-sm`}>
                            {error ? error : "Enter your login credentials"}
                        </p>

                        <div className="classical-login min-w-80">
                            <form className="flex flex-col max-w-full items-center justify-center gap-5" onSubmit={handleFormSubmit}>
                                <InputBox value={formData.email} onChange={handleFormDataChange} name="email" type="email" label="Email" required />
                                <InputBox value={formData.password} onChange={handleFormDataChange} name="password" type="password" label="Password" required />

                                <div className="flex items-center w-full justify-between">
                                    <div className="flex items-center gap-2 ml-2">
                                        <span
                                            onClick={() => setRememberMe((prev) => !prev)}
                                            className="w-4 h-4 cursor-pointer border border-slate-200 bg-blue-50 flex items-center justify-center"
                                        >
                                            {rememberMe && <i className="fi fi-rr-check text-blue-600"></i>}
                                        </span>
                                        <span className="text-sm font-light text-slate-500">Remember me</span>
                                    </div>
                                    <button type="submit" className="py-1 px-6 bg-slate-50 text-slate-600 font-light uppercase text-sm border border-slate-400 hover:border-blue-500 rounded-full">
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="text-center font-light text-slate-500 text-sm mt-5">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-blue-500 z-30 font-medium cursor-pointer">
                                Sign up
                            </Link>
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

export default LoginPage;
