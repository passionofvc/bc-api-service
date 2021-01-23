openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ../cert/server.key -out ../cert/server.crt -subj '/CN=localhost'

