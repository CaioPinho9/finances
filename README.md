# finances

database
```bash
docker run --name pg-finances \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=transactionsdb \
-p 5432:5432 \
-d postgres:16
```
