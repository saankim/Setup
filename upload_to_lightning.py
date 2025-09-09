#! pip install lightning_sdk
import os
from lightning_sdk import Studio

# Initialize the Studio with your project details
studio = Studio(name="main", teamspace="saan-kim", user="saankim")

# Set your explicit local and remote root paths
local_root = "/path/to/local/root"     # Replace with your local root path
remote_root = "/path/to/remote/root"   # Replace with your desired remote root path

# Walk through all files in the local root directory
for root, _, files in os.walk(local_root):
    for f in files:
        # Calculate the relative path from the local root
        relative_path = os.path.relpath(root, local_root)
        # Build the remote path by joining the remote root with the relative path and filename
        remote_path = os.path.join(remote_root, relative_path, f)
        # Build the full local file path
        local_file = os.path.join(root, f)
        # Upload the file to the remote path
        studio.upload_file(local_file, remote_path)
