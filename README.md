# InternHub

A full-stack internship application tracker built for an internship portfolio project.

## Run locally

Open two terminals:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Swagger UI: http://localhost:4000/api-docs

The backend uses in-memory sample data so the project works immediately. Applications added through the dashboard are stored for the lifetime of the API process.

## API

- `GET /api/health`
- `GET /api/applications`
- `GET /api/summary`
- `POST /api/applications`
