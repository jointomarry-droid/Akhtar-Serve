"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseFirestoreOptions {
  collectionName: string;
  constraints?: QueryConstraint[];
  limitCount?: number;
}

interface UseFirestoreResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFirestore<T = DocumentData>({
  collectionName,
  constraints = [],
  limitCount = 50,
}: UseFirestoreOptions): UseFirestoreResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const collectionRef = collection(db, collectionName);
      const q = query(
        collectionRef,
        ...constraints,
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      setData(items);
    } catch (err: any) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, limitCount]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching products
export function useProducts(marketplace?: string) {
  const constraints: QueryConstraint[] = [];

  if (marketplace) {
    constraints.push(where("marketplace", "==", marketplace));
  }

  constraints.push(orderBy("createdAt", "desc"));

  return useFirestore({
    collectionName: "products",
    constraints,
  });
}

// Hook for fetching orders
export function useOrders(status?: string) {
  const constraints: QueryConstraint[] = [];

  if (status) {
    constraints.push(where("status", "==", status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  return useFirestore({
    collectionName: "orders",
    constraints,
  });
}

// Hook for fetching users
export function useUsers() {
  return useFirestore({
    collectionName: "users",
    constraints: [orderBy("createdAt", "desc")],
  });
}

// Hook for fetching inventory
export function useInventory() {
  return useFirestore({
    collectionName: "inventory",
    constraints: [orderBy("updatedAt", "desc")],
  });
}
