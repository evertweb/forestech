#!/bin/bash

# ============================================================================
# MIGRACIÓN AZURE SQL → SQL SERVER DIGITALOCEAN
# Script personalizado para tu instancia específica
# ============================================================================

set -e

# Configuración de tu instancia DigitalOcean SQL Server
PROJECT_ID="digitalocean-forestech"
CLOUD_SQL_INSTANCE="digitalocean-forestech"
CLOUD_SQL_CONNECTION="digitalocean-forestech"
CLOUD_SQL_IP="24.199.89.134"
CLOUD_SQL_USER="SA"
CLOUD_SQL_PASSWORD="Forestech2024!SecureDB"
DATABASE_NAME="DBforestech"

# Configuración Azure SQL (origen)
AZURE_SERVER="oilforestech.privatelink.database.windows.net"
AZURE_DATABASE="forestechCombus"
AZURE_USER="oil"

echo "🚀 MIGRACIÓN AZURE SQL → SQL SERVER DIGITALOCEAN"
echo "==============================================="
echo "📍 Origen: $AZURE_SERVER"
echo "📍 Destino: $CLOUD_SQL_IP ($CLOUD_SQL_INSTANCE)"
echo "💾 Database: $DATABASE_NAME"
echo ""

# ============================================================================
# PASO 1: Verificar conectividad a Cloud SQL "oil"
# ============================================================================

echo "🔍 Verificando conectividad a Cloud SQL 'oil'..."

# Test de conexión básica
if ! node scripts/test-oil-connection.js &>/dev/null; then
    echo "❌ No se puede conectar a Cloud SQL 'oil'"
    echo "   Verifica:"
    echo "   - IP pública habilitada: ✅"
    echo "   - Tu IP en authorized networks (si es necesario)"
    echo "   - Usuario y contraseña correctos"
    echo ""
    echo "🧪 Ejecuta manualmente: node scripts/test-oil-connection.js"
    exit 1
#!/bin/bash

# Este script fue reemplazado por migrate-to-digitalocean.sh.
# Se mantiene como envoltorio para no romper automatizaciones antiguas.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⚠️ 'migrate-azure-to-oil.sh' está obsoleto."
echo "   Usa 'migrate-to-digitalocean.sh' para el flujo actual."
echo ""

exec "${SCRIPT_DIR}/migrate-to-digitalocean.sh"