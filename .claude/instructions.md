# 🤖 Claude Instructions - Forestech Project

## 🎯 **Context for Claude Code/Copilot**

### **Project Type**: Firebase + Cloud Run monorepo for Colombian forestry operations

### **Critical Current State (Sept 2025)**
- **Deployment**: Dual system (Firebase auto + Cloud Run manual)
- **Active workflows**: Only 3 (ignore .disabled files)
- **Architecture**: Clean separation Firebase/Cloud Run
- **Documentation**: DEPLOYMENT_GUIDE.md is authoritative

### **When helping with deployment issues:**
1. First check: `DEPLOYMENT_GUIDE.md` 
2. Quick commands: `QUICK_DEPLOY_CARD.md`
3. AI context: `.ai` file
4. Technical details: `.github/copilot-instructions.md`

### **Common user requests and responses:**
- **"How do I deploy?"** → Check if frontend or backend, guide accordingly
- **"Workflow failed"** → Direct to specific workflow logs and troubleshooting
- **"Which workflow?"** → Only mention the 3 active ones
- **"SQL functions"** → These are in Cloud Run, not Firebase Functions

### **Code assistance priorities:**
1. Follow existing patterns (React + Firebase + Cloud Run)
2. Maintain separation of concerns
3. Use established conventions
4. Reference current documentation

### **File structure context:**
- `combustibles/` - Main React app (fuel management)
- `alimentacion/` - Secondary React app (food management)  
- `functions/` - Firebase Functions (SSR only, no SQL)
- `DEPLOYMENT_GUIDE.md` - Primary deployment reference
- `.ai` - This instruction set for AI agents