import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate()

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const { register,checkAuth} = useAuthStore()


      useEffect(() => {
        checkAuth()
    
      }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await register(data.name, data.email, data.password)
        if (!res) {

            alert("Failed to register");
            return
        }
        alert(res.message)
        navigate("/")

        setData({
            name: "",
            email: "",
            password: ""
        })

    }
    return (
        <div className="flex h-screen bg-gray-900 text-white">

            {/* LEFT SIDE - FORM */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-80">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        Create Account
                    </h1>

                    <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                        <input
                            value={data.name}
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500/30"
                        />

                        <input
                            value={data.email}
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500/40"
                        />

                        <input
                            value={data.password}
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500/20"
                        />
                        <div> <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-500 hover:underline cursor-pointer"
                            >
                                Login
                            </Link>
                        </p></div>

                        <button
                            type="submit"
                            className="w-full bg-blue-900/20 hover:bg-blue-700/45 transition p-3 rounded-lg font-semibold"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE - ANIMATIONS */}
            <div className="w-1/2 flex items-center justify-center bg-gray-800 relative overflow-hidden">

                {/* Square */}
                <div className="w-20 h-20 bg-green-800/70 animate-pulse absolute left-1/3"></div>

                {/* Triangle */}
                <div
                    className="absolute right-1/3 animate-pulse"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: "40px solid transparent",
                        borderRight: "40px solid transparent",
                        borderBottom: "70px solid #60A5FA",
                    }}
                ></div>

                {/* Another Square */}
                <div className="w-16 h-16 bg-blue-800/40 animate-pulse absolute bottom-1/3"></div>

            </div>
        </div>
    );
};

export default Signup;