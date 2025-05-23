# Recipes for dev

## Bigquery

### Create a table

```shell
curl --request POST \
  'http://localhost:8087/bigquery/v2/projects/fake/datasets/test/tables' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"tableReference":{"datasetId":"test","projectId":"fake","tableId":"table_test"},"schema":{"fields":[{"name":"qtr","type":"STRING","mode":"REQUIRED","description":"quarter"},{"name":"rep","type":"STRING","mode":"NULLABLE","description":"sales representative"},{"name":"sales","type":"FLOAT","mode":"NULLABLE","defaultValueExpression":"2.55"}]}}' \
  --compressed
```
