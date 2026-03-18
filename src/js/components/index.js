/**
 * コンポーネント基底クラス
 * 再利用可能な UI コンポーネントのテンプレート
 * 
 * @version 1.0.0
 * @author Kazuki Ouchi
 */

export class Component {
  constructor(elementId, state = {}) {
    this.elementId = elementId;
    this.element = document.getElementById(elementId);
    this.state = state;
    this.listeners = [];

    if (!this.element) {
      console.warn(`Element with ID "${elementId}" not found`);
    }
  }

  /**
   * コンポーネントをレンダリング
   */
  render() {
    if (!this.element) return;
    this.element.innerHTML = this.template();
    this.afterRender();
  }

  /**
   * テンプレートを返す（サブクラスで実装）
   * @returns {string} HTML テンプレート
   */
  template() {
    return '';
  }

  /**
   * レンダリング後の処理（サブクラスで実装）
   */
  afterRender() {}

  /**
   * 状態を更新
   * @param {object} newState - 新しい状態
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * コンポーネントのクリーンアップ
   */
  destroy() {
    this.listeners.forEach((listener) => {
      listener.element.removeEventListener(listener.event, listener.handler);
    });
    this.listeners = [];
  }
}

/**
 * WorkoutForm コンポーネント
 * ワークアウト入力フォーム
 */
export class WorkoutForm extends Component {
  template() {
    return `
      <div class="workout-form">
        <label>トレーニング名</label>
        <input type="text" id="workoutName" placeholder="例: 胸トレーニング">
        
        <label>トレーニング説明</label>
        <textarea id="workoutDescription" placeholder="トレーニング内容の説明"></textarea>
        
        <div class="button-group">
          <button id="submitBtn" class="btn btn-primary">登録</button>
          <button id="clearBtn" class="btn btn-ghost">クリア</button>
        </div>
      </div>
    `;
  }

  afterRender() {
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');

    submitBtn?.addEventListener('click', () => this.handleSubmit());
    clearBtn?.addEventListener('click', () => this.handleClear());
  }

  handleSubmit() {
    const name = document.getElementById('workoutName')?.value;
    const description = document.getElementById('workoutDescription')?.value;

    if (!name || !description) {
      alert('トレーニング名と説明を入力してください');
      return;
    }

    // コンポーネント外で処理を行うためのイベント発行
    const event = new CustomEvent('submit', {
      detail: { name, description },
    });
    this.element.dispatchEvent(event);
  }

  handleClear() {
    document.getElementById('workoutName').value = '';
    document.getElementById('workoutDescription').value = '';
  }
}

/**
 * ExerciseList コンポーネント
 * エクササイズ一覧表示
 */
export class ExerciseList extends Component {
  template() {
    const exercises = this.state.exercises || [];
    
    return `
      <div class="exercise-list">
        <h3>エクササイズ一覧</h3>
        ${exercises.length > 0 ? `
          <ul>
            ${exercises.map((exercise, index) => `
              <li data-index="${index}">
                <strong>${exercise.name}</strong>
                <span class="sets-info">${exercise.sets?.length || 0} セット</span>
                <button class="btn-remove" data-index="${index}">削除</button>
              </li>
            `).join('')}
          </ul>
        ` : '<p>エクササイズが追加されていません</p>'}
        <button id="addExerciseBtn" class="btn btn-secondary">➕ エクササイズを追加</button>
      </div>
    `;
  }

  afterRender() {
    // 削除ボタンのイベントリスナー
    document.querySelectorAll('.btn-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.handleRemove(index);
      });
    });

    // 追加ボタン
    document.getElementById('addExerciseBtn')?.addEventListener('click', () => {
      this.handleAdd();
    });
  }

  handleAdd() {
    const event = new CustomEvent('add', { detail: {} });
    this.element.dispatchEvent(event);
  }

  handleRemove(index) {
    const event = new CustomEvent('remove', { detail: { index } });
    this.element.dispatchEvent(event);
  }
}

/**
 * AIAssistant コンポーネント
 * AI による入力支援
 */
export class AIAssistant extends Component {
  template() {
    const status = this.state.status || 'idle';
    const isLoading = status === 'loading';

    return `
      <div class="ai-assistant">
        <div class="ai-header">
          <h3>🤖 AI アシスタント</h3>
          <p class="subtitle">自然言語でトレーニング内容を入力すると、AI が自動で解析します</p>
        </div>
        
        <textarea 
          id="aiInput" 
          class="ai-input"
          placeholder="例: 今日は胸と肩をメインにトレーニングしたい。ベンチプレス100kgで10回、サイドレイズ25kgで15回"
          ${isLoading ? 'disabled' : ''}
        ></textarea>
        
        <div class="button-group">
          <button 
            id="analyzeBtn" 
            class="btn btn-ai"
            ${isLoading ? 'disabled' : ''}
          >
            ${isLoading ? '解析中...' : '✨ AI で解析'}
          </button>
          <button id="clearAiBtn" class="btn btn-ghost">クリア</button>
        </div>

        ${this.state.result ? `
          <div class="ai-result">
            <h4>解析結果</h4>
            <pre>${JSON.stringify(this.state.result, null, 2)}</pre>
            <button id="acceptResultBtn" class="btn btn-success">✓ この結果を使用</button>
          </div>
        ` : ''}

        ${this.state.error ? `
          <div class="ai-error">
            <p>エラー: ${this.state.error}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  afterRender() {
    document.getElementById('analyzeBtn')?.addEventListener('click', () => {
      this.handleAnalyze();
    });

    document.getElementById('clearAiBtn')?.addEventListener('click', () => {
      document.getElementById('aiInput').value = '';
    });

    document.getElementById('acceptResultBtn')?.addEventListener('click', () => {
      const event = new CustomEvent('accept', { detail: this.state.result });
      this.element.dispatchEvent(event);
    });
  }

  async handleAnalyze() {
    const input = document.getElementById('aiInput')?.value;
    if (!input) {
      alert('入力してください');
      return;
    }

    this.setState({ status: 'loading' });

    const event = new CustomEvent('analyze', { detail: { input } });
    this.element.dispatchEvent(event);
  }
}

/**
 * ProgressIndicator コンポーネント
 * 処理進捗表示
 */
export class ProgressIndicator extends Component {
  template() {
    const steps = this.state.steps || [];
    const currentStep = this.state.currentStep || 0;

    return `
      <div class="progress-indicator">
        ${steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return `
            <div class="step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}">
              <div class="step-circle">${isComplete ? '✓' : index + 1}</div>
              <p class="step-label">${step}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

export default {
  Component,
  WorkoutForm,
  ExerciseList,
  AIAssistant,
  ProgressIndicator,
};
