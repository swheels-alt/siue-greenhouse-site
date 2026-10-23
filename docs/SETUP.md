# Setup

Goal (QA plan Q3 and M16): a developer outside the team gets from `git clone` to a passing
`make test` in 30 minutes or less once the prerequisites below are installed, and in 2 hours or
less including installing them, from these instructions alone (QA plan 9.4). If you get stuck,
log where and how long it cost in an issue labeled `onboarding`.

## Prerequisites

| Tool | Version | Windows (WSL2 Ubuntu) and Linux | macOS |
| --- | --- | --- | --- |
| Git | any recent | `sudo apt install git` | `xcode-select --install` |
| make, g++, CMake | g++ with C++17, CMake 3.20+ | `sudo apt install build-essential cmake` | `xcode-select --install`, then `brew install cmake` |
| clang-format, clang-tidy | any recent | `sudo apt install clang-format clang-tidy` | `brew install llvm` |
| Python | 3.12 or newer (CI uses `.python-version`) | Ubuntu 24.04: `sudo apt install python3 python3-venv`. Ubuntu 22.04 ships 3.10, which is too old: `sudo add-apt-repository ppa:deadsnakes/ppa`, `sudo apt install python3.12 python3.12-venv`, then run `make setup PYTHON=python3.12` | `brew install python@3.12` |
| Node.js | `.nvmrc` | install nvm, then `nvm install` | `brew install nvm`, then `nvm install` |
| Docker Desktop | current | docker.com, with WSL2 integration on | docker.com |

On Windows, install WSL2 with Ubuntu first and run every command in the Ubuntu terminal.

## Steps

Follow the quick start in the [README](../README.md). Then check:

- `make test` ends with Python, C++ and front-end tests all passing.
- `make lint` reports no problems.
- Docker Desktop shows the `db` container as healthy after `make db-up`.

Problems: [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
