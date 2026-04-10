from pydriller import Repository
from app.utils import is_valid_code_file
import os

os.makedirs("./repo_cache", exist_ok=True)

def get_repo_data(repo_url, max_commits=50):
    data = []
    count = 0

    print("🔍 Starting repo mining...")

    for commit in Repository(
        repo_url,
        clone_repo_to="./repo_cache",
        only_no_merge=True   # 🔥 faster + cleaner
    ).traverse_commits():

        print("👉 Commit:", commit.hash)

        if count >= max_commits:
            break

        for file in commit.modified_files:

            file_path = file.new_path or file.filename
            print("   📄 File:", file_path)

            if not is_valid_code_file(file_path):
                continue

            source = ""
            try:
                source = file.source_code
            except:
                source = ""

            data.append({
                "commit_hash": commit.hash,
                "author": commit.author.name,
                "file_name": file_path,  # ✅ FULL PATH FIX
                "source_code": source or "",
                "change_type": file.change_type.name,
                "lines_added": file.added_lines or 0,
                "lines_deleted": file.deleted_lines or 0
            })

        count += 1

    print("✅ Total collected:", len(data))
    return data
