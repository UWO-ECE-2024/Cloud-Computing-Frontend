#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
PROD_REPO="social-media-frontend-prod"
IMAGE_NAME="frontend"
TAG=$(git rev-parse --short HEAD)

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}1. Building production Docker image...${NC}"
docker build \
    --build-arg NODE_ENV=production \
    --no-cache \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:${TAG} \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:latest \
    -f deployment/Dockerfile .

echo -e "${GREEN}2. Pushing images to Artifact Registry...${NC}"
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:${TAG}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:latest

echo -e "${GREEN}3. Updating Kubernetes deployments...${NC}"
# Update both web server deployments
kubectl set image deployment/nginx-deployment \
    nginx=${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:${TAG} \
    --all

echo -e "${GREEN}4. Verifying rollout...${NC}"
kubectl rollout status deployment/nginx-deployment

echo -e "${GREEN}Production deployment completed!${NC}"
echo -e "Image: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROD_REPO}/${IMAGE_NAME}:${TAG}" 