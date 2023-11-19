import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SasaService } from "./services/SasaService";
import { EsriController } from "./controllers/EsriController";
import { EsriService } from "./services/EsriService";
import { FirebaseController } from "./controllers/FirebaseController";

admin.initializeApp();

export const daily_data_sync = functions.pubsub.schedule("50 4 * * *").onRun(async (context) => {
    const sasa_service = new SasaService();
    const esri_service = new EsriService();
    const esri_controller = new EsriController(esri_service);
    const firebase_controller = new FirebaseController(
        sasa_service,
        esri_controller
    );
    await firebase_controller.add_sasa_data();
});
