
// src/components/core/Animations/enhanced/AnimationDirector.ts
import { animationManager } from '../utils/AnimationManager';

/**
 * AnimationDirector coordinates animations across components
 * for a more cohesive, story-driven animation experience
 */
export class AnimationDirector {
  private scenes: Map<string, AnimationScene> = new Map();
  private currentScene: string = 'initial';
  private globalProgress: number = 0;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Register a scene with the director
   */
  public registerScene(scene: AnimationScene): void {
    this.scenes.set(scene.id, scene);
  }

  /**
   * Transition to a specific scene
   */
  public async transitionToScene(sceneId: string, duration: number = 0.5): Promise<void> {
    // If scene doesn't exist, log error and exit
    if (!this.scenes.has(sceneId)) {
      console.warn(`Scene "${sceneId}" not found`);
      return;
    }

    const previousScene = this.currentScene;
    this.currentScene = sceneId;

    // Notify about scene change
    this.dispatchEvent('sceneChange', {
      previous: previousScene,
      current: sceneId,
      transitionDuration: duration
    });

    // Exit previous scene
    if (previousScene !== 'initial' && this.scenes.has(previousScene)) {
      await this.scenes.get(previousScene)!.exit(duration);
    }

    // Enter new scene
    await this.scenes.get(sceneId)!.enter(duration);
  }

  /**
   * Update global animation progress (0-1)
   */
  public updateProgress(progress: number): void {
    this.globalProgress = Math.max(0, Math.min(1, progress));

    // Notify about progress update
    this.dispatchEvent('progressUpdate', {
      progress: this.globalProgress
    });

    // Update current scene progress
    if (this.scenes.has(this.currentScene)) {
      this.scenes.get(this.currentScene)!.updateProgress(this.globalProgress);
    }
  }

  /**
   * Subscribe to animation events
   */
  public addEventListener(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Dispatch an event to all listeners
   */
  private dispatchEvent(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}`, error);
        }
      });
    }
  }

  /**
   * Get the current scene
   */
  public getCurrentScene(): string {
    return this.currentScene;
  }

  /**
   * Get global progress
   */
  public getProgress(): number {
    return this.globalProgress;
  }
}

/**
 * Represents a scene in the animation sequence
 */
export interface AnimationScene {
  id: string;
  enter(duration: number): Promise<void>;
  exit(duration: number): Promise<void>;
  updateProgress(progress: number): void;
}

/**
 * Create a singleton director instance
 */
export const animationDirector = new AnimationDirector();