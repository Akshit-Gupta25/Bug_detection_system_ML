from pydriller import Repository
from app.utils import is_valid_code_file
import os
os.makedirs("./repo_cache", exist_ok=True)

def get_repo_data(repo_url, max_commits=50):
    data = []
    count = 0

    for commit in Repository(
        repo_url,
        clone_repo_to="./repo_cache",
        only_modifications_with_file_types=[".py", ".js", ".ts"]  # 🔥 IMPORTANT FIX
    ).traverse_commits():

        if count >= max_commits:
            break

        for file in commit.modified_files:

            if not is_valid_code_file(file.filename):
                continue

            # 🔥 SAFE SOURCE EXTRACTION
            source = ""
            try:
                source = file.source_code
            except:
                source = ""

            data.append({
                "commit_hash": commit.hash,
                "author": commit.author.name,
                "file_name": file.filename,
                "source_code": source or "",   # ✅ now works
                "change_type": file.change_type.name,
                "lines_added": file.added_lines or 0,
                "lines_deleted": file.deleted_lines or 0
            })

        count += 1

    return data
