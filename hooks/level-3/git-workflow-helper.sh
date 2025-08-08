#!/bin/bash
# HOOK NIVEL 3: Git Workflow Helper - Asistente inteligente para Git
# Avanzado: Automatización y validaciones para operaciones Git en Forestech

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/hp/Documents/forestech"

# Variables del hook
GIT_OPERATION="${GIT_OPERATION:-status}"
BRANCH_NAME="${BRANCH_NAME:-$(git branch --show-current 2>/dev/null || echo 'unknown')}"

# Log de inicio
echo "[$TIMESTAMP] Git Workflow Helper - Operation: $GIT_OPERATION, Branch: $BRANCH_NAME" >> "$PROJECT_DIR/logs/git-workflow.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Crear directorio de git logs si no existe
mkdir -p logs/git

# Función para generar commit message inteligente
generate_smart_commit() {
    local changes=$(git status --porcelain 2>/dev/null || echo "")
    local commit_type="chore"
    local scope=""
    local description=""
    
    # Analizar tipos de cambios
    if echo "$changes" | grep -q "^A.*\.jsx\|^A.*\.js"; then
        commit_type="feat"
        description="add new components"
    elif echo "$changes" | grep -q "^M.*\.jsx\|^M.*\.js"; then
        commit_type="fix"
        description="update components"
    elif echo "$changes" | grep -q "^M.*package\.json"; then
        commit_type="deps"
        description="update dependencies"
    elif echo "$changes" | grep -q "^M.*\.md\|^A.*\.md"; then
        commit_type="docs"
        description="update documentation"
    elif echo "$changes" | grep -q "^M.*\.css\|^M.*\.scss"; then
        commit_type="style"
        description="update styles"
    fi
    
    # Determinar scope basado en archivos modificados
    if echo "$changes" | grep -q "combustibles/"; then
        scope="combustibles"
    elif echo "$changes" | grep -q "alimentacion/"; then
        scope="alimentacion"
    elif echo "$changes" | grep -q "shared/"; then
        scope="shared"
    fi
    
    # Generar mensaje final
    local commit_msg="$commit_type"
    if [ -n "$scope" ]; then
        commit_msg="$commit_msg($scope)"
    fi
    commit_msg="$commit_msg: $description"
    
    echo "$commit_msg"
}

# Función para validar branch name
validate_branch_name() {
    local branch="$1"
    local valid_patterns=(
        "^feature/.*"
        "^fix/.*"
        "^hotfix/.*"
        "^release/.*"
        "^main$"
        "^develop$"
    )
    
    for pattern in "${valid_patterns[@]}"; do
        if [[ "$branch" =~ $pattern ]]; then
            return 0
        fi
    done
    
    echo "⚠️ Branch name '$branch' doesn't follow naming convention"
    echo "   Recommended patterns: feature/, fix/, hotfix/, release/"
    return 1
}

# Función para verificar estado antes de push
pre_push_checks() {
    local warnings=()
    
    # Verificar que no hay conflictos sin resolver
    if git diff --check 2>/dev/null | grep -q "conflict marker"; then
        warnings+=("Merge conflicts detected")
    fi
    
    # Verificar que hay commits para push
    local commits_to_push=$(git log @{u}..HEAD --oneline 2>/dev/null | wc -l || echo "0")
    if [ "$commits_to_push" -eq 0 ]; then
        warnings+=("No commits to push")
    fi
    
    # Verificar que el branch está actualizado
    git fetch --quiet 2>/dev/null || true
    local behind_count=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")
    if [ "$behind_count" -gt 0 ]; then
        warnings+=("Branch is $behind_count commits behind remote")
    fi
    
    # Verificar archivos grandes
    local large_files=$(git diff --cached --name-only | xargs ls -l 2>/dev/null | awk '$5 > 1048576 {print $9}')
    if [ -n "$large_files" ]; then
        warnings+=("Large files detected: $large_files")
    fi
    
    # Imprimir warnings
    for warning in "${warnings[@]}"; do
        echo "[$TIMESTAMP] ⚠️ Pre-push warning: $warning" >> logs/git-workflow.log
        echo "⚠️ $warning"
    done
    
    return ${#warnings[@]}
}

# Función para sugerir siguiente acción
suggest_next_action() {
    local git_status=$(git status --porcelain 2>/dev/null || echo "")
    local suggestions=()
    
    if [ -n "$git_status" ]; then
        if echo "$git_status" | grep -q "^??"; then
            suggestions+=("Add untracked files: git add .")
        fi
        
        if echo "$git_status" | grep -q "^[AM]"; then
            suggestions+=("Commit staged changes: git commit -m \"$(generate_smart_commit)\"")
        fi
        
        if echo "$git_status" | grep -q "^ [AM]"; then
            suggestions+=("Stage modified files: git add -u")
        fi
    else
        # No changes, suggest other actions
        local unpushed_commits=$(git log @{u}..HEAD --oneline 2>/dev/null | wc -l || echo "0")
        if [ "$unpushed_commits" -gt 0 ]; then
            suggestions+=("Push commits: git push origin $BRANCH_NAME")
        else
            suggestions+=("Pull latest changes: git pull")
            suggestions+=("Create new feature: git checkout -b feature/new-feature")
        fi
    fi
    
    # Imprimir sugerencias
    if [ ${#suggestions[@]} -gt 0 ]; then
        echo "[$TIMESTAMP] Git workflow suggestions:" >> logs/git-workflow.log
        echo "💡 Git workflow suggestions:"
        for suggestion in "${suggestions[@]}"; do
            echo "[$TIMESTAMP]   - $suggestion" >> logs/git-workflow.log
            echo "  - $suggestion"
        done
    fi
}

# Función para generar reporte de branch
generate_branch_report() {
    local report="{
  \"timestamp\": \"$TIMESTAMP\",
  \"branch\": \"$BRANCH_NAME\",
  \"commits_ahead\": $(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0"),
  \"commits_behind\": $(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0"),
  \"modified_files\": $(git status --porcelain | wc -l),
  \"last_commit\": \"$(git log -1 --pretty=format:'%h - %s' 2>/dev/null || echo 'No commits')\",
  \"author\": \"$(git config user.name 2>/dev/null || echo 'Unknown')\"
}"
    
    echo "$report" >> logs/git/branch-report-$(date +%Y%m%d).json
}

# Función principal según la operación Git
case "$GIT_OPERATION" in
    "commit")
        echo "[$TIMESTAMP] Preparing commit workflow..." >> logs/git-workflow.log
        
        # Validar que hay cambios para commit
        if ! git diff --cached --quiet 2>/dev/null; then
            smart_msg=$(generate_smart_commit)
            echo "💡 Suggested commit message: $smart_msg"
            echo "[$TIMESTAMP] Suggested commit: $smart_msg" >> logs/git-workflow.log
        else
            echo "⚠️ No staged changes for commit"
        fi
        ;;
        
    "push")
        echo "[$TIMESTAMP] Preparing push workflow..." >> logs/git-workflow.log
        
        # Validar branch name
        if ! validate_branch_name "$BRANCH_NAME"; then
            echo "[$TIMESTAMP] Invalid branch name: $BRANCH_NAME" >> logs/git-workflow.log
        fi
        
        # Ejecutar pre-push checks
        pre_push_checks
        ;;
        
    "status")
        echo "[$TIMESTAMP] Git status analysis..." >> logs/git-workflow.log
        
        # Generar reporte de branch
        generate_branch_report
        
        # Sugerir siguiente acción
        suggest_next_action
        ;;
        
    "branch")
        echo "[$TIMESTAMP] Branch analysis..." >> logs/git-workflow.log
        
        # Mostrar información de branches
        echo "📊 Branch information:"
        echo "  Current: $BRANCH_NAME"
        
        # Mostrar branches locales
        local_branches=$(git branch --format='%(refname:short)' 2>/dev/null | wc -l)
        echo "  Local branches: $local_branches"
        
        # Mostrar último commit de cada app
        if [ -d "combustibles" ]; then
            last_combustibles=$(git log -1 --oneline -- combustibles/ 2>/dev/null | head -1 || echo "No commits")
            echo "  Last combustibles change: $last_combustibles"
        fi
        
        if [ -d "alimentacion" ]; then
            last_alimentacion=$(git log -1 --oneline -- alimentacion/ 2>/dev/null | head -1 || echo "No commits")
            echo "  Last alimentacion change: $last_alimentacion"
        fi
        ;;
        
    *)
        echo "[$TIMESTAMP] General git workflow analysis..." >> logs/git-workflow.log
        suggest_next_action
        ;;
esac

# Métricas de uso de Git
GIT_METRICS="{
  \"timestamp\": \"$TIMESTAMP\",
  \"operation\": \"$GIT_OPERATION\",
  \"branch\": \"$BRANCH_NAME\",
  \"repository_size\": \"$(du -sh .git 2>/dev/null | cut -f1 || echo 'Unknown')\",
  \"total_commits\": $(git rev-list --all --count 2>/dev/null || echo "0"),
  \"contributors\": $(git shortlog -sn | wc -l 2>/dev/null || echo "0")
}"

# Guardar métricas
echo "$GIT_METRICS" >> logs/git/git-metrics-$(date +%Y%m%d).json

# Limpiar logs antiguos (mantener solo 14 días)
find logs/git -name "*.json" -mtime +14 -delete 2>/dev/null || true

# Log final
echo "[$TIMESTAMP] Git workflow analysis completed" >> logs/git-workflow.log

# Mostrar estadísticas útiles del repositorio
echo "📈 Repository stats:"
echo "  Total commits: $(git rev-list --all --count 2>/dev/null || echo '0')"
echo "  Contributors: $(git shortlog -sn | wc -l 2>/dev/null || echo '0')"
echo "  Repository size: $(du -sh .git 2>/dev/null | cut -f1 || echo 'Unknown')"

exit 0