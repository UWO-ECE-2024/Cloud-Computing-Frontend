# Deployment Guide for Next.js Frontend

This guide provides instructions for deploying the Next.js frontend application to Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE).

## Prerequisites

1. Google Cloud SDK installed
2. Docker installed
3. kubectl installed
4. A GCP project with billing enabled
5. GKE cluster created

## Project Structure

```
.
├── Dockerfile
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── src/
└── ... (other Next.js files)
```

## Deployment Steps

1. **Configure GCP Project**
   ```bash
   # Set your GCP project ID
   export PROJECT_ID=your-project-id
   gcloud config set project $PROJECT_ID
   ```

2. **Build and Push Docker Image**
   ```bash
   # Build the Docker image
   docker build -t gcr.io/$PROJECT_ID/nextjs-frontend:latest .

   # Push to Google Container Registry
   docker push gcr.io/$PROJECT_ID/nextjs-frontend:latest
   ```

3. **Update Kubernetes Configuration**
   - Edit `k8s/deployment.yaml` and replace `YOUR_PROJECT_ID` with your actual GCP project ID.

4. **Deploy to GKE**
   ```bash
   # Apply Kubernetes configurations
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

5. **Verify Deployment**
   ```bash
   # Check deployment status
   kubectl get deployments
   kubectl get pods
   kubectl get services
   ```

## Architecture Overview

The deployment uses the following GCP services:
- **GKE**: For container orchestration
- **Cloud Load Balancing**: For distributing traffic across multiple nodes
- **Container Registry**: For storing Docker images
- **Cloud Storage**: For static assets (if configured)

## Load Balancing Configuration

The application is configured with:
- 2 replicas for high availability
- Internal load balancer for secure access
- Health checks for both readiness and liveness
- Resource limits and requests for optimal performance

## Monitoring and Maintenance

1. **View Logs**
   ```bash
   kubectl logs -f deployment/nextjs-frontend
   ```

2. **Scale Deployment**
   ```bash
   kubectl scale deployment nextjs-frontend --replicas=3
   ```

3. **Update Application**
   ```bash
   # After updating the code and pushing new image
   kubectl rollout restart deployment nextjs-frontend
   ```

## Security Considerations

1. The load balancer is configured as internal for enhanced security
2. Resource limits are set to prevent DoS attacks
3. Health checks ensure only healthy pods receive traffic

## Troubleshooting

1. **Check Pod Status**
   ```bash
   kubectl describe pod <pod-name>
   ```

2. **Check Service Status**
   ```bash
   kubectl describe service nextjs-frontend-service
   ```

3. **View Events**
   ```bash
   kubectl get events
   ```

## Rollback Procedure

If issues occur after deployment:
```bash
kubectl rollout undo deployment nextjs-frontend
``` 