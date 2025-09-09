import torch

def get_device():
    return torch.device(
        "mps"
        if torch.backends.mps.is_available()
        else "cuda" if torch.cuda.is_available() else "cpu"
    )

DEVICE = get_device()
print(f"PyTorch is using {DEVICE}")
