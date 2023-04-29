Generate JWT keys

ssh-keygen -t rsa -b 4096 -m PEM -f access-token-private-key.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out access-token-public-key.pub

ssh-keygen -t rsa -b 4096 -m PEM -f refresh-token-private-key.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out refresh-token-public-key.pub

Listen to stripe API
stripe listen --forward-to localhost:3000/orders/stripe_webhook
