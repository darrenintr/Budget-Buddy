# Budget Buddy / SafeSpend

Implementation is in progress. Current backend MVP slice is under `services/api`.

## What is implemented

- `POST /v1/budgets`
- `GET /v1/budgets/current`
- `POST /v1/transactions`
- `GET /v1/transactions`
- `GET /v1/safe-to-spend?daysLeft=13`

## Notes

- Persistence is currently in-memory only (`InMemoryStore`) for rapid iteration.
- Next step is wiring the same contract to Supabase Postgres.

## Quick start

```bash
cd services/api
npm install
npm run test
npm run dev
```
