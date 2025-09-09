#!/bin/bash
echo -e "Container/User\tGPU\tPID\tProcess\tVRAM"
# Loop over each GPU index
for gpu in $(nvidia-smi --query-gpu=index --format=csv,noheader); do
  # Query running processes on this GPU (PID, Name, Memory)
  nvidia-smi --query-compute-apps=pid,process_name,used_gpu_memory \
             --format=csv,noheader,nounits -i $gpu |
  while IFS=',' read -r pid proc_name mem; do
    # Check cgroup for container name
    container=$(grep -ao 'lxc.payload.\([^/]*\)' /proc/$pid/cgroup | head -1)
    if [[ -n "$container" ]]; then
      owner="${container#lxc.payload.}"      # strip the prefix to get name
    else
      owner=$(ps -o user= -p "$pid")         # get process owner if not in container
    fi
    echo -e "${owner}\t${gpu}\t${pid}\t${proc_name}\t${mem} MiB"
  done
done
