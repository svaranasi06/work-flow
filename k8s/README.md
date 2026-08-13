# Leave Management Kubernetes Manifests

## Planned deployment order

1. namespace.yaml
2. Create or update leave-app-secret using kubectl
3. Create Cloud SQL MySQL instance
4. Create leave_management database and database user
5. Create runtime Google Service Account
6. Create Kubernetes ServiceAccount
7. Configure GKE Workload Identity
8. Grant Cloud SQL Client role to the runtime Google Service Account
9. backend-configmap.yaml
10. backend-service-account.yaml
11. backend-deployment.yaml
12. backend-service.yaml
13. seed-job.yaml
14. frontend-deployment.yaml
15. frontend-service.yaml

## Architecture

- Frontend Nginx is exposed through one LoadBalancer Service.
- Nginx serves React and proxies /api/v1 to leave-backend-service.
- Backend uses an internal ClusterIP Service.
- Backend Pod includes a Cloud SQL Auth Proxy sidecar.
- Application connects to MySQL through 127.0.0.1:3306.
- Cloud SQL Auth Proxy securely connects to Cloud SQL using Workload Identity.
- No MySQL Pod, MySQL Service, PVC, or Persistent Disk is used in Kubernetes.
- Passwords and JWT secrets are not stored in Git-tracked YAML files.
