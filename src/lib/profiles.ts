export type SajuProfile = {
  id: string;
  profileName: string;
  name: string;
  date: string;
  time: string;
  noTime: boolean;
};

export const PROFILE_STORAGE_KEY = 'saju-profiles';

export function loadProfiles(): SajuProfile[] {
  const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (profile): profile is SajuProfile =>
        typeof profile === 'object' &&
        profile !== null &&
        typeof profile.id === 'string' &&
        typeof profile.profileName === 'string' &&
        typeof profile.name === 'string' &&
        typeof profile.date === 'string' &&
        typeof profile.time === 'string' &&
        typeof profile.noTime === 'boolean',
    );
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return [];
  }
}

export function saveProfiles(profiles: SajuProfile[]): void {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}