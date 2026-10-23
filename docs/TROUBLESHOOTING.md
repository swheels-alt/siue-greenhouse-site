# Troubleshooting

Add a row whenever someone gets stuck and finds the fix. Rows marked *after ADR 0001* describe
`make migrate`, `make run` and the dev login, which do not exist yet (docs/DEBT.md).

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `make db-up` fails: port 3306 is already allocated | A local MySQL is running | Stop it, or set `DB_PORT=3307` in `.env` |
| Cannot connect to the Docker daemon | Docker Desktop is not running | Start Docker Desktop and rerun |
| *After ADR 0001:* pages load but show Network Error | API not running, or wrong `VITE_API_URL` | Check the `make run` output; check `VITE_API_URL` in `.env` |
| *After ADR 0001:* tests fail with table doesn't exist | Test database not migrated | `make migrate ENV=test` |
| *After ADR 0001:* login sends you to the SIUE sign-on page locally | `APP_ENV` is not `local` | Set `APP_ENV=local` in `.env` |
| A commit is blocked by gitleaks | A secret is in a staged file | Move it to `.env`. If it was ever pushed, tell Dane so it is rotated |
| `make test-cpp` cannot download GoogleTest | No network to github.com | Connect to the network once; CMake caches it in `build/cpp` |
| `cmake` not found or too old | CMake missing or older than 3.20 | Install it as shown in SETUP.md |
| `clang-format` or `clang-tidy` not found during `make lint` or a commit | C++ tools not installed | Install them as shown in SETUP.md |
