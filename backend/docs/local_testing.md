## Running postgres
```bash
docker run -p 5432:5432 --name eatr-postgres -e POSTGRES_PASSWORD=postgres -d postgres
docker exec -it eatr-postgres psql --username postgres
#copy contents of eatr.sql now
export PG_CREDENTIALS='{"host":"127.0.0.1","port":"5432","database":"","user":"postgres","password":"postgres"}'
docker build -t eatr-test -f Dockerfile .
docker run -e PG_CREDENTIALS=${PG_CREDENTIALS} -e PG_SSLDISABLE=1 --network=host --rm eatr-test 


```
