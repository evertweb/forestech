# 🔧 Fix: GitHub Actions Workflow Permissions

**Error Identificado**: Service account `github-action-1002035008@liquidacionapp-62962.iam.gserviceaccount.com` no tiene permisos para Cloud Run deploy.

## 📋 **Problema Específico**

```bash
ERROR: github-action-1002035008@liquidacionapp-62962.iam.gserviceaccount.com does not have permission to access bucket instance [run-sources-liquidacionapp-62962-us-central1]

Permission 'storage.buckets.get' denied on resource
```

## 🛠️ **Solución: Actualizar Permisos Service Account**

### **Permisos Necesarios para Cloud Run Deploy:**

```bash
# En Google Cloud Console IAM:
roles/run.admin                    # Cloud Run Admin
roles/storage.admin                 # Cloud Storage Admin  
roles/cloudbuild.builds.builder     # Cloud Build Service Account
roles/iam.serviceAccountUser        # Service Account User
roles/compute.instanceAdmin         # Compute Instance Admin (para Cloud Run v2)
```

### **Comando gcloud para agregar permisos:**

```bash
# Service Account
SA_EMAIL="github-action-1002035008@liquidacionapp-62962.iam.gserviceaccount.com"
PROJECT_ID="liquidacionapp-62962"

# Agregar roles necesarios
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/iam.serviceAccountUser"
```

## 🎯 **Alternativa: Workflow Más Específico**

Si no quieres dar permisos amplios, podemos crear un workflow que use tu Cloud Run existente sin rebuilds:

```yaml
name: 🚀 Update Cloud Run (No Build)

on:
  workflow_dispatch:
    inputs:
      service_update:
        description: 'Tipo de actualización'
        required: true
        default: 'env-vars'
        type: choice
        options:
          - env-vars
          - memory
          - cpu

jobs:
  update-cloud-run:
    runs-on: ubuntu-latest
    steps:
      - name: 🔐 Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_LIQUIDACIONAPP_62962 }}

      - name: ⚙️ Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: 🔄 Update Cloud Run Service
        run: |
          case "${{ github.event.inputs.service_update }}" in
            "env-vars")
              gcloud run services update forestech-sql-service \
                --region=us-central1 \
                --set-env-vars="UPDATED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
              ;;
            "memory")
              gcloud run services update forestech-sql-service \
                --region=us-central1 \
                --memory=1Gi
              ;;
            "cpu")
              gcloud run services update forestech-sql-service \
                --region=us-central1 \
                --cpu=2
              ;;
          esac
```

## 🔧 **Fix Inmediato: Deshabilitar Workflow Problemático**

Mientras solucionas los permisos:

```yaml
# En deploy-cloud-run.yml - cambiar trigger:
on:
  # push:                    # ❌ Comentar esto
  #   branches:
  #     - main
  workflow_dispatch:         # ✅ Solo manual
    inputs:
      force_deploy:
        description: 'Force deploy to Cloud Run'
        required: true
        default: false
        type: boolean
```

## 📊 **Análisis Workflows Actuales**

```bash
✅ Workflows Activos:
- combustibles-e2e.yml       # E2E tests
- deploy-cloud-run.yml       # Cloud Run (FAILING)
- release-deploy.yml         # Release deploy (Firebase)
- opencode.yml              # Code management

❌ Workflows Deshabilitados:
- deploy-firebase-*.yml      # Múltiples versiones deshabilitadas
- lint-code-quality.yml      # Lint workflow
- firebase-hosting-*.yml     # Hosting workflows
```

## 🎯 **Recomendación Final**

### **Opción A: Fix Permisos (Recomendado)**
Agregar roles necesarios al service account para Cloud Run.

### **Opción B: Workflow Manual** 
Cambiar a deploy manual usando `workflow_dispatch`.

### **Opción C: Separar Workflows**
- Firebase Functions → Un workflow
- Cloud Run → Otro workflow con permisos específicos

¿Cuál prefieres implementar?