from pydriller import Repository

def get_repo_data(repo_url, max_commits=50):
    data = []
    count = 0

    for commit in Repository(repo_url).traverse_commits():
        if count >= max_commits:
            break

        for file in commit.modified_files:
            data.append({
                "commit_hash": commit.hash,
                "author": commit.author.name,
                "file_name": file.filename,
                "change_type": file.change_type.name,
                "lines_added": file.added_lines,
                "lines_deleted": file.deleted_lines
            })

        count += 1

    return data
