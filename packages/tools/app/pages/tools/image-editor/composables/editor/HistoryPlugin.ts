import { Canvas } from 'fabric';
import { BaseFabricPlugin, FabricEditor } from './FabricEditor';

export class HistoryPlugin extends BaseFabricPlugin {
  static readonly pluginName = 'history';
  readonly pluginName = 'history'; // Instance property

  private history: any[] = [];
  private historyIndex = -1;

  protected init() {
    this.bindHistoryEvents();
  }

  override onCanvasInit(canvas: Canvas) {
    this.saveState(); // Save initial state
  }

  override onDestroy() {
    this.history = [];
    this.historyIndex = -1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  private bindHistoryEvents() {
    this.onCanvasEvent('object:modified', () => this.saveState());
    this.onCanvasEvent('object:added', () => this.saveState());
    this.onCanvasEvent('object:removed', () => this.saveState());
  }

  private saveState() {
    const state = this.canvas?.toObject();
    if (state) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(state);
      this.historyIndex = this.history.length - 1;
    }
  }

  private restoreState(state: any) {
    this.canvas?.loadFromJSON(state, () => {
      this.canvas?.requestRenderAll();
    });
  }
}
