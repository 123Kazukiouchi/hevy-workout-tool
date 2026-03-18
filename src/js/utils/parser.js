/**
 * テキスト解析ユーティリティ
 * ワークアウトデータをテキストから抽出し、構造化された形式に変換
 * 
 * @version 1.0.0
 * @author Kazuki Ouchi
 */

/**
 * シンプルなテキストベースのワークアウト解析
 * （AI 連携範囲外の基本解析）
 * 
 * @param {string} rawText - 生のテキスト入力
 * @returns {Array<object>} パースされたエクササイズの配列
 */
export function parseWorkoutText(rawText) {
  const lines = rawText.trim().split('\n');
  const exercises = [];
  let currentExercise = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 空行をスキップ
    if (!trimmedLine) {
      if (currentExercise && currentExercise.sets.length > 0) {
        exercises.push(currentExercise);
        currentExercise = null;
      }
      continue;
    }

    // エクササイズ名を検出（新しい行の開始）
    if (!/^\d+/.test(trimmedLine) && currentExercise === null) {
      currentExercise = {
        name: trimmedLine,
        sets: [],
      };
    } else if (currentExercise !== null) {
      // セット情報を解析（数字で始まる行）
      const setData = parseSetLine(trimmedLine);
      if (setData) {
        currentExercise.sets.push(setData);
      }
    }
  }

  // 最後のエクササイズを追加
  if (currentExercise && currentExercise.sets.length > 0) {
    exercises.push(currentExercise);
  }

  return exercises;
}

/**
 * セット情報を抽出（例: "1. 10 reps @ 100kg"）
 * @param {string} line - セット情報の行
 * @returns {object|null} パースされたセットデータまたはnull
 */
function parseSetLine(line) {
  // パターン例: "1. 10 reps @ 100kg", "10x100kg", "10 x 100kg"
  const patterns = [
    /(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*kg/i, // "10x100kg" または "10 x 100kg"
    /(\d+)\s*reps?\s*@?\s*(\d+(?:\.\d+)?)\s*kg/i, // "10 reps @ 100kg"
    /(\d+)\s*[回]?\s*[×x]\s*(\d+(?:\.\d+)?)\s*kg/i, // 日本語形式: "10回×100kg"
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        reps: parseInt(match[1], 10),
        weight: parseFloat(match[2]),
        unit: 'kg',
      };
    }
  }

  return null;
}

/**
 * エクササイズ名をテンプレートID にマッピング
 * （機械学習による学習済みマッピングをサポート）
 * 
 * @param {string} exerciseName - 日本語のエクササイズ名
 * @param {Array<object>} templates - Hevy の全テンプレート
 * @param {object} learningData - 学習済みマッピング（オプション）
 * @returns {object} マッピング結果（templateId と confidence）
 */
export function matchExerciseToTemplate(exerciseName, templates, learningData = {}) {
  // 学習済みマッピングをチェック
  if (learningData[exerciseName]) {
    return {
      templateId: learningData[exerciseName],
      confidence: 'learned',
      source: 'learning_data',
    };
  }

  // 完全マッチをチェック
  const exactMatch = templates.find(
    (t) => t.name.toLowerCase() === exerciseName.toLowerCase()
  );
  if (exactMatch) {
    return {
      templateId: exactMatch.id,
      confidence: 'exact',
      source: 'exact_match',
    };
  }

  // 部分一致で最高スコアを検索
  let bestMatch = null;
  let bestScore = 0;

  for (const template of templates) {
    const score = calculateSimilarity(exerciseName, template.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }

  if (bestMatch && bestScore > 0.5) {
    return {
      templateId: bestMatch.id,
      confidence: bestScore,
      source: 'fuzzy_match',
    };
  }

  return {
    templateId: null,
    confidence: 0,
    source: 'no_match',
  };
}

/**
 * 2つの文字列の類似度を計算（0-1）
 * Levenshtein距離を使用した簡単な実装
 * 
 * @param {string} str1 - 文字列1
 * @param {string} str2 - 文字列2
 * @returns {number} 類似度スコア（0-1）
 */
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // 完全マッチ
  if (s1 === s2) return 1;

  // 部分マッチ
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Levenshtein距離
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

/**
 * Levenshtein距離を計算
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * ワークアウトデータを Hevy API 形式に変換
 * @param {object} rawWorkoutData - パースされたワークアウトデータ
 * @returns {object} Hevy API用の形式
 */
export function formatForHevyAPI(rawWorkoutData) {
  return {
    name: rawWorkoutData.name || 'Workout',
    description: rawWorkoutData.description || '',
    exercises: rawWorkoutData.exercises.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        unit: set.unit,
      })),
    })),
    date: new Date().toISOString(),
  };
}

export default {
  parseWorkoutText,
  parseSetLine,
  matchExerciseToTemplate,
  calculateSimilarity,
  levenshteinDistance,
  formatForHevyAPI,
};
