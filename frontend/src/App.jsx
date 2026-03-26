import './App.css';
import { useState } from 'react';
import RepoInput from './components/RepoInput';
import ResultsTable from './components/ResutlsTable';
import { analyzeeRepo } from './api';
import RiskChart from './components/RiskChart';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile , setSelectedFile] = useState(null);

  const handleAnalyze = async (repoUrl) => {
    setLoading(true);
    try {
      const data = await analyzeeRepo(repoUrl);
      setResults(data.predictions);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg'>
        <h1 className='text-3xl font-bold'>Learn To Earn 🚀</h1>
        <p className='text-sm opacity-90'>
          AI-Powered Bug Detection & Developer Intelligence Platform
        </p>
      </div>

      <div className='max-w-6xl mx-auto p-6'>

        <RepoInput onAnalyze={handleAnalyze} loading={loading} />

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-10">
            Enter a GitHub repository to analyze bug risk 🚀
          </div>
        )}

        {/* Dashboard Section */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            {/* LEFT SIDE */}
            <div className="md:col-span-2 space-y-4">

              {/* Hero Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-red-500">
                <h2 className="text-xl font-semibold mb-2">
                  ⚠️ Most Risky File
                </h2>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      {results[0]?.file_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      High probability of bugs detected
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-red-500 text-2xl font-bold">
                      {results[0]?.bug_probability != null
  ? `${(Number(results[0].bug_probability) * 100).toFixed(0)}%`
  : "N/A"}

                    </p>
                    <p className="text-sm text-gray-500">Risk Score</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-white p-4 rounded-xl shadow-md">
                  <p className="text-gray-500">Total Files</p>
                  <h2 className="text-2xl font-bold">{results.length}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                  <p className="text-gray-500">High Risk</p>
                  <h2 className="text-2xl font-bold text-red-500">
                    {results.filter(f => f.risk_level === "HIGH").length}
                  </h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                  <p className="text-gray-500">Low Risk</p>
                  <h2 className="text-2xl font-bold text-green-500">
                    {results.filter(f => f.risk_level === "LOW").length}
                  </h2>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE (Chart) */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center hover:shadow-lg transition duration-300">
              <h2 className="text-lg font-semibold mb-2">
                Risk Distribution
              </h2>

              <RiskChart data={results} />
            </div>

          </div>
        )}

        {/* Table */}
        {results.length > 0 && (
          <div className="animate-fade-in">
            <ResultsTable data={results}
            onRowClick = {setSelectedFile} 
            selectedFile = {selectedFile}/>
          </div>
        )}
      {selectedFile && (
  <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 border border-gray-200">

    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">📄 File Details</h2>

      <span className={`px-3 py-1 rounded-full text-sm font-semibold
        ${selectedFile.risk_level === "HIGH" ? "bg-red-100 text-red-600" :
          selectedFile.risk_level === "MEDIUM" ? "bg-yellow-100 text-yellow-600" :
          "bg-green-100 text-green-600"}
      `}>
        {selectedFile.risk_level}
      </span>
    </div>

    {/* File Name */}
    <p className="text-lg font-bold mb-4">{selectedFile.file_name}</p>

    {/* Metrics */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <p className="text-gray-500 text-sm">Bug Probability</p>
        <p className="font-bold text-lg text-red-500">
          {(selectedFile.bug_probability * 100).toFixed(0)}%
        </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <p className="text-gray-500 text-sm">Churn</p>
        <p className="font-bold text-lg">{selectedFile.total_churn}</p>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <p className="text-gray-500 text-sm">Stability</p>
        <p className="font-bold text-lg text-blue-500">
          {selectedFile.stability_score}
        </p>
      </div>
    </div>

    {/* 🔥 CODE ISSUES SECTION */}
    <div>
      <h3 className="font-semibold mb-2">🚨 Code Issues Detected</h3>

      {selectedFile.code_issues?.length > 0 ? (
        <div className="space-y-2">
          {selectedFile.code_issues.map((issue, i) => (
            <div
              key={i}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              ⚠️ {issue}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">
          ✅ No major code issues detected
        </div>
      )}
    </div>

  </div>
)}



      </div>
    </div>
  );
}

export default App;
