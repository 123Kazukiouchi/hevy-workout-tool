/**
 * Google Gemini API ラッパークラス
 * 曖昧なテキスト入力をワークアウトルーティンに自動変換
 * 
 * @version 1.0.0
 * @author Kazuki Ouchi
 */

export class GeminiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  /**
   * Gemini API にリクエストを送信
   * @param {string} prompt - プロンプント
   * @returns {Promise<string>} 生成されたテキスト
   */
  async generateContent(prompt) {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * 曖昧なトレーニング説明をJSON形式のルーティンに変換
   * @param {string} userInput - ユーザーの自然言語入力
   * @returns {Promise<object>} パースされたルーティンオブジェクト
   */
  async parseWorkoutDescription(userInput) {
    const prompt = `
ユーザーが以下のトレーニング説明を入力しました。
これを JSON 形式で解析し、以下の構造で返してください：

{
  "name": "ルーティン名",
  "description": "説明",
  "exercises": [
    {
      "exerciseName": "種目名（日本語）",
      "sets": [
        {
          "reps": 10,
          "weight": 100,
          "unit": "kg"
        }
      ]
    }
  ]
}

ユーザー入力：
${userInput}

JSON のみを返してください。解析できない場合は、最適な推測を行ってください。`;

    try {
      const response = await this.generateContent(prompt);
      // JSON形式を抽出
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('無効なJSON形式の応答');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Workout parsing error:', error);
      throw error;
    }
  }

  /**
   * API Key の検証
   * @returns {Promise<boolean>} 有効な API Key かどうか
   */
  async validateApiKey() {
    try {
      const response = await this.generateContent('テスト');
      return !!response;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }

  /**
   * 種目名の日本語から英語への翻訳を提案
   * @param {string} japaneseExerciseName - 日本語の種目名
   * @returns {Promise<string>} 英語の種目名
   */
  async translateExerciseName(japaneseExerciseName) {
    const prompt = `
日本語のトレーニング種目名を英語に翻訳してください。
翻訳のみを返してください。

日本語: ${japaneseExerciseName}
英語:`;

    try {
      return (await this.generateContent(prompt)).trim();
    } catch (error) {
      console.error('Translation error:', error);
      return japaneseExerciseName; // フォールバック
    }
  }

  /**
   * ルーティン提案の生成
   * @param {string} userGoal - ユーザーの目標（例：「胸と肩を大きくしたい」）
   * @returns {Promise<object>} 提案されたルーティン
   */
  async suggestRoutine(userGoal) {
    const prompt = `
ユーザーのトレーニング目標に基づいて、効果的なワークアウトルーティンを提案してください。

目標: ${userGoal}

以下の JSON 形式で返してください：
{
  "name": "ルーティン名",
  "description": "詳細説明",
  "exercises": [
    {
      "exerciseName": "種目名（日本語）",
      "sets": [
        {
          "reps": 数字,
          "weight": 数字,
          "unit": "kg"
        }
      ]
    }
  ]
}

JSON のみを返してください。`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('無効なJSON形式の応答');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Routine suggestion error:', error);
      throw error;
    }
  }
}

export default GeminiAPI;
