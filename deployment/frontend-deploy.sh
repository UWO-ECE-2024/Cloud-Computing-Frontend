#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
REPO="frontend-repo"
IMAGE_NAME="frontend"
TAG=$(git rev-parse --short HEAD)

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}1. Building Next.js application...${NC}"

# Check and install pnpm if not found
if ! command -v pnpm &> /dev/null; then
  echo -e "${GREEN}pnpm not found. Installing...${NC}"
  npm install -g pnpm
fi

pnpm install
pnpm run build


echo -e "${GREEN}2. Building Docker image...${NC}"
docker build \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:${TAG} \
    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:latest \
    -f deployment/Dockerfile .

echo -e "${GREEN}3. Pushing images to Artifact Registry...${NC}"
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:${TAG}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:latest

echo -e "${GREEN}4. Applying Kubernetes configurations...${NC}"
# Replace the PROJECT_ID in the deployment file
sed -i "s/\[PROJECT_ID\]/$PROJECT_ID/g" deployment/k8s/frontend-deployment.yaml

# Apply the configurations
kubectl apply -f deployment/k8s/frontend-deployment.yaml
kubectl apply -f deployment/k8s/frontend-service.yaml

echo -e "${GREEN}5. Waiting for deployment to be ready...${NC}"
kubectl rollout status deployment/frontend-deployment

echo -e "${GREEN}6. Getting service information...${NC}"
kubectl get service frontend-service

echo -e "${GREEN}Deployment completed!${NC}"
echo -e "Image: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:${TAG}" 