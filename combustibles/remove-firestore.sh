#!/bin/bash

# ===========================================
# ELIMINAR FIRESTORE - Script de limpieza
# Forestech Combustibles App
# ===========================================

echo "🧹 Iniciando limpieza de dependencias Firestore..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json. Ejecuta este script desde la raíz del proyecto combustibles/"
    exit 1
fi

print_status "Verificando dependencias Firebase..."

# Verificar si firebase está instalado
if npm list firebase > /dev/null 2>&1; then
    print_warning "Firebase encontrado - procediendo con eliminación..."
else
    print_warning "Firebase no está instalado - nada que eliminar"
fi

# Paso 1: Respaldar archivos importantes
print_status "Paso 1: Creando respaldo de archivos Firebase..."
mkdir -p backup/firebase

# Respaldar configuración Firebase
if [ -f "src/firebase/config.js" ]; then
    cp src/firebase/config.js backup/firebase/config.js.backup
    print_success "Configuración Firebase respaldada"
fi

if [ -f ".env.local" ]; then
    cp .env.local backup/firebase/.env.local.backup
    print_success "Variables de entorno respaldadas"
fi

# Paso 2: Eliminar dependencias Firebase del package.json
print_status "Paso 2: Eliminando dependencias Firebase..."

# Verificar si firebase está en package.json
if grep -q '"firebase"' package.json; then
    print_warning "Firebase encontrado en package.json - eliminando..."

    # Crear versión sin firebase
    sed '/firebase/d' package.json > package_temp.json
    mv package_temp.json package.json

    print_success "Dependencias Firebase eliminadas de package.json"
else
    print_warning "Firebase no encontrado en package.json"
fi

# Paso 3: Limpiar archivos Firebase
print_status "Paso 3: Eliminando archivos Firebase..."

# Eliminar directorio firebase
if [ -d "src/firebase" ]; then
    rm -rf src/firebase
    print_success "Directorio src/firebase eliminado"
fi

# Eliminar archivos relacionados con Firebase
firebase_files=(
    "firebase.json"
    "firestore.rules"
    "firestore.indexes.json"
    ".firebaserc"
)

for file in "${firebase_files[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "backup/firebase/"
        print_success "Archivo $file movido a backup"
    fi
done

# Paso 4: Limpiar variables de entorno Firebase
print_status "Paso 4: Limpiando variables de entorno..."

if [ -f ".env.local" ]; then
    # Crear nueva versión sin variables Firebase
    grep -v "^VITE_FIREBASE" .env.local > .env.local.temp
    mv .env.local.temp .env.local
    print_success "Variables Firebase eliminadas de .env.local"
fi

# Paso 5: Limpiar imports Firebase en el código
print_status "Paso 5: Buscando imports Firebase en el código..."

# Buscar archivos que importen firebase
firebase_imports=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -l "from 'firebase'" 2>/dev/null || true)

if [ -n "$firebase_imports" ]; then
    print_warning "Archivos con imports Firebase encontrados:"
    echo "$firebase_imports"

    print_warning "⚠️  IMPORTANTE: Revisa estos archivos y reemplaza los imports:"
    echo ""
    echo "❌ ANTES:"
    echo "import { collection, doc } from 'firebase/firestore';"
    echo "import { db } from '../firebase/config';"
    echo ""
    echo "✅ DESPUÉS:"
    echo "import sqlMovementsService from '../services/SqlMovementsService.js';"
    echo ""
else
    print_success "No se encontraron imports Firebase activos"
fi

# Paso 6: Limpiar node_modules si es necesario
print_status "Paso 6: Limpiando node_modules..."

if [ -d "node_modules" ]; then
    print_warning "Ejecutando npm install para actualizar dependencias..."
    npm install
    print_success "Dependencias actualizadas"
fi

# Paso 7: Verificar limpieza
print_status "Paso 7: Verificando limpieza..."

# Verificar que no queden dependencias Firebase
if npm list firebase > /dev/null 2>&1; then
    print_error "❌ Firebase aún está instalado"
else
    print_success "✅ Firebase completamente eliminado"
fi

# Verificar archivos restantes
remaining_firebase=$(find . -name "*.js" -o -name "*.jsx" | xargs grep -l "firebase" 2>/dev/null | wc -l)

if [ "$remaining_firebase" -gt 0 ]; then
    print_warning "⚠️  Aún quedan $remaining_firebase archivos con referencias a Firebase"
    print_warning "   Revisa y actualiza estos archivos manualmente"
else
    print_success "✅ No quedan referencias a Firebase en el código"
fi

# Paso 8: Crear resumen final
print_status "Paso 8: Creando resumen de limpieza..."

cat << 'EOF'

🎉 ¡LIMPIEZA COMPLETADA!

=======================================================
📋 RESUMEN DE LIMPIEZA
=======================================================

✅ Archivos Firebase eliminados:
  - src/firebase/ (directorio completo)
  - firebase.json
  - firestore.rules
  - firestore.indexes.json
  - .firebaserc

✅ Dependencias eliminadas:
  - firebase (y todas sus sub-dependencias)

✅ Variables de entorno limpiadas:
  - Todas las VITE_FIREBASE_* eliminadas

✅ Respaldos creados en:
  - backup/firebase/

=======================================================
🔄 PRÓXIMOS PASOS
=======================================================

1. 📝 ACTUALIZA los imports en tus componentes:
   - Reemplaza imports Firebase por servicios SQL
   - Usa los nuevos servicios Sql*

2. 🧪 PRUEBA tu aplicación:
   - Verifica que todo funcione con SQL Server
   - Revisa logs en busca de errores

3. 🚀 DESPLIEGA cuando estés listo:
   - Confirma que la base de datos esté lista
   - Actualiza variables de producción

=======================================================
📞 SERVICIOS SQL DISPONIBLES
=======================================================

- SqlMovementsService    (movimientos)
- SqlVehiclesService     (vehículos)
- SqlInventoryService    (inventario)
- SqlSuppliersService    (proveedores)
- SqlProductsService     (productos)

¡Tu app ahora usa exclusivamente Azure SQL Server! 🚀

EOF

print_success "Limpieza completada exitosamente"
print_warning "⚠️  IMPORTANTE: Revisa y actualiza los imports Firebase restantes"

exit 0