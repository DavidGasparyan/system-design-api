Generate JWT keys

```
    ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
    mv -v jwtRS256.key access-token-private-key.key
    mv -v jwtRS256.key.pub access-token-public-key.pub
```

```
    ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
    mv -v jwtRS256.key refresh-token-private-key.key
    mv -v jwtRS256.key.pub refresh-token-public-key.pub
```

Listen to stripe API

```
    stripe listen --forward-to localhost:3000/orders/stripe_webhook
```
