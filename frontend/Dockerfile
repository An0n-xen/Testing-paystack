FROM node:18-alpine

WORKDIR /app

# Accept build arguments for Next.js public env vars
ARG NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
ARG NEXT_PUBLIC_API_URL=http://localhost:5000

# Set as environment variables
ENV NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=$NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the development server
CMD ["yarn", "dev"]
