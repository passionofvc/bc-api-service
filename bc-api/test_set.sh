curl -s -X POST  \
 --header 'Content-Type: application/json' \
-H 'Authorization: Bearer XXXX' \
-k "http://localhost:8080/api/store_contract_api" \
-d @- <<EOF
{
   "Id": 100,
   "Name": "test@gmail.com"
}
EOF
echo

