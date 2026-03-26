    export const analyzeeRepo = async (repoUrl) => {
        const response = await fetch(
            `http://127.0.0.1:8000/analyze?repo_url=${repoUrl}`
        );
        return await response.json();
    };
