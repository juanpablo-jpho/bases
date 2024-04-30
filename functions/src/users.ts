import {getFirestore} from "firebase-admin/firestore";
import { getAuth} from "firebase-admin/auth";
import { ModelsFunctions } from "./models";
import {onRequest } from "firebase-functions/v2/https";


const firestore = getFirestore();
const auth = getAuth();

const createUser = onRequest({cors: true}, async (request, response) => {
    // validaciones
    // const userData: ModelsFunctions.RequestCreateUser = request.body    
    const res:  ModelsFunctions.ResponseCreateUser = {
        ok: false
    }
    try {
        
        const user = await auth.createUser(
            {
                email: 'user@example.com',
                emailVerified: false,
                // phoneNumber: '+11234567890',
                password: 'secretPassword',
                displayName: 'John Doe',
                photoURL: 'https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png',
                disabled: false,
            }
        )
    
        const profile: ModelsFunctions.UserProfile = {
            name: user.displayName,
            photo: user.photoURL,
            age: 25,
            id: user.uid,
            email: user.email,
            roles: {
                cliente: true
            }
        }
        
        await firestore.doc(`Users/${user.uid}`).create(profile);
        res.uid = user.uid;
        res.ok = true;
        response.send(res);
    } catch (error) {
        console.log('error create user -> ', error);     
        response.send(res);
    }
    
    
});

const deleteUser = onRequest({cors: true}, async (request, response) => {
    // validaciones
    // const userData: ModelsFunctions.RequestCreateUser = request.body
    const res:  ModelsFunctions.ResponseCreateUser = {
        ok: false
    }
    try {
        
        const user = await auth.createUser(
            {
                email: 'user@example.com',
                emailVerified: false,
                // phoneNumber: '+11234567890',
                password: 'secretPassword',
                displayName: 'John Doe',
                photoURL: 'https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png',
                disabled: false,
            }
        )
    
        const profile: ModelsFunctions.UserProfile = {
            name: user.displayName,
            photo: user.photoURL,
            age: 25,
            id: user.uid,
            email: user.email,
            roles: {
                cliente: true
            }
        }
        
        await firestore.doc(`Users/${user.uid}`).create(profile);
        res.uid = user.uid;
        res.ok = true;
        response.send(res);
    } catch (error) {
        console.log('error create user -> ', error);     
        response.send(res);
    }
    
    
});


export const Users = {
    createUser,
    deleteUser
}
