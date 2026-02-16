/**
 * 🔐 Reference ID Generator & Validator
 * نظام موحد لتوليد والتحقق من معرفات الوثائق
 */

/**
 * أنواع الوثائق المدعومة
 */
export enum DocumentType {
  MEMBER = 'EXEC',          // Executive Member ID
  CERTIFICATE = 'CERT',     // Workshop Certificate
  RECOMMENDATION = 'REC',   // Professional Recommendation
  PERFORMANCE = 'PERF',     // Performance Profile
  ALIGNMENT = 'ALIGN',      // Job Alignment
  DIAGNOSIS = 'SCI',        // Strategic Career Intelligence
  SIMULATION = 'SIM',       // Simulation Scorecard
}

/**
 * نتيجة التحقق من المعرف
 */
export interface ValidationResult {
  valid: boolean;
  type?: DocumentType;
  year?: number;
  code?: string;
  error?: string;
  suggestion?: string;
}

/**
 * معلومات الوثيقة
 */
export interface DocumentInfo {
  type: DocumentType;
  typeName: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  modelName: string;
  fieldName: string;
}

/**
 * قاموس معلومات الوثائق
 */
export const DOCUMENT_INFO: Record<DocumentType, DocumentInfo> = {
  [DocumentType.MEMBER]: {
    type: DocumentType.MEMBER,
    typeName: {
      en: 'Executive Strategic Member',
      fr: 'Membre Stratégique Exécutif',
      ar: 'عضو استراتيجي تنفيذي',
    },
    description: {
      en: 'Global membership verification for executive members',
      fr: 'Vérification d\'adhésion mondiale pour les membres exécutifs',
      ar: 'التحقق من العضوية العالمية للأعضاء التنفيذيين',
    },
    modelName: 'User',
    fieldName: 'memberId',
  },
  [DocumentType.CERTIFICATE]: {
    type: DocumentType.CERTIFICATE,
    typeName: {
      en: 'Executive Workshop Certificate',
      fr: 'Certificat d\'Atelier Exécutif',
      ar: 'شهادة ورشة تنفيذية',
    },
    description: {
      en: 'Official attestation for completed executive workshops',
      fr: 'Attestation officielle pour les ateliers exécutifs terminés',
      ar: 'شهادة رسمية للورش التنفيذية المكتملة',
    },
    modelName: 'Certificate',
    fieldName: 'certificateId',
  },
  [DocumentType.RECOMMENDATION]: {
    type: DocumentType.RECOMMENDATION,
    typeName: {
      en: 'Executive Recommendation',
      fr: 'Recommandation Exécutive',
      ar: 'توصية تنفيذية',
    },
    description: {
      en: 'Professional endorsement from strategic experts',
      fr: 'Approbation professionnelle d\'experts stratégiques',
      ar: 'تأييد مهني من خبراء استراتيجيين',
    },
    modelName: 'Recommendation',
    fieldName: 'referenceId',
  },
  [DocumentType.PERFORMANCE]: {
    type: DocumentType.PERFORMANCE,
    typeName: {
      en: 'Executive Performance Profile',
      fr: 'Profil de Performance Exécutif',
      ar: 'ملف الأداء التنفيذي',
    },
    description: {
      en: 'Comprehensive performance analytics and insights',
      fr: 'Analyses et informations complètes sur les performances',
      ar: 'تحليلات ورؤى شاملة للأداء',
    },
    modelName: 'PerformanceProfile',
    fieldName: 'referenceId',
  },
  [DocumentType.ALIGNMENT]: {
    type: DocumentType.ALIGNMENT,
    typeName: {
      en: 'Strategic Role Alignment Audit',
      fr: 'Audit d\'Alignement de Rôle Stratégique',
      ar: 'تدقيق مواءمة الدور الاستراتيجي',
    },
    description: {
      en: 'Professional role compatibility assessment',
      fr: 'Évaluation de la compatibilité des rôles professionnels',
      ar: 'تقييم توافق الدور المهني',
    },
    modelName: 'JobAlignment',
    fieldName: 'referenceId',
  },
  [DocumentType.DIAGNOSIS]: {
    type: DocumentType.DIAGNOSIS,
    typeName: {
      en: 'Strategic Career Intelligence (SCI)',
      fr: 'Intelligence de Carrière Stratégique (SCI)',
      ar: 'الذكاء المهني الاستراتيجي (SCI)',
    },
    description: {
      en: 'In-depth career analysis and strategic roadmap',
      fr: 'Analyse de carrière approfondie et feuille de route stratégique',
      ar: 'تحليل مهني متعمق وخارطة طريق استراتيجية',
    },
    modelName: 'Diagnosis',
    fieldName: 'referenceId',
  },
  [DocumentType.SIMULATION]: {
    type: DocumentType.SIMULATION,
    typeName: {
      en: 'Executive Performance Scorecard',
      fr: 'Tableau de Bord de Performance Exécutif',
      ar: 'بطاقة الأداء التنفيذي',
    },
    description: {
      en: 'Simulation results and performance metrics',
      fr: 'Résultats de simulation et mesures de performance',
      ar: 'نتائج المحاكاة ومقاييس الأداء',
    },
    modelName: 'Simulation',
    fieldName: 'referenceId',
  },
};

/**
 * توليد معرف فريد للوثيقة
 * @param type - نوع الوثيقة
 * @param customCode - كود مخصص (اختياري)
 * @returns معرف فريد بصيغة TYPE-YEAR-CODE
 * 
 * @example
 * generateReferenceId(DocumentType.CERTIFICATE)
 * // => "CERT-2026-A1B2C3"
 * 
 * generateReferenceId(DocumentType.DIAGNOSIS, "CUSTOM")
 * // => "SCI-2026-CUSTOM"
 */
export function generateReferenceId(
  type: DocumentType,
  customCode?: string
): string {
  const year = new Date().getFullYear();
  const code = customCode || generateRandomCode();
  return `${type}-${year}-${code}`;
}

/**
 * توليد كود عشوائي من 6 أحرف وأرقام
 * @returns كود عشوائي
 */
function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * التحقق من صحة بنية المعرف
 * @param id - المعرف المراد التحقق منه
 * @returns نتيجة التحقق
 * 
 * @example
 * validateReferenceId("CERT-2026-A1B2C3")
 * // => { valid: true, type: "CERT", year: 2026, code: "A1B2C3" }
 * 
 * validateReferenceId("INVALID")
 * // => { valid: false, error: "Invalid format", suggestion: "..." }
 */
export function validateReferenceId(id: string): ValidationResult {
  if (!id || typeof id !== 'string') {
    return {
      valid: false,
      error: 'Reference ID is required',
      suggestion: 'Please provide a valid reference ID',
    };
  }

  // تنظيف المعرف
  const cleanId = id.trim().toUpperCase();

  // التحقق من البنية: TYPE-YEAR-CODE
  const pattern = /^([A-Z]+)-(\d{4})-([A-Z0-9]{4,8})$/;
  const match = cleanId.match(pattern);

  if (!match) {
    return {
      valid: false,
      error: 'Invalid format',
      suggestion: 'Expected format: TYPE-YEAR-CODE (e.g., CERT-2026-A1B2C3)',
    };
  }

  const [, typeStr, yearStr, code] = match;
  const year = parseInt(yearStr, 10);

  // التحقق من النوع
  const validTypes = Object.values(DocumentType) as string[];
  if (!validTypes.includes(typeStr)) {
    return {
      valid: false,
      error: 'Unknown document type',
      suggestion: `Valid types: ${validTypes.join(', ')}`,
    };
  }

  // التحقق من السنة
  const currentYear = new Date().getFullYear();
  if (year < 2020 || year > currentYear + 1) {
    return {
      valid: false,
      error: 'Invalid year',
      suggestion: `Year should be between 2020 and ${currentYear + 1}`,
    };
  }

  return {
    valid: true,
    type: typeStr as DocumentType,
    year,
    code,
  };
}

/**
 * الحصول على معلومات الوثيقة من المعرف
 * @param id - المعرف
 * @returns معلومات الوثيقة أو null
 */
export function getDocumentInfo(id: string): DocumentInfo | null {
  const validation = validateReferenceId(id);
  if (!validation.valid || !validation.type) {
    return null;
  }
  return DOCUMENT_INFO[validation.type] || null;
}

/**
 * تنسيق المعرف للعرض
 * @param id - المعرف
 * @returns المعرف منسق أو المعرف الأصلي
 * 
 * @example
 * formatReferenceId("cert-2026-a1b2c3")
 * // => "CERT-2026-A1B2C3"
 */
export function formatReferenceId(id: string): string {
  if (!id) return '';
  return id.trim().toUpperCase();
}

/**
 * استخراج نوع الوثيقة من المعرف
 * @param id - المعرف
 * @returns نوع الوثيقة أو null
 */
export function extractDocumentType(id: string): DocumentType | null {
  const validation = validateReferenceId(id);
  return validation.valid ? validation.type || null : null;
}

/**
 * التحقق من أن المعرف من نوع معين
 * @param id - المعرف
 * @param type - النوع المتوقع
 * @returns true إذا كان المعرف من النوع المحدد
 */
export function isDocumentType(id: string, type: DocumentType): boolean {
  const extractedType = extractDocumentType(id);
  return extractedType === type;
}

/**
 * توليد معرف قصير للعرض
 * @param id - المعرف الكامل
 * @returns معرف قصير
 * 
 * @example
 * generateShortId("CERT-2026-A1B2C3")
 * // => "CERT-***C3"
 */
export function generateShortId(id: string): string {
  const validation = validateReferenceId(id);
  if (!validation.valid || !validation.code) {
    return id.substring(0, 10) + '...';
  }
  const lastTwo = validation.code.slice(-2);
  return `${validation.type}-***${lastTwo}`;
}

/**
 * الحصول على اسم الموديل من نوع الوثيقة
 * @param type - نوع الوثيقة
 * @returns اسم الموديل
 */
export function getModelName(type: DocumentType): string {
  return DOCUMENT_INFO[type]?.modelName || '';
}

/**
 * الحصول على اسم الحقل من نوع الوثيقة
 * @param type - نوع الوثيقة
 * @returns اسم الحقل
 */
export function getFieldName(type: DocumentType): string {
  return DOCUMENT_INFO[type]?.fieldName || '';
}

/**
 * إحصائيات المعرف
 */
export interface ReferenceIdStats {
  totalGenerated: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
}

/**
 * تحليل مجموعة من المعرفات
 * @param ids - مصفوفة المعرفات
 * @returns إحصائيات
 */
export function analyzeReferenceIds(ids: string[]): ReferenceIdStats {
  const stats: ReferenceIdStats = {
    totalGenerated: ids.length,
    byType: {},
    byYear: {},
  };

  ids.forEach((id) => {
    const validation = validateReferenceId(id);
    if (validation.valid && validation.type && validation.year) {
      // إحصاء حسب النوع
      stats.byType[validation.type] = (stats.byType[validation.type] || 0) + 1;
      // إحصاء حسب السنة
      stats.byYear[validation.year] = (stats.byYear[validation.year] || 0) + 1;
    }
  });

  return stats;
}
