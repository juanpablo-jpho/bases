import { ModelsStore } from 'src/app/models/store.models';
import { ModelsHome } from 'src/app/models/home.models';
import { ModelsNotification } from 'src/app/models/notifications.models';
import { ModelsContact } from 'src/app/models/contact.models';
import { ModelsFirebase } from 'src/app/models/firebase.models';
import { ModelsAuth } from 'src/app/models/auth.models';
import { ModelsFunctions } from 'src/app/models/functions.models';

export namespace Models {

    export import Home = ModelsHome;
    export import Store = ModelsStore;
    export import Notification = ModelsNotification;
    export import Contact = ModelsContact;
    export import Firebase = ModelsFirebase;
    export import Auth = ModelsAuth;
    export import Functions = ModelsFunctions

}
