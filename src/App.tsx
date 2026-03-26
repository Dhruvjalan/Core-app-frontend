import { Routes, Route } from "react-router-dom";
import axios from "./utils/_axios";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import "./App.css";
import { ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import  Company_Type from "./types/company.ts";

// import React from 'react';
// import { BrowserRouter as Router} from 'react-router-dom';
// import RequireAuth from "./utils/requireAuth.tsx";


function App() {
	const [access,setAccess] = useState<string>('')
	const [company, setCompany] = useState<Company_Type>();
	const [name, setName] = useState<string>('');
	// const [vertical, setVertical] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	// useEffect(() => {
	// 	// frontend cookie here
	// 	const token = Cookies.get("wedonttellsuchthings")
	// 	const access_cookie = Cookies.get('ACCESS') || 'none'

		
		

	// 	if (token) {
	// 		try {
	// 			const payload = JSON.parse(atob(token.split(".")[1]))
	// 			// console.log("Payload",payload)
	// 			setEmail(payload.email)
	// 			const pattern = /^([a-z]{2}\d{2}[a-z]\d{3})@smail\.iitm\.ac\.in$/
	// 			const match = payload.email.toLowerCase().match(pattern)
	// 			if (match) {

	// 				const roll = match[1].toUpperCase()


	// 				const member = members.find((m: { name: string; roll: string; access: string }) => m.roll.toUpperCase() === roll)
	// 				// console.log("memeber",member)
	// 				if (member) {
	// 					setName(member.name)
	// 					setVertical(member.vertical)
	// 					setAccess(access_cookie)
	// 					// console.log("Found Name: ",name, "Email ",email, "Access: ",access, "Vertical: ", vertical)
	// 				}		
	// 			}
	// 	} catch {
	// 		}
	// 	}
	// }, [])


	useEffect(() => {
    const initializeUser = async () => {
        let token = null;
        let access_cookie = 'none'; // Default fallback

        // 1. Fetch Cookies from Backend
        // try {
        //     // Fetch 'wedonttellsuchthings'
        //     const tokenRes = await axios.post(
        //         '/getcookie', 
        //         { cookieattr: "wedonttellsuchthings" }, 
        //         { withCredentials: true }
        //     );
        //     token = tokenRes.data;

        //     // Fetch 'ACCESS'
        //     const accessRes = await axios.post(
        //         '/getcookie', 
        //         { cookieattr: "ACCESS" }, 
        //         { withCredentials: true }
        //     );
        //     if (accessRes.data) {
        //         access_cookie = accessRes.data;
        //     }
        // } catch (error) {
        //     // If fetching fails (e.g., 401/404), we just log it and proceed.
        //     // 'token' remains null, so the logic below simply won't run.
        //     console.error("Failed to load cookies from backend:", error);
        // }

        // 2. Process Token Logic (Existing)
        // if (token) {
        //     try {
        //         const payload = JSON.parse(atob(token.split(".")[1]));
        //         // console.log("Payload",payload)
        //         setEmail(payload.email);

        //         const pattern = /^([a-z]{2}\d{2}[a-z]\d{3})@smail\.iitm\.ac\.in$/;
        //         const match = payload.email.toLowerCase().match(pattern);

        //         if (match) {
        //             const roll = match[1].toUpperCase();

        //             // Note: Added 'vertical' to type definition since you use it below
        //             const member = members.find((m: { name: string; roll: string; access: string; vertical: string }) => m.roll.toUpperCase() === roll);
                    
        //             if (member) {
        //                 setName(member.name);
        //                 // setVertical(member.vertical);
        //                 setAccess(access_cookie);
        //             }       
        //         }
        //     } catch (error) {
        //         console.error("Error parsing token payload:", error);
        //     }
        // }
    };

    initializeUser();
}, []);
	
	return (
		<ConfigProvider
			theme={{
				components: {
					Input: {
						colorTextPlaceholder: "#ffffff80",
						colorText: "white",
						fontSize: 20,
						padding: 10,
					},
					Button: {
						defaultColor: "var(--primary)",
						dangerColor: "none",
					},
					Dropdown: {
						colorBgElevated: "var(--neutral)",
					},
				},
			}}
		>
			<Routes>
  <Route
    path="/dashboard"
    element={
		// <RequireAuth>
      <Dashboard

      />
	//   </RequireAuth>
    }
  />
  <Route path="/login" element={<Login />} />
  
    <Route path="/" element={<Login />} />

  <Route path="*" element={<h1>Look at our awesome handling! </h1>} />
</Routes>


		</ConfigProvider>
	);
}

export default App;
