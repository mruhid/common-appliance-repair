import {
  collection,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { app, db } from "./firebase";
import { CCSTaffProps, EmployeeProps } from "./types";

const cursorCache: Record<number, QueryDocumentSnapshot<DocumentData> | null> =
  {};

export const fetchCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
};

export const fetchDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T> => {
  const ref = doc(db, collectionName, docId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    throw new Error(
      `Document with ID "${docId}" not found in "${collectionName}"`
    );
  }
  return { id: snapshot.id, ...snapshot.data() } as T;
};

export async function findEmployeeByName(
  name: string
): Promise<EmployeeProps | null> {
  if (!name.trim()) return null;

  const employeeRef = collection(db, "employees");
  const q = query(employeeRef, where("name", "==", name));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0].data() as EmployeeProps;
}

export async function findUserByCredentials(
  username: string,
  password: string
): Promise<CCSTaffProps | null> {
  const db = getFirestore(app);
  const usersRef = collection(db, "CC Staff");

  const q = query(usersRef, where("username", "==", username));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const user = snapshot.docs[0].data() as CCSTaffProps;

  if (user.password !== password) {
    return null;
  }

  return user;
}

export async function findDocumentsByFieldValuePaginated<T>(
  collectionName: string,
  field: string,
  fieldValue: string,
  pageSize: number,
  pageNumber: number,
  setTotalPages: (count: number) => void,
  orderByFieldName: string
): Promise<(T & { id: string })[]> {
  const db = getFirestore(app);
  const collectionRef = collection(db, collectionName);

  const countQuery = query(collectionRef, where(field, "==", fieldValue));
  const snapshotCount = await getCountFromServer(countQuery);
  const totalCount = snapshotCount.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);
  setTotalPages(totalPages);

  let baseQuery = query(
    collectionRef,
    where(field, "==", fieldValue),
    orderBy(orderByFieldName, "asc"),
    limit(pageSize)
  );

  if (pageNumber > 1) {
    const previousCursor = cursorCache[pageNumber - 1];

    if (!previousCursor) {
      const tempQuery = query(
        collectionRef,
        where(field, "==", fieldValue),
        orderBy(orderByFieldName, "asc"),
        limit((pageNumber - 1) * pageSize)
      );

      const tempSnapshot = await getDocs(tempQuery);
      const lastVisible = tempSnapshot.docs[tempSnapshot.docs.length - 1];
      cursorCache[pageNumber - 1] = lastVisible || null;
    }

    const startAfterDoc = cursorCache[pageNumber - 1];
    if (startAfterDoc) {
      baseQuery = query(
        collectionRef,
        where(field, "==", fieldValue),
        orderBy(orderByFieldName, "asc"),
        startAfter(startAfterDoc),
        limit(pageSize)
      );
    }
  }

  const snapshot = await getDocs(baseQuery);
  const docs = snapshot.docs;

  if (docs.length > 0) {
    cursorCache[pageNumber] = docs[docs.length - 1];
  }

  return docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T),
  }));
}
