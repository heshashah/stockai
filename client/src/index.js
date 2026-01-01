import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Information from "./Information";
//import Update from "./Update";
import SensexChart from "./SensexChart";
import RiskDashboard from "./RiskDashboard";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import NewsPage from "./pages/NewsPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="1031707592152-11cgtb56urlghbenvpdp8h6bqjbf3cge.apps.googleusercontent.com">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/information" element={<Information />} />
        {/* <Route path="/update" element={<Update />} /> */}
        <Route path="/sensex" element={<SensexChart />} />
        <Route path="/risk" element={<RiskDashboard />} />
        <Route path="/sentiment" element={<SentimentAnalysis />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
