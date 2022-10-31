class CacheUtil {
  set(key: string, val: any, ttl: number = 1000 * 60 * 5) {
    const validTill = new Date();
    validTill.setMinutes(validTill.getMinutes() + ttl);
    const data = JSON.stringify({
      val,
      validTill: validTill.toISOString()
    });
    localStorage.setItem(key, data);
  }

  get<T>(key: string): T | null {
    let data: any = localStorage.getItem(key);
    try {
      data = data && typeof data === "string" ? JSON.parse(data) : data;
      const currentTime = new Date();
      const validTill = data.validTill ? new Date(data.validTill) : new Date();
      if (validTill > currentTime) {
        return data.val ?? null;
      } else {
        localStorage.removeItem(key);
      }
    } catch (ex) {}
    return null;
  }

  reset() {
    localStorage.clear();
  }
}

export const cacheUtil = new CacheUtil();
