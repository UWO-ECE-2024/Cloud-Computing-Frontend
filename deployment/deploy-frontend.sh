#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID="[YOUR_PROJECT_ID]"
CLUSTER_NAME="social-media-cluster"
REGION="us-central1"
ZONE="us-central1-a"

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}1. Setting up GCP project...${NC}"
gcloud config set project $PROJECT_ID

echo -e "${GREEN}2. Building the frontend...${NC}"
pnpm install
pnpm run build

echo -e "${GREEN}3. Building and pushing Docker image...${NC}"
docker build -t gcr.io/$PROJECT_ID/social-media-frontend:prod -f deployment/Dockerfile .
docker push gcr.io/$PROJECT_ID/social-media-frontend:prod

echo -e "${GREEN}4. Getting cluster credentials...${NC}"
gcloud container clusters get-credentials $CLUSTER_NAME-prod --region=$REGION

echo -e "${GREEN}5. Applying Nginx configurations...${NC}"
kubectl apply -f deployment/k8s/prod/nginx-deployment.yaml
kubectl apply -f deployment/k8s/prod/nginx-service.yaml

echo -e "${GREEN}6. Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/nginx-deployment

echo -e "${GREEN}7. Getting service information...${NC}"
kubectl get service nginx-service

echo -e "${GREEN}Frontend deployment completed successfully!${NC}"
echo -e "You can access the application at the External-IP shown above." 