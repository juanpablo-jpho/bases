import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Models } from '../models/models';
import { DocumentSnapshot, Firestore, QuerySnapshot, and, average, collection, 
  collectionData, collectionGroup, deleteDoc, doc, docData, getAggregateFromServer, 
  getCountFromServer, getDoc, getDocs, limit, or, orderBy, query, serverTimestamp, 
  setDoc, startAfter, sum, updateDoc, where} from '@angular/fire/firestore';
import { WhereFilterOp } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore)

  constructor() { 

  }

//---| CREATE |---//
  async createDocument<tipo>(path: string, data: tipo, id: string = null) {
    let refDoc;
    if (id) {
      refDoc = doc(this.firestore, `${path}/${id}`);
    } else {
      const refCollection = collection(this.firestore, path)
      refDoc = doc(refCollection);
    }
    const dataDoc: any = data;
    dataDoc.id = refDoc.id;
    dataDoc.date = serverTimestamp();
    await setDoc(refDoc, dataDoc);
    return dataDoc.id;
  }

//----------------//

//---| UPDATE |---//
  async updateDocument(path: string, data: any) {
    const refDoc = doc(this.firestore, path);
    data.updateAt = serverTimestamp(); 
    return await updateDoc(refDoc, data);
  }
//----------------//


//---| DELETE |---//
  async deleteDocument(path: string) {
    const refDoc = doc(this.firestore, path);
    return await deleteDoc(refDoc);
  }

//----------------// 

//---| READ |---//
  async getDocument<tipo>(path: string) {
    const refDocument = doc(this.firestore, path);
    return await getDoc(refDocument) as DocumentSnapshot<tipo> ;    
  }

  async getDocuments<tipo>(path: string, group: boolean = false) {
    if (!group) {
      const refCollection = collection(this.firestore, path);
      return await getDocs(refCollection) as QuerySnapshot<tipo> ;    
    } else  {
      const refCollectionGroup = collectionGroup(this.firestore, path)
      return await getDocs(refCollectionGroup) as QuerySnapshot<tipo>;
    }
  }

  getDocumentChanges<tipo>(path: string) {
    const refDocument = doc(this.firestore, path);
    return docData(refDocument) as Observable<tipo> ;   
  }

  getDocumentsChanges<tipo>(path: string, group: boolean = false) {
    if (!group) {
      const refCollection = collection(this.firestore, path);
      return collectionData(refCollection) as Observable<tipo[]> ;    
    } else  {
      const refCollectionGroup = collectionGroup(this.firestore, path)
      return collectionData(refCollectionGroup) as Observable<tipo[]>;
    }
  }


//----------------//

//---| QUERY |---//

  async getDocumentsQuery<tipo>(
    path: string, querys: Models.Firebase.whereQuery[], 
    extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

      let q = this.getQuery(path, querys, extras)
      return await getDocs(q) as QuerySnapshot<tipo>;
  }

  getDocumentsQueryChanges<tipo>(
    path: string, querys: Models.Firebase.whereQuery[], 
    extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

      let q = this.getQuery(path, querys, extras)
      return collectionData(q) as Observable<tipo[]>;
  }

  async getDocumentsOneQuery<tipo>(path: string, campo: string, condicion: WhereFilterOp, valor: string) {
    let ref = collection(this.firestore, path);
    let q = query(ref, where(campo, condicion, valor))
    return await getDocs(q) as QuerySnapshot<tipo>;
  }

//----------------//

//---| AGGREGATIONS |---//
      
  async getCount(path: string, group: boolean = false) {
    if (!group) {
      const refCollection = collection(this.firestore, path);
      let q = query(refCollection, where('enable', '==', true))
      const snapshot = await getCountFromServer(q );
      return snapshot.data().count
    } else  {
      const refCollectionGroup = collectionGroup(this.firestore, path)
      let q = query(refCollectionGroup, where('user.id', '==', '8njXZ7n0GuhJyi1ysXO9'))
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count
    }
  }

  async getSum(path: string, field: string, group: boolean = false) {
    let ref = group? collectionGroup(this.firestore, path) : collection(this.firestore, path);
    const snapshot = await getAggregateFromServer(ref, {
      total: sum(field)
    });
    return snapshot.data().total
  }

  async getAverage(path: string, field: string, group: boolean = false) {
    let ref = group? collectionGroup(this.firestore, path) : collection(this.firestore, path);
    const snapshot = await getAggregateFromServer(ref, {
      total: average(field)
    });
    return snapshot.data().total
  } 

  async getAggregations(path: string, aggregate: any,  
                        querys: Models.Firebase.whereQuery[] = [], 
                        extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {
   
    let q = this.getQuery(path, querys, extras)
    const snapshot = await getAggregateFromServer(q, aggregate);
    return snapshot.data()
  }

//----------------//

  private getQuery(path: string, querys: Models.Firebase.whereQuery[], extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {
   
        let ref = extras.group? collectionGroup(this.firestore, path) : collection(this.firestore, path);
     
        let ors: any = [];
        querys.forEach( (row) => {
          let wheres: any = [];
          for (let col = 0; col < row.length; col = col + 3) {
            wheres.push(where(row[col], row[col + 1], row[col + 2]))
          }
          const AND = and(...wheres) 
          ors.push( AND )
        });
        let q = query(ref, or(...ors))
  
        // limit
        if (extras.limit) {
          q = query(q, limit(extras.limit))
        } 
  
        // orderBy 
        if (extras.orderParam) {
          q = query(q, orderBy(extras.orderParam, extras.directionSort))
        } 
  
        // startAfter
        if (extras.startAfter) {
          q = query(q, startAfter(extras.startAfter))
        } 

        return q;
    
  }

}





