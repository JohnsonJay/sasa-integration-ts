import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SasaService } from "./services/SasaService";
import { EsriController } from "./controllers/EsriController";
import { EsriService } from "./services/EsriService";
import { FirebaseController } from "./controllers/FirebaseController";
import { FeatureLayerType, FeatureState } from "./interfaces/FirebaseInterface";
import { EsriDemographicsFeatureLayer } from "./interfaces/EsriInterface";

admin.initializeApp();

exports.daily_data_sync = functions.pubsub.schedule("50 4 * * *").onRun(async (context) => {
    const sasa_service = new SasaService();
    const esri_service = new EsriService();
    const esri_controller = new EsriController(esri_service);
    const firebase_controller = new FirebaseController(
        esri_controller,
        sasa_service
    );
    await firebase_controller.add_sasa_data();
});

exports.generate_assessment_feature_layer = functions.pubsub.schedule("every 30 minutes").onRun(async ( context ) => {
    try {
        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(
            esri_controller
        );
        await firebase_controller.build_assessment_feature_layers();
    } catch (error) {
        functions.logger.error(error);
    }
});

exports.generate_demographics_feature_layer = functions.pubsub.schedule("every 30 minutes").onRun(async ( context ) => {
    try {
        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(
            esri_controller,
        );
        await firebase_controller.build_demographic_feature_layers();
    } catch (error) {
        functions.logger.error(error);
    }
});

exports.generate_fields_feature_layer = functions.pubsub.schedule("every 30 minutes").onRun(async ( context ) => {
    try {
        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(
            esri_controller,
        );
        await firebase_controller.build_field_feature_layers();
    } catch (error) {
        functions.logger.error(error);
    }
});

exports.send_assessment_data_to_esri = functions.pubsub.schedule("every 30 minutes").onRun(async (context) => {
    try {
        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(esri_controller);
        const assessments = await firebase_controller
            .get_feature_layers(FeatureLayerType.assessments);

        if (!assessments) {
            return;
        }

        const results = await esri_controller.create_assessments_feature_layer(assessments);
        let counter = 0; // initialise counter
        // loop through results from esri response
        for (const result of results) {
            if (result.success) {
                // if successful, update record in firebase and include objectid
                await firebase_controller.add_assessment_object_id(
                    assessments[counter].attributes.farmer_uuid,
                    FeatureState.add_success,
                    result.objectId,
                );
            } else {
                // if error, update state on record in firebase
                await firebase_controller.add_assessment_object_id(
                    assessments[counter].attributes.farmer_uuid,
                    FeatureState.add_failure
                );
            }
            counter++;
        }
    } catch (error) {
        functions.logger.error(error);
    }
});

exports.send_demographics_data_to_esri = functions.pubsub.schedule("every 30 minutes").onRun(async (context) => {
    try {
        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(esri_controller);
        const demographics: EsriDemographicsFeatureLayer[] = await firebase_controller
            .get_feature_layers(FeatureLayerType.demographics);

        if (!demographics) {
            return;
        }

        const results = await esri_controller.create_demographics_feature_layer(demographics);
        let counter = 0; // initialise counter
        // loop through results from esri response
        for (const result of results) {
            if (result.success) {
                // if successful, update record in firebase and include objectid
                await firebase_controller.add_demographics_object_id(
                    demographics[counter].attributes.farmer_uuid,
                    FeatureState.add_success,
                    result.objectId,
                );
            } else {
                // if error, update state on record in firebase
                await firebase_controller.add_demographics_object_id(
                    demographics[counter].attributes.farmer_uuid,
                    FeatureState.add_failure
                );
            }
            counter++;
        }
    } catch (error) {
        functions.logger.error(error);
    }
});

exports.send_fields_data_to_esri = functions.pubsub.schedule("every 30 minutes").onRun(async (context) => {
    try {
        functions.logger.info("Attempting to process fields");

        const esri_service = new EsriService();
        const esri_controller = new EsriController(esri_service);
        const firebase_controller = new FirebaseController(esri_controller);
        const fields = await firebase_controller
            .get_feature_layers(FeatureLayerType.fields);

        if (!fields) {
            functions.logger.info("No fields data to process");
            return;
        }

        const results = await esri_controller.create_fields_feature_layer(fields);

        functions.logger.info("Completed processing fields data");
    } catch (error) {
        functions.logger.error(error);
    }
});
