import * as functions from "firebase-functions";
import { SasaController } from "./controllers/SasaController";
import * as admin from "firebase-admin";

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    const sasaController = new SasaController();
    console.log(sasaController.getSasaData());
    response.send("Hello from Firebase!");
});
