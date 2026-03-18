/**
 * LocalStorage 管理ユーティリティ
 * API キー、学習データ、ユーザー設定を安全に保存・取得
 * 
 * @version 1.0.0
 * @author Kazuki Ouchi
 */

const STORAGE_KEYS = {
  HEVY_API_KEY: 'hevy_api_key',
  GEMINI_API_KEY: 'gemini_api_key',
  EXERCISE_LEARNING: 'exercise_learning_v1',
  USER_PREFERENCES: 'user_preferences_v1',
  CACHED_TEMPLATES: 'cached_templates_v1',
  WORKOUT_HISTORY: 'workout_history_v1',
};

/**
 * APIキーを保存
 * @param {'hevy'|'gemini'} service - サービス名
 * @param {string} apiKey - API キー
 */
export function saveApiKey(service, apiKey) {
  const key = service === 'hevy' ? STORAGE_KEYS.HEVY_API_KEY : STORAGE_KEYS.GEMINI_API_KEY;
  
  // 本番環境ではSessionStorageの使用も検討
  if (apiKey) {
    localStorage.setItem(key, apiKey);
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * 保存されたAPIキーを取得
 * @param {'hevy'|'gemini'} service - サービス名
 * @returns {string|null} API キーまたはnull
 */
export function getApiKey(service) {
  const key =  service === 'hevy' ? STORAGE_KEYS.HEVY_API_KEY : STORAGE_KEYS.GEMINI_API_KEY;
  return localStorage.getItem(key);
}

/**
 * APIキーを削除
 * @param {'hevy'|'gemini'} service - サービス名
 */
export function clearApiKey(service) {
  const key = service === 'hevy' ? STORAGE_KEYS.HEVY_API_KEY : STORAGE_KEYS.GEMINI_API_KEY;
  localStorage.removeItem(key);
}

/**
 * エクササイズの学習データを保存
 * @param {object} learningData - 学習済みマッピング（exerciseName -> templateId）
 */
export function saveLearningData(learningData) {
  localStorage.setItem(STORAGE_KEYS.EXERCISE_LEARNING, JSON.stringify(learningData));
}

/**
 * 学習データを取得
 * @returns {object} 学習済みマッピング
 */
export function getLearningData() {
  const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_LEARNING);
  return data ? JSON.parse(data) : {};
}

/**
 * 特定のエクササイズマッピングを追加（学習）
 * @param {string} exerciseName - 日本語のエクササイズ名
 * @param {string} templateId - マッチしたテンプレートID
 */
export function addLearning(exerciseName, templateId) {
  const learning = getLearningData();
  learning[exerciseName] = templateId;
  saveLearningData(learning);
}

/**
 * ユーザー設定を保存
 * @param {object} preferences - ユーザー設定
 */
export function savePreferences(preferences) {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}

/**
 * ユーザー設定を取得
 * @returns {object} ユーザー設定
 */
export function getPreferences() {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return data ? JSON.parse(data) : {
    theme: 'dark',
    language: 'ja',
    defaultWeight: 'kg',
  };
}

/**
 * テンプレートキャッシュを保存
 * @param {Array<object>} templates - テンプレート配列
 */
export function cacheTemplates(templates) {
  const cacheData = {
    templates,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.CACHED_TEMPLATES, JSON.stringify(cacheData));
}

/**
 * キャッシュされたテンプレートを取得
 * @param {number} maxAgeMs - キャッシュの最大有効期限（ミリ秒）
 * @returns {Array<object>|null} テンプレート配列またはnull
 */
export function getCachedTemplates(maxAgeMs = 86400000) {
  const data = localStorage.getItem(STORAGE_KEYS.CACHED_TEMPLATES);
  if (!data) return null;

  const cacheData = JSON.parse(data);
  const age = Date.now() - cacheData.timestamp;

  if (age > maxAgeMs) {
    clearCachedTemplates();
    return null;
  }

  return cacheData.templates;
}

/**
 * テンプレートキャッシュをクリア
 */
export function clearCachedTemplates() {
  localStorage.removeItem(STORAGE_KEYS.CACHED_TEMPLATES);
}

/**
 * ワークアウト履歴を保存
 * @param {Array<object>} history - ワークアウト履歴
 */
export function saveWorkoutHistory(history) {
  localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
}

/**
 * ワークアウト履歴を取得
 * @returns {Array<object>} ワークアウト履歴
 */
export function getWorkoutHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
  return data ? JSON.parse(data) : [];
}

/**
 * すべてのデータをクリア（ログアウト時）
 * @param {boolean} keepLearning - 学習データは保持するか
 */
export function clearAllData(keepLearning = true) {
  for (const [key, value] of Object.entries(STORAGE_KEYS)) {
    if (keepLearning && key === 'EXERCISE_LEARNING') continue;
    localStorage.removeItem(value);
  }
}

/**
 * ストレージの使用状況を取得
 * @returns {object} 使用状況情報
 */
export function getStorageInfo() {
  const keys = Object.values(STORAGE_KEYS);
  let totalSize = 0;

  for (const key of keys) {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += item.length;
    }
  }

  return {
    usedBytes: totalSize,
    usedKB: (totalSize / 1024).toFixed(2),
    estimatedLimit: '5MB',
  };
}

export default {
  STORAGE_KEYS,
  saveApiKey,
  getApiKey,
  clearApiKey,
  saveLearningData,
  getLearningData,
  addLearning,
  savePreferences,
  getPreferences,
  cacheTemplates,
  getCachedTemplates,
  clearCachedTemplates,
  saveWorkoutHistory,
  getWorkoutHistory,
  clearAllData,
  getStorageInfo,
};
