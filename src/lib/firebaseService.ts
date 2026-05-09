import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import crypto from 'crypto';

/**
 * Creates a valid UUID/hash string (keeps interface compatibility with old service)
 */
export function generateUUIDFromString(str: string): string {
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export async function saveScanResult(url: string, score: number, vulnerabilities: any[], userId: string = 'anonymous') {
  try {
    const safeUserId = userId === 'anonymous' ? userId : generateUUIDFromString(userId);
    
    // Add a new document to the 'scan_results' collection
    const docRef = await addDoc(collection(db, 'scan_results'), {
      url,
      score,
      vulnerabilities: JSON.stringify(vulnerabilities),
      user_id: safeUserId,
      created_at: new Date().toISOString()
    });
    
    return { success: true, data: { id: docRef.id } };
  } catch (err) {
    console.error('Error saving scan result to Firebase:', err);
    return { success: false, error: err };
  }
}

export async function getPreviousScans(url: string, userId: string = 'anonymous') {
  try {
    const safeUserId = userId === 'anonymous' ? userId : generateUUIDFromString(userId);
    
    // Query 'scan_results' collection
    const q = query(
      collection(db, 'scan_results'),
      where('url', '==', url),
      where('user_id', '==', safeUserId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const data: any[] = [];
    
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data };
  } catch (err) {
    console.error('Error fetching previous scans from Firebase:', err);
    return { success: false, error: err };
  }
}
