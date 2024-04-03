export const saveData = (key: string, value: any) => {
  const item = {
    value: value,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const loadData = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  const parsedItem = JSON.parse(item);
  const value = parsedItem.value;
  return value;
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};

export const cleanUpData = (duration_ms: number) => {
  const now = new Date().getTime();
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const item = localStorage.getItem(key);
    if (!item) continue;
    const parsedItem = JSON.parse(item);
    if (now - parsedItem.timestamp > duration_ms) {
      localStorage.removeItem(key);
    }
  }
};

export const clearData = () => {
  localStorage.clear();
};