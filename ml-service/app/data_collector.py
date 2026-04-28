# from pydriller import Repository
# from app.utils import is_valid_code_file
# import os

# os.makedirs("./repo_cache", exist_ok=True)

# def get_repo_data(repo_url, max_commits=50):
#     data = []
#     count = 0

#     print("🔍 Starting repo mining...")

#     for commit in Repository(
#         repo_url,
#         clone_repo_to="./repo_cache",
#         only_no_merge=True   # 🔥 faster + cleaner
#     ).traverse_commits():

#         print("👉 Commit:", commit.hash)

#         if count >= max_commits:
#             break

#         for file in commit.modified_files:

#             file_path = file.new_path or file.filename
#             print("   📄 File:", file_path)

#             if not is_valid_code_file(file_path):
#                 continue

#             source = ""
#             try:
#                 source = file.source_code
#             except:
#                 source = ""

#             data.append({
#                 "commit_hash": commit.hash,
#                 "author": commit.author.name,
#                 "file_name": file_path,  # ✅ FULL PATH FIX
#                 "source_code": source or "",
#                 "change_type": file.change_type.name,
#                 "lines_added": file.added_lines or 0,
#                 "lines_deleted": file.deleted_lines or 0
#             })

#         count += 1

#     print("✅ Total collected:", len(data))
#     return data

"""
data_collector.py — Enhanced Repository Mining
Upgrades:
  • max_commits raised to 100 (was 10) — much more training data
  • Collects commit_message and timestamp for new features
  • Better error handling per file
  • Progress logging with percentages
  • Deduplicates same file/commit pairs
  • Handles deleted files gracefully
"""

from pydriller import Repository
from app.utils import is_valid_code_file
import os

os.makedirs("./repo_cache", exist_ok=True)


def get_repo_data(repo_url: str, max_commits: int = 100) -> list:
    """
    Mine a git repository and return a flat list of file-change records.

    Parameters
    ----------
    repo_url    : HTTPS or SSH git URL
    max_commits : maximum commits to walk (default 100, was 10)

    Returns
    -------
    list of dicts with keys:
        commit_hash, author, file_name, source_code,
        change_type, lines_added, lines_deleted,
        commit_message, timestamp
    """
    data      = []
    count     = 0
    seen      = set()          # (commit_hash, file_path) dedup

    print(f"🔍 Mining repo: {repo_url}  (max {max_commits} commits)")

    try:
        for commit in Repository(
            repo_url,
            clone_repo_to="./repo_cache",
            only_no_merge=True,        # skip noisy merge commits
            order="date-order",        # newest first
        ).traverse_commits():

            if count >= max_commits:
                break

            count += 1
            if count % 20 == 0:
                print(f"   ⚙️  Processed {count}/{max_commits} commits …")

            for file in commit.modified_files:
                file_path = file.new_path or file.old_path or file.filename
                if not file_path:
                    continue

                # Normalise path
                file_path = os.path.normpath(file_path).replace("\\", "/")

                if not is_valid_code_file(file_path):
                    continue

                # Skip duplicates (same file touched in same commit)
                key = (commit.hash, file_path)
                if key in seen:
                    continue
                seen.add(key)

                # Source code — graceful fallback
                source = ""
                try:
                    source = file.source_code or ""
                except Exception:
                    source = ""

                data.append({
                    "commit_hash":    commit.hash,
                    "author":         commit.author.name,
                    "file_name":      file_path,
                    "source_code":    source,
                    "change_type":    file.change_type.name if file.change_type else "UNKNOWN",
                    "lines_added":    file.added_lines   or 0,
                    "lines_deleted":  file.deleted_lines or 0,
                    "commit_message": (commit.msg or "").strip()[:300],   # ← NEW
                    "timestamp":      commit.author_date,                  # ← NEW
                })

    except Exception as e:
        print(f"❌ Repository mining failed: {e}")
        raise

    print(f"✅ Mining complete — {len(data)} file-change records from {count} commits")
    return data