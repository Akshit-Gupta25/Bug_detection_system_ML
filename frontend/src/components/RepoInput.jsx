import { useState } from "react";

const RepoInput = ({onAnalyze , loading}) => {
    const [repoUrl ,setRepoUrl] = useState("");
    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex gap-3 mb-6">
            <input 
            type ="text" 
            placeholder="Enter GitHub Repo URL"
            value = {repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)} 
            className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => onAnalyze(repoUrl)} disabled={loading}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${ loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
            >
                         {loading ? "Analyzing..." : "Analyze"}
            </button>
        </div>
    );
};
export default RepoInput;