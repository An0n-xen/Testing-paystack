# Docker Secrets Setup

To use Docker secrets with this application:

1. Create the secrets directory (done)
2. Add your Paystack secret key to a file:
   ```
   echo "sk_test_your_actual_secret_key" > secrets/paystack_secret_key.txt
   ```

3. Update backend/server.js to read from Docker secret
   (See instructions in docker-compose-secrets.yml)

Note: The .gitignore file ensures your secret files are never committed.
