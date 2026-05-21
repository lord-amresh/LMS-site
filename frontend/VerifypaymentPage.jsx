import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';

const API_BASE = "http://localhost:4000";

const VerifypaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;
    const verifyAndRedirect = async () => {
      const params = new URLSearchParams(location.search || "");
      const rawSession = params.get("session_id");
      const session_id = rawSession ? rawSession.trim() : null;
      const payment_status = params.get("payment_status");

      if (payment_status === "cancel") {
        if (!cancelled) navigate("/checkout", { replace: true });
        return;
      }

      if (!session_id) {
        if (!cancelled) 
          navigate('/mycourses?payment_status=Unpaid', { replace: true });
        return;
      }

      let clerkToken = null;
      try {
      clerkToken = await getToken();
    } 
    
    catch (e) {
      clerkToken = null;
    }

    const headers = {};
    if (clerkToken) headers["Authorization"] = `Bearer ${clerkToken}`;

    try {
      const res = await axios.get(`${API_BASE}/api/booking/confirm`, {
        params: { session_id },
        headers,
        withCredentials: true,
        timeout: 15000,
      });

      if(!cancelled) {
        if(res?.data?.success) {
          navigate('/myCourses?payment_status=Paid', {replace: true})
        } else {
          navigate("/my-courses?payment_status=Unpaid", { replace: true});
        }
      }
  } catch (err) {
        if (!cancelled)
          navigate("/mycourses?payment_status=Unpaid", { replace: true });
      }
    };

    verifyAndRedirect();
    return () => {
      cancelled = true;
    };
  }, [location.search, navigate, getToken]);

  return null; //for ui it will be null
}

export default VerifypaymentPage