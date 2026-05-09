'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, AlertTriangle, ShieldCheck, Download, Loader2, ArrowRightLeft, Mail, Send } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isPhishingCheck, setIsPhishingCheck] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [phishingResults, setPhishingResults] = useState<any>(null);
  const [error, setError] = useState('');

  // Email state
  const [receiverEmail, setReceiverEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL structure (e.g., https://example.com)');
      return;
    }

    setError('');
    setIsScanning(true);
    setResults(null);
    setEmailStatus(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      });

      if (!response.ok) {
        let errorMessage = 'Scan failed. Please try again.';
        try {
          const errData = await response.json();
          if (errData.error) errorMessage = errData.error;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during the scan.');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePhishingCheck = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    setIsPhishingCheck(true);
    setPhishingResults(null);

    try {
      const response = await fetch('/api/phishing-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      });

      if (!response.ok) {
        throw new Error('Phishing detection failed. Ensure the python backend is running.');
      }

      const data = await response.json();
      setPhishingResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during phishing check.');
    } finally {
      setIsPhishingCheck(false);
    }
  };

  const handleSendEmail = async () => {
    if (!receiverEmail) {
      setEmailStatus({ type: 'error', message: 'Please enter a receiver email address.' });
      return;
    }
    if (!results) {
      setEmailStatus({ type: 'error', message: 'No scan results to send. Run a scan first.' });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverEmail,
          url: url.startsWith('http') ? url : `https://${url}`,
          score: results.score,
          vulnerabilities: results.vulnerabilities || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email.');
      }

      setEmailStatus({ type: 'success', message: data.message || 'Email sent successfully!' });
    } catch (err: any) {
      setEmailStatus({ type: 'error', message: err.message || 'An error occurred while sending the email.' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-12 mt-10">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/20 rounded-full border border-blue-500/30">
              <ShieldCheck className="w-16 h-16 text-blue-400" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            ThreatLens
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Professional Web Vulnerability Scanner & AI Phishing Detection.
            Enter a target URL to assess its security posture.
          </p>
        </header>

        {/* Search Bar Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                id="url-input"
                placeholder="https://kalasalingam.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
            </div>
            <button
              type="submit"
              id="start-scan-btn"
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Start Scan'
              )}
            </button>
            <button
              type="button"
              id="phishing-check-btn"
              onClick={handlePhishingCheck}
              disabled={isPhishingCheck}
              className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 disabled:bg-slate-800 disabled:border-slate-800 disabled:text-slate-500 text-indigo-300 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isPhishingCheck ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
              AI Phishing Check
            </button>
          </form>
          {error && <p className="text-red-400 mt-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{error}</p>}
        </div>

        {/* Phishing Results */}
        {phishingResults && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldAlert className="text-indigo-400 w-6 h-6" /> AI Phishing Analysis
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Status</p>
                <div className={`text-3xl font-bold ${phishingResults.is_phishing ? 'text-red-500' : 'text-green-500'}`}>
                  {phishingResults.is_phishing ? 'PHISHING' : 'SAFE'}
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Confidence</p>
                <div className="text-3xl font-bold text-blue-400">
                  {(phishingResults.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Risk Level</p>
                <div className={`text-3xl font-bold ${phishingResults.risk_level === 'High' ? 'text-red-500' : phishingResults.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {phishingResults.risk_level}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan Results Display */}
        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center shadow-lg">
                <span className="text-slate-400 font-medium mb-2">Security Score</span>
                <span className={`text-6xl font-black ${results.score >= 80 ? 'text-green-500' : results.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {results.score}
                </span>
                <span className="text-slate-500 text-sm mt-2">/ 100</span>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Total Vulnerabilities</span>
                  <span className="text-2xl font-bold text-white">{results.vulnerabilities?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> High</span>
                  <span className="font-semibold">{results.vulnerabilities?.filter((v: any) => v.severity === 'High').length || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Medium</span>
                  <span className="font-semibold">{results.vulnerabilities?.filter((v: any) => v.severity === 'Medium').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Low</span>
                  <span className="font-semibold">{results.vulnerabilities?.filter((v: any) => v.severity === 'Low').length || 0}</span>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center shadow-lg gap-4">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" /> Compare Scans
                </button>
              </div>
            </div>

            {/* Email Report Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <Mail className="text-blue-400 w-6 h-6" />
                <h2 className="text-2xl font-bold">Email Security Report</h2>
              </div>
              <p className="text-slate-400 mb-5">
                Send a full HTML security report for <span className="text-blue-400 font-mono">{url}</span> directly to an email address.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    id="receiver-email-input"
                    placeholder="recipient@example.com"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  />
                </div>
                <button
                  id="send-email-btn"
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 min-w-[180px]"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Report
                    </>
                  )}
                </button>
              </div>
              {emailStatus && (
                <div className={`mt-4 flex items-center gap-2 ${emailStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {emailStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{emailStatus.message}</span>
                </div>
              )}
            </div>

            {/* Detailed Vulnerabilities */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold">Vulnerability Details</h2>
              </div>

              {results.vulnerabilities?.length > 0 ? (
                <div className="space-y-4">
                  {results.vulnerabilities.map((vuln: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{vuln.name || vuln.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          vuln.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          vuln.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-4">{vuln.description}</p>
                      {vuln.recommendation && (
                        <div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded-lg mt-4">
                          <span className="text-blue-400 font-semibold block mb-1">Recommendation:</span>
                          <p className="text-slate-300 text-sm">{vuln.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">No Vulnerabilities Found!</h3>
                  <p className="text-slate-400 mt-2">The application appears to be secure against the tested attack vectors.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
