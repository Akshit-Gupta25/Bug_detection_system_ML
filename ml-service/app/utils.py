VALID_EXTENSIONS = (".py", ".js", ".ts", ".java", ".cpp", ".c" , ".jsx" , ".tsx")

def is_valid_code_file(file_name):
    return file_name and file_name.endswith(VALID_EXTENSIONS)
