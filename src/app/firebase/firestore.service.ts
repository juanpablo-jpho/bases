import { Injectable, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, doc, docData, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  constructor() {}

  // CRUD -> CREATE - READ - UPDATE - DELETE
  // QUERY

  
//---| CREATE |---//
  createDocument() {
  }
//----------------//

//---| READ |---//
  async getDocument<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace);
    return await getDoc(document) as DocumentSnapshot<tipo> ;    
  }

  getDocumentChanges<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace);
    return docData(document) as Observable<tipo> ;   
  }

  getCollection() {
  }

  getCollectionChanges() {
  }
//----------------//

//---| UPDATE |---//
  updateDocument() {
  }
//----------------//

//---| DELETE |---//
  deleteDocument() {
  }

  deleteDocFromRef() {}
//----------------//  

//---| QUERY |---//
  getCollectionQuery() {}

  getCollectionOrderLimit() {}

  getCollectionQueryOrderLimit() {}
//----------------//  

  createIdDoc() {}

}
