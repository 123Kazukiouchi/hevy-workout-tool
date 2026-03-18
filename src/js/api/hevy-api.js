/**
 * Hevy API ラッパークラス
 * RESTful API の GET/POST/PUT/DELETE 操作を統一的に管理
 * 
 * @version 2.0.0
 * @author Kazuki Ouchi
 */

export class HevyAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.hevyapp.com/v1';
    this.headers = {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    };
  }

  /**
   * API呼び出しの共通処理
   * @param {string} endpoint - API エンドポイント
   * @param {string} method - HTTP メソッド (GET, POST, PUT, DELETE)
   * @param {object} data - リクエストボディ（オプション）
   * @returns {Promise<object>} レスポンスデータ
   */
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Hevy API Error (${response.status}): ${errorData.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * テンプレート一覧取得
   * @returns {Promise<Array>} テンプレートの配列
   */
  async getTemplates() {
    return this.request('/templates');
  }

  /**
   * ユーザーのワークアウト履歴取得
   * @returns {Promise<Array>} ワークアウトの配列
   */
  async getWorkouts() {
    return this.request('/workouts');
  }

  /**
   * 特定ワークアウトの詳細取得
   * @param {string} workoutId - ワークアウト ID
   * @returns {Promise<object>} ワークアウト詳細
   */
  async getWorkoutById(workoutId) {
    return this.request(`/workouts/${workoutId}`);
  }

  /**
   * 新規ワークアウト作成（新機能 - POST）
   * @param {object} workoutData - ワークアウトデータ
   * @returns {Promise<object>} 作成されたワークアウト
   */
  async createWorkout(workoutData) {
    return this.request('/workouts', 'POST', workoutData);
  }

  /**
   * ワークアウト更新（新機能 - PUT）
   * @param {string} workoutId - ワークアウト ID
   * @param {object} updates - 更新データ
   * @returns {Promise<object>} 更新されたワークアウト
   */
  async updateWorkout(workoutId, updates) {
    return this.request(`/workouts/${workoutId}`, 'PUT', updates);
  }

  /**
   * ワークアウト削除（新機能 - DELETE）
   * @param {string} workoutId - ワークアウト ID
   * @returns {Promise<object>} 削除結果
   */
  async deleteWorkout(workoutId) {
    return this.request(`/workouts/${workoutId}`, 'DELETE');
  }

  /**
   * ルーティン一覧取得
   * @returns {Promise<Array>} ルーティングの配列
   */
  async getRoutines() {
    return this.request('/routines');
  }

  /**
   * カスタムルーティン作成（新機能）
   * @param {object} routineData - ルーティンデータ
   * @returns {Promise<object>} 作成されたルーティン
   */
  async createRoutine(routineData) {
    return this.request('/routines', 'POST', routineData);
  }

  /**
   * API Key の検証
   * @returns {Promise<boolean>} 有効な API Key かどうか
   */
  async validateApiKey() {
    try {
      await this.getTemplates();
      return true;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }
}

export default HevyAPI;
