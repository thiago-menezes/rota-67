# Custom Dockerfile for n8n production deployment
# Allows for custom configuration and potentially embedding workflows

FROM n8nio/n8n:latest

# Switch to root to install any needed system dependencies
USER root

# Install any additional tools if needed (e.g., for custom scripts)
RUN apk add --no-cache curl

# Switch back to node user
USER node

# Expose n8n port
EXPOSE 5678

# The official image already has a good ENTRYPOINT and CMD
# but we can customize it if needed.
