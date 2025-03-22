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

# Check environment argument
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    echo "Usage: $0 [dev|prod]"
    exit 1
fi

ENV=$1

echo -e "${GREEN}1. Setting up GCP project...${NC}"
gcloud config set project $PROJECT_ID

if [ "$ENV" = "dev" ]; then
    echo -e "${GREEN}2. Creating development GKE cluster...${NC}"
    gcloud container clusters create $CLUSTER_NAME-dev \
        --zone=$ZONE \
        --num-nodes=1 \
        --machine-type=e2-standard-2

    echo -e "${GREEN}3. Getting cluster credentials...${NC}"
    gcloud container clusters get-credentials $CLUSTER_NAME-dev --zone=$ZONE

    echo -e "${GREEN}4. Building and pushing Docker image...${NC}"
    docker build -t gcr.io/$PROJECT_ID/social-media-frontend:dev .
    docker push gcr.io/$PROJECT_ID/social-media-frontend:dev

    echo -e "${GREEN}5. Creating development secrets...${NC}"
    kubectl create secret generic dev-db-secret \
        --from-literal=username=postgres \
        --from-literal=password=dev-password \
        --from-literal=database-name=social_media_dev \
        --from-literal=database-url=postgresql://postgres:dev-password@localhost:5432/social_media_dev

    kubectl create secret generic dev-firebase-secret \
        --from-literal=config='{your-firebase-config-json}'

    echo -e "${GREEN}6. Applying development configurations...${NC}"
    kubectl apply -f k8s/dev/

else
    echo -e "${GREEN}2. Creating production GKE cluster...${NC}"
    gcloud container clusters create $CLUSTER_NAME-prod \
        --region=$REGION \
        --num-nodes=1 \
        --node-locations=$ZONE \
        --machine-type=e2-standard-2

    echo -e "${GREEN}3. Creating node pools...${NC}"
    gcloud container node-pools create web-pool \
        --cluster=$CLUSTER_NAME-prod \
        --region=$REGION \
        --num-nodes=2 \
        --machine-type=e2-standard-2

    gcloud container node-pools create db-pool \
        --cluster=$CLUSTER_NAME-prod \
        --region=$REGION \
        --num-nodes=1 \
        --machine-type=e2-standard-4

    echo -e "${GREEN}4. Getting cluster credentials...${NC}"
    gcloud container clusters get-credentials $CLUSTER_NAME-prod --region=$REGION

    echo -e "${GREEN}5. Building and pushing Docker image...${NC}"
    docker build -t gcr.io/$PROJECT_ID/social-media-frontend:prod .
    docker push gcr.io/$PROJECT_ID/social-media-frontend:prod

    echo -e "${GREEN}6. Creating production secrets...${NC}"
    kubectl create secret generic prod-db-secret \
        --from-literal=username=postgres \
        --from-literal=password=prod-password \
        --from-literal=database-name=social_media \
        --from-literal=database-url=postgresql://postgres:prod-password@db-service:5432/social_media

    kubectl create secret generic prod-firebase-secret \
        --from-literal=config='{your-firebase-config-json}'

    echo -e "${GREEN}7. Applying production configurations...${NC}"
    kubectl apply -f k8s/prod/
fi

echo -e "${GREEN}8. Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment --all

echo -e "${GREEN}9. Getting service information...${NC}"
kubectl get services

echo -e "${GREEN}Deployment completed successfully!${NC}" 