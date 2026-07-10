"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ==================== TYPES ====================

interface UseFirestoreOptions {
  realtime?: boolean;
  conditions?: QueryConstraint[];
  limitCount?: number;
}

interface FirestoreResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface DocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ==================== HOOKS ====================

/**
 * Hook for fetching a list of documents from a Firestore collection
 */
export function useFirestore<T extends DocumentData>(
  collectionPath: string,
  options: UseFirestoreOptions = {}
): FirestoreResult<T> {
  const { realtime = false, conditions = [], limitCount } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(collection(db, collectionPath), ...conditions);

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[];

      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [collectionPath, conditions, limitCount]);

  useEffect(() => {
    if (realtime) {
      let q = query(collection(db, collectionPath), ...conditions);

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const unsubscribe: Unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as T[];
          setData(results);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      fetchData();
    }
  }, [realtime, collectionPath, conditions, limitCount, fetchData]);

  return { data, loading, error, refresh: fetchData };
}

/**
 * Hook for fetching a single document from Firestore
 */
export function useFirestoreDoc<T extends DocumentData>(
  docPath: string
): DocumentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError(null);

        const docSnap = await getDoc(doc(db, docPath));

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as unknown as T);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docPath]);

  return { data, loading, error };
}

/**
 * Hook for CRUD operations on a Firestore collection
 */
export function useFirestoreOperations(collectionPath: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (data: DocumentData) => {
      try {
        setLoading(true);
        setError(null);

        const docRef = await addDoc(collection(db, collectionPath), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return docRef.id;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );

  const update = useCallback(
    async (docId: string, data: Partial<DocumentData>) => {
      try {
        setLoading(true);
        setError(null);

        await updateDoc(doc(db, collectionPath, docId), {
          ...data,
          updatedAt: new Date(),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );

  const remove = useCallback(
    async (docId: string) => {
      try {
        setLoading(true);
        setError(null);

        await deleteDoc(doc(db, collectionPath, docId));
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );

  const getById = useCallback(
    async (docId: string) => {
      try {
        setLoading(true);
        setError(null);

        const docSnap = await getDoc(doc(db, collectionPath, docId));

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }

        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );

  return {
    add,
    update,
    remove,
    getById,
    loading,
    error,
  };
}
