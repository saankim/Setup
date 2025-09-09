# %%
#!/usr/bin/env python3
import re, pwd, subprocess, xml.etree.ElementTree as ET

# Get XML output from nvidia-smi (query all info)
xml_data = subprocess.check_output(["nvidia-smi", "-q", "-x"], encoding="utf-8")
root = ET.fromstring(xml_data)

# Header for output
print(f"{'Container/User':20} {'GPU':>3} {'PID':>7} {'Process Name':25} {'VRAM':>8}")
for gpu in root.findall("gpu"):
    gpu_id = gpu.findtext("minor_number") or gpu.get("id") or "?"  # GPU index or ID
    proc_list = gpu.find("processes")
    if proc_list is None:
        continue
    for proc in proc_list.findall("process_info"):
        pid = int(proc.findtext("pid"))
        pname = proc.findtext("process_name")
        used_mem = proc.findtext("used_memory")  # e.g. "256 MiB"
        # Determine container name via cgroup
        container_name = None
        try:
            with open(f"/proc/{pid}/cgroup") as cg:
                for line in cg:
                    m = re.search(r"lxc\.payload\.([^/]+)", line)
                    if m:
                        container_name = m.group(1)
                        break
        except FileNotFoundError:
            pass
        if container_name:
            owner = container_name  # process is in this LXC container
        else:
            try:
                # Fallback to process owner's username
                uid_str = re.search(r"Uid:\s+(\d+)", open(f"/proc/{pid}/status").read())
                uid = int(uid_str.group(1)) if uid_str else -1
            except FileNotFoundError:
                uid = -1
            owner = pwd.getpwuid(uid).pw_name if uid >= 0 else "host"
        # Print the information row
        proc_name_short = (
            (pname[:22] + "...") if len(pname) > 25 else pname
        )  # truncate name for width
        print(f"{owner:20} {gpu_id:>3} {pid:7} {proc_name_short:25} {used_mem:>8}")
