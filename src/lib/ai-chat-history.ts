import type { UIMessage } from "ai";

const DB_NAME = "flanksource-ai-chat";
const DB_VERSION = 1;
const ACTIVE_STORE = "ai_active_conversation";
const ACTIVE_KEY = "active";

type ActiveConversationRecord = {
  key: string;
  conversationId: string;
  messages: UIMessage[];
  updatedAt: number;
};

export type ActiveAIConversation = {
  conversationId: string;
  messages: UIMessage[];
  updatedAt: number;
};

let databasePromise: Promise<IDBDatabase | null> | null = null;

function isIndexedDBAvailable() {
  return (
    typeof window !== "undefined" && typeof window.indexedDB !== "undefined"
  );
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed"));
    };
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    };
    transaction.onabort = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
    };
  });
}

function toActiveConversation(candidate: unknown): ActiveAIConversation | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const maybeRecord = candidate as Partial<ActiveConversationRecord>;

  if (typeof maybeRecord.conversationId !== "string") {
    return null;
  }

  const conversationId = maybeRecord.conversationId.trim();

  if (!conversationId) {
    return null;
  }

  return {
    conversationId,
    messages: Array.isArray(maybeRecord.messages)
      ? (maybeRecord.messages as UIMessage[])
      : [],
    updatedAt:
      typeof maybeRecord.updatedAt === "number" &&
      Number.isFinite(maybeRecord.updatedAt)
        ? maybeRecord.updatedAt
        : Date.now()
  };
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isIndexedDBAvailable()) {
    return Promise.resolve(null);
  }

  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(ACTIVE_STORE)) {
        database.createObjectStore(ACTIVE_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    };
  }).catch((error) => {
    databasePromise = null;
    throw error;
  });

  return databasePromise;
}

export async function loadActiveAIConversation(): Promise<ActiveAIConversation | null> {
  try {
    const database = await openDatabase();

    if (!database) {
      return null;
    }

    const transaction = database.transaction(ACTIVE_STORE, "readonly");
    const transactionCompleted = transactionDone(transaction);
    const store = transaction.objectStore(ACTIVE_STORE);
    const activeRecord = await requestToPromise(store.get(ACTIVE_KEY));

    await transactionCompleted;

    return toActiveConversation(activeRecord);
  } catch {
    return null;
  }
}

export async function saveActiveAIConversation(
  conversationId: string,
  messages: UIMessage[]
): Promise<void> {
  const normalizedConversationId = conversationId.trim();

  if (!normalizedConversationId || messages.length === 0) {
    return;
  }

  try {
    const database = await openDatabase();

    if (!database) {
      return;
    }

    const transaction = database.transaction(ACTIVE_STORE, "readwrite");
    const transactionCompleted = transactionDone(transaction);
    const store = transaction.objectStore(ACTIVE_STORE);

    const nextRecord: ActiveConversationRecord = {
      key: ACTIVE_KEY,
      conversationId: normalizedConversationId,
      messages,
      updatedAt: Date.now()
    };

    await requestToPromise(store.put(nextRecord));

    await transactionCompleted;
  } catch {
    // Ignore IndexedDB write failures.
  }
}

export async function clearActiveAIConversation(): Promise<void> {
  try {
    const database = await openDatabase();

    if (!database) {
      return;
    }

    const transaction = database.transaction(ACTIVE_STORE, "readwrite");
    const transactionCompleted = transactionDone(transaction);
    const store = transaction.objectStore(ACTIVE_STORE);

    await requestToPromise(store.delete(ACTIVE_KEY));

    await transactionCompleted;
  } catch {
    // Ignore IndexedDB write failures.
  }
}
