import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Models } from '../models/models';
import { Firestore, addDoc, and, collection, collectionData, deleteDoc, doc, docData, getDoc, getDocs, increment, limit, or, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from '@angular/fire/firestore';
import { DocumentSnapshot, QuerySnapshot, WhereFilterOp, collectionGroup } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore)

  constructor() {
    console.log('FirestoreService');
    // this.getDocumentsQueryDemo();

  }

  // CRUD -> CREATE - READ - UPDATE - DELETE
  // QUERY

//---| CREATE |---//
  async createDocumentDemo() {

    // 1.- setDoc
    // const refDoc = doc(this.firestore, "cities/LA");
    const refDoc = doc(this.firestore, "cities", "LA");
    const data: any = {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    } 
    await setDoc(refDoc, data);

    // combinar
    // setDoc(refDoc, data, { merge: true });


    // 2.- addDoc
    // Add a new document with a generated id.
    const refCollection = collection(this.firestore, "cities")
    const data1: any = {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      date: serverTimestamp()
    } 
    const docRef = await addDoc(refCollection, data1);
    console.log("Document written with ID: ", docRef.id);

    // 3.- 
    const refCollection1 = collection(this.firestore, "cities")
    const refDoc1 = doc(refCollection1);
    const data2: any = {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      id: refDoc1.id,
      date: serverTimestamp()
    } 
    await setDoc(refDoc1, data2);

    
  }

  async createDocument<tipo>(path: string, data: tipo) {
    const refCollection = collection(this.firestore, path)
    const refDoc = doc(refCollection);
    const dataDoc: any = data;
    dataDoc.id = refDoc.id;
    dataDoc.date = serverTimestamp();
    return await setDoc(refDoc, dataDoc);
  }

//----------------//

//---| UPDATE |---//
  async updateDocumentDemo() {
    const refDoc = doc(this.firestore, "cities/LA");
    // const refDoc = doc(this.firestore, "cities", "LA");
    const data: any = {
      // name: "Los Angeles",
      // state: "CA",
      country: "USA",
      updateAt: serverTimestamp() 
    } 
    await updateDoc(refDoc, data);

    // Actualiza los campos en objetos anidados
    // {
    //   name: "Frank",
    //   favorites: { food: "Pizza", color: "Blue", subject: "recess" },
    //   age: 12
    // }
    const data1: any = {
      'favorites.color': "Red"
      // favorites: { color: "Red" }
      // updateAt: serverTimestamp(); 
    } 
    // await updateDoc(refDoc, data1);

    // Actualiza elementos de un array
    const data2: any = {
      // name: "Los Angeles",
      // state: "CA",
      // country: "USA",
      // regions: ["region1", "region2"]
      // updateAt: serverTimestamp(); 
      population: increment(50)
    } 

    // Incrementa un valor numérico


  }

  async updateDocument(path: string, data: any) {
    const refDoc = doc(this.firestore, path);
    data.updateAt = serverTimestamp(); 
    return await updateDoc(refDoc, data);
  }
//----------------//


//---| DELETE |---//
  async deleteDocumentDemo() {
    // const refDoc = doc(this.firestore, "cities", "DC");
    const refDoc = doc(this.firestore, "cities/LA");
    await deleteDoc(refDoc);
  }

  async deleteDocument(path: string) {
    const refDoc = doc(this.firestore, path);
    return await deleteDoc(refDoc);
  }

//----------------// 

//---| READ |---//
  async getDocumentDemo() {
    // 1.- Llamar a un método para obtener los datos

      // leyendo un documento
      // const refDoc = doc(this.firestore, "Products", "0qHBwsEGi8f9QwwTkDA5");
      const refDoc = doc(this.firestore, "Products/0qHBwsEGi8f9QwwTkDA5");
      const docSnap = await getDoc(refDoc);
      if (docSnap.exists()) {
        console.log('docSnap.data() -> ', docSnap.data());
      }

      // leyendo varios documentos de una coleccion
      const refCollection = collection(this.firestore, "Products");
      // const consulta = query(refCollection, where("stock", ">=", 5));
      // const querySnapshot = await getDocs(consulta);
      //  querySnapshot.forEach((doc) => {
      //   console.log(doc.id, " => ", doc.data());
      // });

      // leyendo todos los documentos de una colección
      const refCollection1 = collection(this.firestore, "Products");
      const snapshot = await getDocs(refCollection1);
      snapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
      });

      // leer todos los documentos de una subcoleccion
      const refCollection2 = collection(this.firestore, "/Users/8njXZ7n0GuhJyi1ysXO9/pedidos");
      const snapshot1 = await getDocs(refCollection2);
      snapshot1.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
      });


      // leer documentos de grupos de colecciones
      const refCollectionGroup = collectionGroup(this.firestore, 'pedidos')
      const snapshot3 = await getDocs(refCollectionGroup);
      snapshot3.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
      });

    
    // 2.- Configurar un objeto de escucha para recibir eventos de cambios de datos


  }

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

  async getDocumentsQueryDemo() {
    console.log('getDocumentsQueryDemo');
    const refCollection = collection(this.firestore, "Products");
    // const q = query(refCollection, where("enable", "==", true));
    // const q = query(refCollection, where("stock", ">=", 10));

    // no igual (!=) y not-in excluyen los documentos en los que no existe el campo especificado.
    // const q = query(refCollection, where("salty", "!=", true));

    // Pertenencia a un array
    // const q = query(refCollection, where("categories", "array-contains", "Drinks"));

    // in, not-in y array-contains-any
    // const q = query(refCollection, where('name', 'in', ['Hotdog', 'Fish']));
    
    // const q = query(refCollection, where("categories", 'array-contains-any', ['fastfood', 'Drinks']));
    // const q = query(refCollection, where("enable", "==", true), where("salty", "==", true));
    
    
    // Consultas (AND) compuestas
    // const q = query(refCollection, where("enable", "==", true), where("price", ">=", 10));
    // const q = query(refCollection, where("enable", "==", true), where("stock", ">=", 10));


    // No válido: Filtros de rango en diferentes campos
    const init = new Date();
    const finish = new Date();
    finish.setMonth(finish.getMonth() + 1);
    // const q = query(refCollection, where("date", ">=", init), where("date", "<=", finish));
    // const q = query(refCollection, where("price", ">=", 10), where("price", "<=", 20));
    // const q = query(refCollection, where("price", ">=", 5), where("price", "<=", 20), where('enable', '==', true));
    

    // consultas OR compuestas
    // const q = query(refCollection,  or(where('enable', '==', false), where('price', '>=', 15)) );

    // const q = query(refCollection,  or(where('name', '==', 'Hotdog'), where('name', '==', 'Fish')) )
    // const q = query(refCollection, where('name', 'in', ['Hotdog', 'Fish']));
    
    // Consultas de grupos de colecciones
    // const refCollectionGroup = collectionGroup(this.firestore, 'pedidos')
    // const q = query(refCollectionGroup, where('state', '==', 'new'));
    // const q = query(refCollectionGroup, where('user.id', '==', '8njXZ7n0GuhJyi1ysXO9'),  where('state', '==', 'new'));


    // orderBy y existencia
    // const q = query(refCollection, orderBy('price', 'asc'));
    // const q = query(refCollection, where('price', '<=', 10));
    // const q = query(refCollection, where('price', '<=', 10), orderBy('price', 'desc'));
    // const q = query(refCollection, where('enable', '==', true), orderBy('date', 'asc'));

    // limitar - paginar
    // const q = query(refCollection,  where('enable', '==', true), orderBy('date', 'asc'), limit(2));
    // const q = query(refCollection, orderBy('date'), limit(2));

    // const q = query(refCollection, orderBy('date', 'desc'), limit(2));

    const refDoc = doc(this.firestore, 'Products/vgcz7CsCA0Wpwpbf4XUV');
    const snapDoc = await getDoc(refDoc);
    const q = query(refCollection, orderBy('date'), startAfter(snapDoc), limit(2));

    

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
    });

    collectionData(q).subscribe( res => {
      console.log('res -> ', res);      
    });



  }

  async getDocumentsQuery<tipo>(
    path: string, querys: Models.Firebase.whereQuery[], 
    extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

      console.log('getDocumentsQuery()');   
      let ref: any;
      if (!extras.group) {
        ref = collection(this.firestore, path);
      } else {
        ref = collectionGroup(this.firestore, path);
      }     

      let ors: any = [];
      querys.forEach( (row) => {
        let wheres: any = [];
        for (let col = 0; col < row.length; col = col + 3) {
          wheres.push(where(row[col], row[col + 1], row[col + 2]))
        }
        ors.push( and(...wheres) )
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
      return await getDocs(q) as QuerySnapshot<tipo>;
  }

  getDocumentsQueryChanges<tipo>(
    path: string, querys: Models.Firebase.whereQuery[], 
    extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

      console.log('getDocumentsQueryChanges()');   
      let ref: any;
      if (!extras.group) {
        ref = collection(this.firestore, path);
      } else {
        ref = collectionGroup(this.firestore, path);
      }     

      // q = [
      //       ['enable', '==', true, 'salty', '==', true], 
      //       ['name', '==', 'Water']

      //    ];
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
      return collectionData(q) as Observable<tipo[]>;
  }

  // getDocumentQueryTwoWhere('Products', 'enable', '==', true, 'salty' '==', true)
  getDocumentQueryTwoWhere() {
  }

  // getDocumentQueryWhereLimit('Products', 'enable', '==', true, 2)
  getDocumentQueryWhereLimit(path: string, campo: string, condicion: string, value: any, limit: number) {
    
  }

  async getDocumentsQueryWhere<tipo>(path: string, campo: string, condicion: WhereFilterOp, value: any) {
    const refCollection = collection(this.firestore, path);
    const q = query(refCollection, where(campo, condicion, value));
    return await getDocs(q) as QuerySnapshot<tipo>;
  }
        
  

  // async count(path: string) {
  //   // const refCollection = collection(this.firestore, path);
  //   // const snapshot = await getCountFromServer(refCollection);
  //   // console.log('snapshot -> ', snapshot);
  //   // return snapshot.data().count
  // }

  // Use the sum() aggregation
  // async sum(path: string, field: string) {
    // const coll = collection(this.firestore, path);
    // const snapshot = await getAggregateFromServer(coll, {
    //   [field]: sum(field)
    // });
    // console.log('total: ', snapshot.data());
  // }
}


