/**
 * HEVY ワークアウト登録ツール v7.0
 * メインエントリーポイント
 * 
 * Hevy API の連携強化、AI 活用、UI/UX 改善を実装
 * 
 * @version 7.0.0
 * @author Kazuki Ouchi
 */

import HevyAPI from './api/hevy-api.js';
import GeminiAPI from './api/gemini-api.js';
import * as Parser from './utils/parser.js';
import * as Storage from './utils/storage.js';
import {
  Component,
  WorkoutForm,
  ExerciseList,
  AIAssistant,
  ProgressIndicator,
} from './components/index.js';

class HevyWorkoutApp {
  constructor() {
    this.hevyAPI = null;
    this.geminiAPI = null;
    this.templates = [];
    this.learning = {};
    this.currentWorkout = null;

    this.init();
  }

  /**
   * アプリケーション初期化
   */
  async init() {
    console.log('🚀 HEVY Workout Tool v7.0 initializing...');

    // 保存されたデータを読み込み
    this.loadSavedData();

    // UI コンポーネントを初期化
    this.initializeComponents();

    // API を初期化（キーが保存されている場合）
    const hevyKey = Storage.getApiKey('hevy');
    if (hevyKey) {
      this.initializeHevyAPI(hevyKey);
    }

    const geminiKey = Storage.getApiKey('gemini');
    if (geminiKey) {
      this.initializeGeminiAPI(geminiKey);
    }
  }

  /**
   * 保存されたデータを読み込み
   */
  loadSavedData() {
    this.learning = Storage.getLearningData();
    this.preferences = Storage.getPreferences();
    console.log('✅ Saved data loaded');
  }

  /**
   * Hevy API を初期化
   * @param {string} apiKey - Hevy API Key
   */
  async initializeHevyAPI(apiKey) {
    try {
      this.hevyAPI = new HevyAPI(apiKey);
      const isValid = await this.hevyAPI.validateApiKey();

      if (isValid) {
        console.log('✅ Hevy API authenticated');
        await this.loadTemplates();
      } else {
        console.error('❌ Hevy API key validation failed');
        this.hevyAPI = null;
      }
    } catch (error) {
      console.error('❌ Hevy API initialization error:', error);
      this.hevyAPI = null;
    }
  }

  /**
   * Gemini API を初期化
   * @param {string} apiKey - Google Gemini API Key
   */
  async initializeGeminiAPI(apiKey) {
    try {
      this.geminiAPI = new GeminiAPI(apiKey);
      const isValid = await this.geminiAPI.validateApiKey();

      if (isValid) {
        console.log('✅ Gemini API authenticated');
      } else {
        console.error('❌ Gemini API key validation failed');
        this.geminiAPI = null;
      }
    } catch (error) {
      console.error('❌ Gemini API initialization error:', error);
      this.geminiAPI = null;
    }
  }

  /**
   * テンプレートを読み込み
   */
  async loadTemplates() {
    try {
      // キャッシュを確認
      const cached = Storage.getCachedTemplates();
      if (cached) {
        this.templates = cached;
        console.log('✅ Templates loaded from cache');
        return;
      }

      // APIから取得
      this.templates = await this.hevyAPI.getTemplates();
      Storage.cacheTemplates(this.templates);
      console.log(`✅ ${this.templates.length} templates loaded from API`);
    } catch (error) {
      console.error('❌ Template loading error:', error);
    }
  }

  /**
   * UI コンポーネントを初期化
   */
  initializeComponents() {
    // ステップインジケーター
    this.progressIndicator = new ProgressIndicator('stepIndicator', {
      steps: ['API 設定', 'データ入力', 'ルーティン登録'],
      currentStep: 0,
    });
    this.progressIndicator.render();

    // ワークアウトフォーム
    this.workoutForm = new WorkoutForm('workoutForm', {});
    this.workoutForm.render();

    // エクササイズリスト
    this.exerciseList = new ExerciseList('exerciseList', {
      exercises: [],
    });
    this.exerciseList.render();

    // AI アシスタント
    this.aiAssistant = new AIAssistant('aiAssistant', {
      status: 'idle',
      result: null,
    });
    this.aiAssistant.render();

    // イベントリスナーを設定
    this.setupEventListeners();
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // API キー設定
    document.getElementById('hevyApiKeyBtn')?.addEventListener('click', () => {
      this.handleSetHevyApiKey();
    });

    document.getElementById('geminiApiKeyBtn')?.addEventListener('click', () => {
      this.handleSetGeminiApiKey();
    });

    // ワークアウトフォーム送信
    if (this.workoutForm.element) {
      this.workoutForm.element.addEventListener('submit', (e) => {
        this.handleWorkoutFormSubmit(e);
      });
    }

    // AI 解析
    if (this.aiAssistant.element) {
      this.aiAssistant.element.addEventListener('analyze', (e) => {
        this.handleAIAnalysis(e);
      });

      this.aiAssistant.element.addEventListener('accept', (e) => {
        this.handleAcceptAIResult(e);
      });
    }

    // エクササイズリスト操作
    if (this.exerciseList.element) {
      this.exerciseList.element.addEventListener('add', () => {
        this.handleAddExercise();
      });

      this.exerciseList.element.addEventListener('remove', (e) => {
        this.handleRemoveExercise(e.detail.index);
      });
    }
  }

  /**
   * Hevy API キーを設定
   */
  async handleSetHevyApiKey() {
    const apiKey = prompt('Hevy API キーを入力してください:');
    if (!apiKey) return;

    Storage.saveApiKey('hevy', apiKey);
    await this.initializeHevyAPI(apiKey);
    alert('✅ Hevy API キーを保存しました');
  }

  /**
   * Gemini API キーを設定
   */
  async handleSetGeminiApiKey() {
    const apiKey = prompt('Google Gemini API キーを入力してください:');
    if (!apiKey) return;

    Storage.saveApiKey('gemini', apiKey);
    await this.initializeGeminiAPI(apiKey);
    alert('✅ Gemini API キーを保存しました');
  }

  /**
   * ワークアウトフォーム送信
   */
  handleWorkoutFormSubmit(e) {
    const { name, description } = e.detail;
    this.currentWorkout = { name, description, exercises: [] };
    console.log('📝 Workout created:', this.currentWorkout);
  }

  /**
   * AI による解析
   */
  async handleAIAnalysis(e) {
    const { input } = e.detail;

    if (!this.geminiAPI) {
      alert('Gemini API が設定されていません');
      this.aiAssistant.setState({
        status: 'error',
        error: 'Gemini API が設定されていません',
      });
      return;
    }

    try {
      const result = await this.geminiAPI.parseWorkoutDescription(input);
      this.aiAssistant.setState({
        status: 'success',
        result,
        error: null,
      });
      console.log('✅ AI Analysis complete:', result);
    } catch (error) {
      console.error('❌ AI Analysis error:', error);
      this.aiAssistant.setState({
        status: 'error',
        error: error.message,
      });
    }
  }

  /**
   * AI 結果を受け入れ
   */
  async handleAcceptAIResult(e) {
    const result = e.detail;

    // 学習データに追加
    for (const exercise of result.exercises) {
      const matched = Parser.matchExerciseToTemplate(
        exercise.exerciseName,
        this.templates,
        this.learning
      );

      if (matched.templateId) {
        Storage.addLearning(exercise.exerciseName, matched.templateId);
      }
    }

    console.log('✅ AI Result accepted and learning data updated');
    alert('AI 結果が学習データに追加されました');
  }

  /**
   * エクササイズを追加
   */
  handleAddExercise() {
    const name = prompt('エクササイズ名を入力してください:');
    if (!name) return;

    const reps = parseInt(prompt('回数を入力してください:'));
    const weight = parseFloat(prompt('重量（kg）を入力してください:'));

    if (!this.currentWorkout) {
      this.currentWorkout = { name: 'Unnamed Workout', exercises: [] };
    }

    this.currentWorkout.exercises.push({
      name,
      sets: [{ reps, weight, unit: 'kg' }],
    });

    this.exerciseList.setState({ exercises: this.currentWorkout.exercises });
    console.log('✅ Exercise added:', name);
  }

  /**
   * エクササイズを削除
   */
  handleRemoveExercise(index) {
    if (!this.currentWorkout) return;

    this.currentWorkout.exercises.splice(index, 1);
    this.exerciseList.setState({ exercises: this.currentWorkout.exercises });
    console.log('✅ Exercise removed at index:', index);
  }

  /**
   * ワークアウトを登録
   */
  async submitWorkout() {
    if (!this.hevyAPI || !this.currentWorkout) {
      alert('Hevy API が設定されておらず、またはワークアウトが作成されていません');
      return;
    }

    try {
      const workoutData = Parser.formatForHevyAPI(this.currentWorkout);
      const result = await this.hevyAPI.createWorkout(workoutData);

      console.log('✅ Workout submitted:', result);
      alert('✅ ワークアウトが正常に登録されました');

      // 履歴に追加
      const history = Storage.getWorkoutHistory();
      history.push({
        ...workoutData,
        registeredAt: new Date().toISOString(),
        result,
      });
      Storage.saveWorkoutHistory(history);

      // リセット
      this.currentWorkout = null;
    } catch (error) {
      console.error('❌ Workout submission error:', error);
      alert(`❌ エラーが発生しました: ${error.message}`);
    }
  }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HevyWorkoutApp();
});

export default HevyWorkoutApp;
