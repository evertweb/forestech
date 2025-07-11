/**
 * index.js - Exportación principal del MigrationWizard
 * Facilita la importación desde otros componentes
 */

export { default } from './MigrationWizard';
export { default as MigrationWizard } from './MigrationWizard';

// Exportar pasos individuales si se necesitan por separado
export { default as Step1_FileUpload } from './steps/Step1_FileUpload';
// export { default as Step2_ColumnMapping } from './steps/Step2_ColumnMapping';
// export { default as Step3_ValueMapping } from './steps/Step3_ValueMapping';
// export { default as Step4_Validation } from './steps/Step4_Validation';
// export { default as Step5_Execution } from './steps/Step5_Execution';

// Exportar servicios relacionados
export { default as migrationManager } from '../../services/migrationManager';
export { default as fileParsingService } from '../../services/fileParsingService';
export { default as aliasService } from '../../services/aliasService';