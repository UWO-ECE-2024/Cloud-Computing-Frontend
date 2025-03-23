#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
DEV_REPO="social-media-frontend-dev"
IMAGE_NAME="frontend"
TAG=$(git rev-parse --short HEAD)

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}1. Building development Docker image...${NC}"
docker build \
    --build-arg NODE_ENV=development \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:${TAG} \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:latest \
    -f deployment/Dockerfile .

echo -e "${GREEN}2. Pushing images to Artifact Registry...${NC}"
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:${TAG}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:latest

echo -e "${GREEN}3. Updating Kubernetes deployment...${NC}"
# Replace the image in the development deployment
kubectl set image deployment/dev-deployment \
    nginx=${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:${TAG}

echo -e "${GREEN}Development deployment completed!${NC}"
echo -e "Image: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${DEV_REPO}/${IMAGE_NAME}:${TAG}" 