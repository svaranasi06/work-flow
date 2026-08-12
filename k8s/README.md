# Leave Management Kubernetes Manifests

## Planned deployment order

1. namespace.yaml
2. Create leave-app-secret using kubectl
3. mysql-pvc.yaml
4. mysql-deployment.yaml
5. mysql-service.yaml
6. backend-configmap.yaml
7. backend-deployment.yaml
8. backend-service.yaml
9. seed-job.yaml
10. frontend-deployment.yaml
11. frontend-service.yaml

## Architecture

- Frontend Nginx is exposed through one LoadBalancer Service.
- Nginx serves React and proxies /api/v1 to leave-backend-service.
- Backend uses an internal ClusterIP Service.
- MySQL uses an internal ClusterIP Service.
- Passwords and JWT secrets are not stored in Git-tracked YAML files.
