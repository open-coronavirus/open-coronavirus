openssl pkcs12 -in dev/Certificates.p12 -out dev/apns_cert.pem -clcerts -nokeys
openssl pkcs12 -in dev/Certificates.p12 -out dev/apns_key.pem -nocerts -nodes
