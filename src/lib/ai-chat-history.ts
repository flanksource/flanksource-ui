import type { UIMessage } from "ai";

const DB_NAME_PREFIX = "flanksource-ai-chat";
const DB_VERSION = 1;
const CONVERSATIONS_STORE = "ai_conversations";
const META_STORE = "ai_meta";
const ACTIVE_CONVERSATION_KEY = "active_conversation_id";

type ConversationMetaRecord = {
  key: string;
  value: string | null;
};

export type AIConversationRecord = {
  id: string;
  messages: UIMessage[];
  createdAt: number;
  updatedAt: number;
};

export type AIConversationStateSnapshot = {
  activeConversationId: string | null;
  conversations: AIConversationRecord[];
};

const databasePromises = new Map<string, Promise<IDBDatabase | null>>();

function normalizeScopeKey(scopeKey?: string): string {
  const normalizedScopeKey = scopeKey?.trim();
  return normalizedScopeKey ? normalizedScopeKey : "anonymous";
}

function getDatabaseName(scopeKey?: string): string {
  return `${DB_NAME_PREFIX}:${normalizeScopeKey(scopeKey)}`;
}

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

function normalizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function toConversationRecord(candidate: unknown): AIConversationRecord | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const maybeConversation = candidate as Record<string, unknown>;
  const id = maybeConversation.id;

  if (typeof id !== "string" || !id) {
    return null;
  }

  const messages = Array.isArray(maybeConversation.messages)
    ? (maybeConversation.messages as UIMessage[])
    : [];

  const createdAt =
    normalizeTimestamp(maybeConversation.createdAt) ?? Date.now();
  const updatedAt =
    normalizeTimestamp(maybeConversation.updatedAt) ?? createdAt;

  return {
    id,
    messages,
    createdAt,
    updatedAt
  };
}

function toActiveConversationId(candidate: unknown): string | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const maybeMeta = candidate as Partial<ConversationMetaRecord>;

  if (typeof maybeMeta.value !== "string") {
    return null;
  }

  const trimmed = maybeMeta.value.trim();
  return trimmed ? trimmed : null;
}

function openDatabase(scopeKey?: string): Promise<IDBDatabase | null> {
  if (!isIndexedDBAvailable()) {
    return Promise.resolve(null);
  }

  const databaseName = getDatabaseName(scopeKey);
  const existingPromise = databasePromises.get(databaseName);

  if (existingPromise) {
    return existingPromise;
  }

  const nextPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(CONVERSATIONS_STORE)) {
        const conversationStore = database.createObjectStore(
          CONVERSATIONS_STORE,
          {
            keyPath: "id"
          }
        );

        if (!conversationStore.indexNames.contains("updatedAt")) {
          conversationStore.createIndex("updatedAt", "updatedAt");
        }
      }

      if (!database.objectStoreNames.contains(META_STORE)) {
        database.createObjectStore(META_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    };
  }).catch((error) => {
    databasePromises.delete(databaseName);
    throw error;
  });

  databasePromises.set(databaseName, nextPromise);

  return nextPromise;
}

export async function loadAIConversationStateSnapshot(
  scopeKey?: string
): Promise<AIConversationStateSnapshot> {
  const fallbackState: AIConversationStateSnapshot = {
    activeConversationId: null,
    conversations: []
  };

  try {
    const database = await openDatabase(scopeKey);

    if (!database) {
      return fallbackState;
    }

    const transaction = database.transaction(
      [CONVERSATIONS_STORE, META_STORE],
      "readonly"
    );
    const transactionCompleted = transactionDone(transaction);
    const conversationStore = transaction.objectStore(CONVERSATIONS_STORE);
    const metaStore = transaction.objectStore(META_STORE);

    const [rawConversations, rawActiveConversation] = await Promise.all([
      requestToPromise(conversationStore.getAll()),
      requestToPromise(metaStore.get(ACTIVE_CONVERSATION_KEY))
    ]);

    await transactionCompleted;

    const conversations = rawConversations
      .map(toConversationRecord)
      .filter(
        (conversation): conversation is AIConversationRecord =>
          conversation !== null
      )
      .sort((left, right) => right.updatedAt - left.updatedAt);

    return {
      activeConversationId: toActiveConversationId(rawActiveConversation),
      conversations
    };
  } catch {
    return fallbackState;
  }
}

export async function saveAIConversation(
  id: string,
  messages: UIMessage[],
  scopeKey?: string
): Promise<void> {
  const conversationId = id.trim();

  if (!conversationId || messages.length === 0) {
    return;
  }

  try {
    const database = await openDatabase(scopeKey);

    if (!database) {
      return;
    }

    const transaction = database.transaction(CONVERSATIONS_STORE, "readwrite");
    const transactionCompleted = transactionDone(transaction);
    const store = transaction.objectStore(CONVERSATIONS_STORE);
    const existingConversation = toConversationRecord(
      await requestToPromise(store.get(conversationId))
    );

    const now = Date.now();

    const nextConversation: AIConversationRecord = {
      id: conversationId,
      messages,
      createdAt: existingConversation?.createdAt ?? now,
      updatedAt: now
    };

    await requestToPromise(store.put(nextConversation));

    await transactionCompleted;
  } catch {
    // Ignore IndexedDB write failures.
  }
}

export async function deleteAIConversation(
  conversationId: string,
  scopeKey?: string
): Promise<void> {
  const normalizedConversationId = conversationId.trim();

  if (!normalizedConversationId) {
    return;
  }

  try {
    const database = await openDatabase(scopeKey);

    if (!database) {
      return;
    }

    const transaction = database.transaction(
      [CONVERSATIONS_STORE, META_STORE],
      "readwrite"
    );
    const transactionCompleted = transactionDone(transaction);
    const conversationStore = transaction.objectStore(CONVERSATIONS_STORE);
    const metaStore = transaction.objectStore(META_STORE);

    const activeConversationRecord = await requestToPromise(
      metaStore.get(ACTIVE_CONVERSATION_KEY)
    );
    const activeConversationId = toActiveConversationId(
      activeConversationRecord
    );

    await requestToPromise(conversationStore.delete(normalizedConversationId));

    if (activeConversationId === normalizedConversationId) {
      await requestToPromise(
        metaStore.put({
          key: ACTIVE_CONVERSATION_KEY,
          value: null
        } satisfies ConversationMetaRecord)
      );
    }

    await transactionCompleted;
  } catch {
    // Ignore IndexedDB write failures.
  }
}

export async function setActiveAIConversationId(
  conversationId: string | null,
  scopeKey?: string
): Promise<void> {
  try {
    const database = await openDatabase(scopeKey);

    if (!database) {
      return;
    }

    const normalizedConversationId =
      typeof conversationId === "string" ? conversationId.trim() || null : null;

    const transaction = database.transaction(META_STORE, "readwrite");
    const transactionCompleted = transactionDone(transaction);
    const store = transaction.objectStore(META_STORE);

    const nextMetaRecord: ConversationMetaRecord = {
      key: ACTIVE_CONVERSATION_KEY,
      value: normalizedConversationId
    };

    await requestToPromise(store.put(nextMetaRecord));

    await transactionCompleted;
  } catch {
    // Ignore IndexedDB write failures.
  }
}
