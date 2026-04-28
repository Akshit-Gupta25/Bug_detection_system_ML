const ResultsTable = ({ data, onRowClick, selectedFile }) => {
  return (
    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-md">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3">File</th>
          <th className="p-3">Risk</th>
          <th className="p-3">Probability</th>
          <th className="p-3">Churn</th>
          <th className="p-3">Issues</th>
          <th className="p-3">Priority</th>

        </tr>
      </thead>

      <tbody>
        {data.map((file) => {
          const onlyNoIssue =
            file.code_issues?.length === 1 &&
            file.code_issues[0]?.message === "No major issues detected";

          return (
            <tr
              key={file.file_name}
              onClick={() => onRowClick(file)}
              className={`cursor-pointer transition hover:bg-gray-100 
              ${selectedFile?.file_name === file.file_name ? "bg-blue-50" : ""}`}
            >
              <td className="p-3 flex items-center gap-2">
                📄 <span>{file.file_name}</span>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    file.risk_level === "HIGH"
                      ? "bg-red-400"
                      : file.risk_level === "MEDIUM"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                >
                  {file.risk_level}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={`font-semibold ${
                    file.bug_probability >= 0.7
                      ? "text-red-500"
                      : file.bug_probability >= 0.3
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {(Number(file.bug_probability) * 100).toFixed(0)}%
                </span>
              </td>

              <td className="p-3">{file.total_churn}</td>

              <td className="p-3">
                {!onlyNoIssue ? (
                  <span className="bg-red-100 px-2 py-1 rounded text-red-500">
                    {file.code_issues.length} issues
                  </span>
                ) : file.bug_probability > 0.5 ? (
                  <span className="bg-yellow-100 px-3 py-1 rounded text-yellow-500">
                    Risky
                  </span>
                ) : (
                  <span className="bg-green-100 px-3 py-1 rounded text-green-500">
                    Clean
                  </span>
                )}
              </td>
              <td className="p-3 text-purple-600 font-bold">
                  {file.priority_score?.toFixed(2)}
              </td>

            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ResultsTable;
  