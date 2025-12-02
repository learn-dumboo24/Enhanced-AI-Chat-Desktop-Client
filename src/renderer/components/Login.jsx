import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login - just proceed
        if (email && password) {
            onLogin();
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#171717] text-white">
            <div className="w-full max-w-md p-8 flex flex-col items-center">
                {/* Logo / Icon */}
                <div className="w-12 h-12 bg-white rounded-full mb-8 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>

                <form onSubmit={handleSubmit} className="w-full space-y-4 mt-8">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full p-4 rounded-lg bg-[#2f2f2f] border border-[#424242] focus:border-green-500 focus:outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 rounded-lg bg-[#2f2f2f] border border-[#424242] focus:border-green-500 focus:outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium p-4 rounded-lg transition-colors mt-4"
                    >
                        Continue
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-400">
                    Don't have an account? <span className="text-[#10a37f] cursor-pointer hover:underline">Sign up</span>
                </div>

                <div className="flex items-center w-full my-6">
                    <div className="flex-1 h-px bg-[#424242]"></div>
                    <span className="px-4 text-xs text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-[#424242]"></div>
                </div>

                <div className="w-full space-y-3">
                    <button className="w-full p-3 rounded-lg border border-[#424242] hover:bg-[#2f2f2f] flex items-center justify-center gap-3 transition-colors">
                        <span className="text-lg">G</span>
                        Continue with Google
                    </button>
                    <button className="w-full p-3 rounded-lg border border-[#424242] hover:bg-[#2f2f2f] flex items-center justify-center gap-3 transition-colors">
                        <span className="text-lg">M</span>
                        Continue with Microsoft
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
