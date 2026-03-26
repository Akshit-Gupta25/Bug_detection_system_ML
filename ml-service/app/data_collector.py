from pydriller import Repository
from app.utils import is_valid_code_file




def get_repo_data(repo_url, max_commits=50):
    data = []
    count = 0

    for commit in Repository(repo_url).traverse_commits():
        if count >= max_commits:
            break

        for file in commit.modified_files:

            # 🔥 Skip unwanted files early
            if not is_valid_code_file(file.filename):
                continue

            data.append({
                "commit_hash": commit.hash,
                "author": commit.author.name,
                "file_name": file.filename,

                # 🔥 Safe source code handling
                "source_code": file.source_code or "",

                "change_type": file.change_type.name,
                "lines_added": file.added_lines or 0,
                "lines_deleted": file.deleted_lines or 0
            })

        count += 1

    return data
