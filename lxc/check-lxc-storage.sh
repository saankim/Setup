#!/usr/bin/env zsh

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Print header
echo -e "${CYAN}Container usage in /var/snap/lxd/common/lxd/storage-pools/default/containers:${RESET}"

# Use 'find' + 'du' + sorting
sudo find /var/snap/lxd/common/lxd/storage-pools/default/containers \
  -mindepth 1 -maxdepth 1 -type d \
  -exec du -sh {} + 2>/dev/null \
| sort -hr \
| while read size fullpath; do
  # Extract just the container name
  container="$(basename "${fullpath}")"
  # Default color for size is GREEN
  color="${GREEN}"

  # If size ends with "G" and numeric portion > 100, switch color to RED
  if [[ "${size}" == *G ]]; then
    # Grab just the numeric portion
    numonly="${size//[^0-9.]/}"
    # Compare as a float or integer
    if (( ${numonly%.*} > 100 )); then
      color="${RED}"
    fi
  fi

  echo -e "${color}${size}${RESET}\t${YELLOW}${container}${RESET}"
done
