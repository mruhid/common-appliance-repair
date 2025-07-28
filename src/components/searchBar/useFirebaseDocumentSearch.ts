"use client";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { capitalizeSentences } from "@/lib/utils";

export interface FirebaseSearchResult<T = DocumentData> {
  documents: T[];
  isPending: boolean;
  notFound: boolean;
  error: string | null;
}

function useFirebaseDocumentSearch<T = DocumentData>(
  documentName: string,
  fieldsNameArray: string[],
  searchValue: string
): FirebaseSearchResult<T> {
  const [documents, setDocuments] = useState<T[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchValue || searchValue.trim() === "") {
      setDocuments([]);
      setNotFound(false);
      setError(null);
      return;
    }

    const delay = setTimeout(async () => {
      setIsPending(true);
      setError(null);
      setNotFound(false);
      setDocuments([]);

      try {
        let foundDocs: T[] = [];

        for (const field of fieldsNameArray) {
          const formattedSearchValue =
            field === "TicketNumber"
              ? searchValue.toUpperCase()
              : capitalizeSentences(searchValue);

          const q = query(
            collection(db, documentName),
            orderBy(field),
            startAt(formattedSearchValue),
            endAt(formattedSearchValue + "\uf8ff")
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            foundDocs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as T[];
            break; // Stop after first match
          }
        }

        if (foundDocs.length > 0) {
          setDocuments(foundDocs);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        setError(err.message || "Failed to search.");
      } finally {
        setIsPending(false);
      }
    }, 2000);

    return () => clearTimeout(delay);
  }, [searchValue, documentName, fieldsNameArray]);

  return {
    documents,
    isPending,
    notFound,
    error,
  };
}

export default useFirebaseDocumentSearch;
