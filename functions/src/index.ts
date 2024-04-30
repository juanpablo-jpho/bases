import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import { getAuth} from "firebase-admin/auth";
import {onRequest, onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import { auth as authv1, analytics} from "firebase-functions/v1";

import { ModelsFunctions} from "./models";

initializeApp();

import { Users } from "./users";

const firestore = getFirestore();
const auth = getAuth();

export const helloWorld = onRequest({cors: true}, async (request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    const headers = request.headers;
    // console.log('headers -> ', headers);
    try {
        const token: string = headers.authorization.split(' ')[1];
        const tokenResult: any = await auth.verifyIdToken(token)
        console.log('tokenResult -> ', tokenResult);
        if (tokenResult.roles?.admin) {
          const doc = await firestore.doc('/messages/qJo6boRt5PHHjWQlsuiL').get()
          if (doc.exists) {
            logger.log("message -> ", doc.data())
            response.send({data: doc.data()});
            return;
          } 
        }
        response.send({data: false});
        
      
    } catch (error) {
      console.log('error -> ', error);
      response.send({data: false});
    }
});

export const setRol = onRequest({cors: true}, async (request, response) => {
    // validaciones
    const res:  ModelsFunctions.ResponseSetRol = {
      ok: false
    }
    const body:  ModelsFunctions.RequestSetRol = request.body;
    console.log('setRol -> ', body);
    const roles = body.roles;
    const uid = body.uid
    const updateDoc = {
      roles: roles
    }
    try {
      await firestore.doc(`Users/${uid}`).update(updateDoc)
      console.log('rol cambiado con éxito');
      res.ok = true;
      response.send(res);
      
    } catch (error) {
        response.send(res);
      
    }
});

export const setClaim = onRequest({cors: true}, async (request, response) => {
  console.log(' setClaim  -> ', request.body);
  // validaciones
  const body:  ModelsFunctions.RequestSetRol = request.body;
  const roles = body.roles;
  const uid = body.uid
  const claims = {
    roles: roles,
  }
  await auth.setCustomUserClaims(uid, claims);
  console.log('set claim con éxito');
  
  response.send({ok: true})
})

export const createUser = Users.createUser;
export const deleteUser = Users.deleteUser;

export const appCall = onCall({cors: true}, async (request) => {

    console.log('appCall user -> ', request.auth.token);

    let valid = false;
    // valid = await isRol(request.auth.uid, ['admin']);
    const token: any = request.auth.token    
    console.log('token ', token);
    if (token.roles) {
      valid = token.roles.admin
    }
    if (valid) {
      console.log('hacer la funcion');

      const data: ModelsFunctions.RequestSetRol = request.data;
      const claims = {
        roles: data.roles
      }
      await auth.setCustomUserClaims(data.uid, claims);
      await firestore.doc(`Users/${data.uid}`).update(claims)

      console.log('set claim con éxito');
      return {ok: true}

    }
    throw new HttpsError("permission-denied", "no es admin");
});

export const sendWelcomeEmail = authv1.user().onCreate((user) => {
    // ...
});

export const sendCouponOnPurchase = analytics.event('in_app_purchase').onLog((event) => {
  // ...
  
});


// /Usuarios/{userId}/chat/{receptorId}/chats
export const makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
    // Grab the current value of what was written to Firestore.
    const data: any = event.data.data()
    const text: string = data.text;
  
    // Access the parameter `{documentId}` with `event.params`
    logger.log("Uppercasing", event.params.documentId, text);
  
    const uppercase = text.toUpperCase();
  
    // You must return a Promise when performing
    // asynchronous tasks inside a function
    // such as writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    const updateData = {
        text: uppercase
    }
    return event.data.ref.update(updateData)
})


// const isRol = async (uid: string, roles: string[]) => {
//    const doc = await firestore.doc(`Users/${uid}`).get();
//    let valid = false;
//    if (doc.exists) {
//      const data: any = doc.data();
//      roles.every( rol => {
//         if (data.roles[rol] == true) {
//           valid = true;
//           return false;
//         }
//         return true;
//      });
//    }
//    return valid;
// }
