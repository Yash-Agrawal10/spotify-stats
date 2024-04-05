export const saveData = (key: string, value: any) => {
  const item = {
    value: value,
    timestamp: new Date().getTime(),
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

export const loadData = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (!item) {
    return null;
  }
  const parsedItem = JSON.parse(item);
  const value = parsedItem.value;
  return value;
};

export const removeData = (key: string) => {
  sessionStorage.removeItem(key);
};

export const cleanUpData = (duration_ms: number) => {
  const now = new Date().getTime();
  for (var i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key) continue;
    const item = sessionStorage.getItem(key);
    if (!item) continue;
    const parsedItem = JSON.parse(item);
    if (now - parsedItem.timestamp > duration_ms) {
      sessionStorage.removeItem(key);
    }
  }
};

export const clearData = () => {
  sessionStorage.clear();
};
