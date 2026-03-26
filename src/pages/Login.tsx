import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoLight from "../assets/logo-light.svg";
import "../assets/styles/Login.css";

// Pro-tip: Move this to a .env file later (e.g., import.meta.env.VITE_API_BASE)
const API_BASE = import.meta.env.VITE_PRODUCTION=="true"? import.meta.env.VITE_PROD_BACKEND_URL: import.meta.env.VITE_DEV_BACKEND_URL;
// const API_BASE = import.meta.env.VITE_DEV_BACKEND_URL;
console.log(" In Login - API BASE URL:", API_BASE, "PROD: ", import.meta.env.VITE_PRODUCTION);

function Login() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        // Reset state before making the request
        setIsDisabled(true);
        setError(""); 

        try {
            // Extract the first 8 characters for the roll number
            const rollno = email.slice(0, 8).toLowerCase();

            // Directly query the backend API
            const url = `${API_BASE}/api/check-user/${rollno}`;
            console.log("SENDING ROLL NO CHECK TO API URL:", url);
            const response = await axios.get(url);
            console.log("API RESPONSE:", response.data);

            if (response.data.exists) {
                navigate("/dashboard", { state: { showLoginToast: true } });
            } else {
                setError(response.data.message || "User does not exist.");
            }
        } catch (err: any) {
            console.error("Login API Error:", err);
            // Gracefully handle server errors or network failures
            setError(
                err.response?.data?.message || 
                "Cannot connect to the server. Please try again later."
            );
        } finally {
            // Always re-enable the button, whether it succeeded or failed
            setIsDisabled(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="login">
                <div className="logo-container" style={{color:"white",fontWeight:"bold",fontSize:"30px"}}> LOGIN</div>
                <div className="sign-in-info" style={{color:"white"}}>Sign in using your smail account</div>

                <div className="login-grid">
                    <p style={{ fontWeight: "bold",color:"white"}}>Smail</p>
                    <div className="grid-row">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="on"
                            disabled={isDisabled}
                            className="email-input"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    
                </div>

                {/* Conditional Error Rendering */}
                {error && <div className="error">Error: {error}</div>}

                <a className="forgot-password" href="/resetpassword">
                    Forgot Password?
                </a>

                <input 
                    type="submit" 
                    value={isDisabled ? "LOGGING IN..." : "LOGIN"} 
                    id="login-button" 
                    disabled={isDisabled} 
                />
            </div>
        </form>
    );
}

export default Login;