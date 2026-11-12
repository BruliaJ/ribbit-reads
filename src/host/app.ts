/* App-only behavior (never active on the website). Android's Back button follows the game's own Back. */
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export const isApp = Capacitor.isNativePlatform();
export function onAndroidBack(atHome: () => boolean, back: () => void): void {
  if (!isApp) return;
  App.addListener('backButton', () => { if (atHome()) App.minimizeApp().catch(() => undefined); else back(); }).catch(() => undefined);
}
