#!/bin/bash

# This script automates the creation and management of a systemd service.
# It is designed to be run with 'sudo'.

# Define variables
APP_DIR="twitch-resize"
SERVICE_NAME="${APP_DIR}.service"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}"
PROGRAM_RUN="npm run start"
WORKING_DIR="/home/bbq/serve/${APP_DIR}"
NODE_VERSION=24

# Define the service file content using a here-document
# IMPORTANT: You must customize the ExecStart and WorkingDirectory values below.
SERVICE_CONTENT="[Unit]
Description=Image resizer for Twitch icons
After=network.target

[Service]
Environment=NODE_ENV=production
ExecStart=bash -c \"source /home/bbq/.nvm/nvm.sh; nvm use ${NODE_VERSION}; ${PROGRAM_RUN}\"
WorkingDirectory=${WORKING_DIR}
Restart=always
User=bbq

[Install]
WantedBy=multi-user.target"

echo "Creating systemd service file: ${SERVICE_FILE}"

# Use a here-document with 'sudo tee' to write the content to the protected directory
# This avoids needing to redirect the output of the entire script as 'sudo'.
echo "${SERVICE_CONTENT}" | sudo tee "${SERVICE_FILE}" > /dev/null

# Reload the systemd daemon to recognize the new service file
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable the service to start automatically on boot
echo "Enabling service: ${SERVICE_NAME}"
sudo systemctl enable "${SERVICE_NAME}"

# Start the service immediately
echo "Starting service: ${SERVICE_NAME}"
sudo systemctl start "${SERVICE_NAME}"
