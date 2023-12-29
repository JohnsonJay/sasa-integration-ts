import * as admin from "firebase-admin";
import { database } from "firebase-admin";
import { get_last_synced_date } from "../utils/date_utils";

import { SasaService } from "../services/SasaService";
import { SasaPayload } from "../interfaces/SasaInterface";
import { EsriController } from "./EsriController";
import { FeatureLayerDBRef, FeatureLayerType, FeatureState } from "../interfaces/FirebaseInterface";
import {
    EsriAssessmentFeatureLayer,
    EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer
} from "../interfaces/EsriInterface";
import DataSnapshot = database.DataSnapshot;

type EventType =
    | "value"
    | "child_added"
    | "child_changed"
    | "child_moved"
    | "child_removed";

interface FirebaseQueryParams {
    child: string,
    order_by_child: string,
    equal_to: string | number | boolean | null,
    limit_to_first: number,
    event_type: EventType
}

export class FirebaseController {
    constructor(

        private esri_controller: EsriController,
        private sasa_service?: SasaService,
    ) {}

    private async _get_snapshot(
        reference: string,
        firebase_query_params: FirebaseQueryParams
    ) : Promise<DataSnapshot> {
        const sasa_data_list_ref = admin.database().ref(reference);
        return sasa_data_list_ref.child(firebase_query_params.child)
            .orderByChild(firebase_query_params.order_by_child)
            .equalTo(firebase_query_params.equal_to)
            .limitToFirst(firebase_query_params.limit_to_first)
            .once(firebase_query_params.event_type);
    }
    public async add_sasa_data() {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const sasa_data: SasaPayload[] = await this.sasa_service.fetch_sasa_data();
            if (!sasa_data) {
                throw new Error( "No data from SASA API" );
            }

            for (const farmer_data of sasa_data) {
                await admin.database().ref(`sasa-raw-data/sasa-data-list${farmer_data.uuid}`).set({
                    ...farmer_data,
                    assessment_feature_data_synced: false,
                    demographic_feature_data_synced: false,
                    field_feature_data_synced: false,
                    last_synced: get_last_synced_date(),
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async build_field_feature_layers(): Promise<void> {
        try {
            const firebase_query_params: FirebaseQueryParams = {
                child: "sasa-data-list",
                order_by_child: "field_feature_data_synced",
                equal_to: false,
                limit_to_first: 30,
                event_type: "value",
            };
            const snapshot = await this._get_snapshot(
                "sasa-raw-data",
                firebase_query_params
            );

            const available_data = snapshot.val();

            if (!available_data) {
                console.info("No data to process");
                return;
            }

            console.info("Processing data");

            for (const key in available_data) {
                // eslint-disable-next-line no-prototype-builtins
                if (available_data.hasOwnProperty(key)) {
                    const farmer_data = available_data[key];
                    const field_feature = this.esri_controller
                        .build_fields_feature_layer(farmer_data);

                    if (field_feature) {
                        if (Array.isArray(field_feature)) {
                            for (const feature of field_feature) {
                                await admin.database()
                                    .ref(`fields-feature-layers/fields-layers-list/${feature.attributes.farmer_field_uuid}`)
                                    .set({
                                        ...feature,
                                        last_updated: get_last_synced_date(),
                                        feature_state: FeatureState.add_pending,
                                    });
                            }
                        } else {
                            await admin.database()
                                .ref(`fields-feature-layers/fields-layers-list/${farmer_data.uuid}`)
                                .set({
                                    ...field_feature,
                                    feature_state: FeatureState.add_pending,
                                    last_updated: new Date(Date.now()).toUTCString(),
                                });
                        }

                        await admin.database()
                            .ref("sasa-raw-data/sasa-data-list")
                            .child(farmer_data.uuid)
                            .update({
                                field_feature_data_synced: true,
                                last_synced: get_last_synced_date(),
                            });
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async build_demographic_feature_layers(): Promise<void> {
        const firebase_query_params: FirebaseQueryParams = {
            child: "sasa-data-list",
            order_by_child: "demographic_feature_data_synced",
            equal_to: false,
            limit_to_first: 30,
            event_type: "value",
        };
        const snapshot = await this._get_snapshot(
            "sasa-raw-data",
            firebase_query_params
        );
        const available_data = snapshot.val();

        if (!available_data) {
            console.info("No data to process");
            return;
        }

        console.info("Processing data");

        for (const key in available_data) {
            // eslint-disable-next-line no-prototype-builtins
            if (available_data.hasOwnProperty(key)) {
                const farmer_data = available_data[key];
                const demographics_feature = this.esri_controller
                    .build_demographics_feature_layer(farmer_data);

                if (demographics_feature) {
                    await admin.database().ref(`demographics-feature-layers/demographics-layers-list/${farmer_data.uuid}`).set({
                        ...demographics_feature,
                        feature_state: FeatureState.add_pending,
                        last_updated: get_last_synced_date(),
                    });

                    await admin.database()
                        .ref("sasa-raw-data/sasa-data-list")
                        .child(farmer_data.uuid)
                        .update({
                            demographic_feature_data_synced: true,
                            last_synced: Date.now(),
                        });
                }
            }
        }
    }

    public async build_assessment_feature_layers(): Promise<void> {
        const firebase_query_params: FirebaseQueryParams = {
            child: "sasa-data-list",
            order_by_child: "assessment_feature_data_synced",
            equal_to: false,
            limit_to_first: 30,
            event_type: "value",
        };
        const snapshot = await this._get_snapshot(
            "sasa-raw-data",
            firebase_query_params
        );
        const available_data = snapshot.val();

        if (!available_data) {
            console.info("No data to process");
            return;
        }

        console.info("Processing data");

        for (const key in available_data) {
            // eslint-disable-next-line no-prototype-builtins
            if (available_data.hasOwnProperty(key)) {
                const farmer_data = available_data[key];
                const assessments_feature = this.esri_controller
                    .build_assessments_feature_layer(farmer_data);

                if (assessments_feature) {
                    await admin.database()
                        .ref(`assessments-feature-layers/assessments-layers-list/${farmer_data.uuid}`)
                        .set({
                            ...assessments_feature,
                            feature_state: FeatureState.add_pending,
                            last_updated: get_last_synced_date(),
                        });

                    await admin.database()
                        .ref("sasa-raw-data/sasa-data-list")
                        .child(farmer_data.uuid)
                        .update({
                            assessment_feature_data_synced: true,
                            last_synced: Date.now(),
                        });
                }
            }
        }
    }

    public async get_feature_layers(
        feature_layer_type: FeatureLayerType = FeatureLayerType.assessments
    ):
        Promise<
            EsriAssessmentFeatureLayer[] |
            EsriDemographicsFeatureLayer[] |
            EsriFieldFeatureLayer[] |
            undefined
        > {
        let firebase_query_params: FirebaseQueryParams;
        let feature_layer_db_ref: FeatureLayerDBRef;

        if (feature_layer_type === FeatureLayerType.assessments) {
            firebase_query_params = {
                child: "assessments-layers-list",
                order_by_child: "feature_state",
                equal_to: FeatureState.add_pending,
                limit_to_first: 30,
                event_type: "value",
            };
            feature_layer_db_ref = FeatureLayerDBRef.assessments;
        } else if (feature_layer_type === FeatureLayerType.demographics) {
            firebase_query_params = {
                child: "demographics-layers-list",
                order_by_child: "feature_state",
                equal_to: FeatureState.add_pending,
                limit_to_first: 30,
                event_type: "value",
            };
            feature_layer_db_ref = FeatureLayerDBRef.demographics;
        } else {
            firebase_query_params = {
                child: "fields-layers-list",
                order_by_child: "feature_state",
                equal_to: FeatureState.add_pending,
                limit_to_first: 30,
                event_type: "value",
            };
            feature_layer_db_ref = FeatureLayerDBRef.fields;
        }

        const snapshot = await this._get_snapshot(
            feature_layer_db_ref,
            firebase_query_params
        );

        const available_data = snapshot.val();

        if (!available_data) {
            console.info("No data available to process");
            return;
        }

        const farmer_list: EsriAssessmentFeatureLayer[] = [];
        for (const key in available_data) {
            // eslint-disable-next-line no-prototype-builtins
            if (available_data.hasOwnProperty(key)) {
                const farmer_data = available_data[key];
                farmer_list.push(farmer_data);
            }
        }

        return farmer_list;
    }

    public async add_assessment_object_id(
        farmer_uuid: string,
        state: FeatureState,
        object_id?: number,
    ): Promise<void> {
        try {
            await admin.database()
                .ref("assessments-feature-layers/assessments-layers-list")
                .child(farmer_uuid)
                .update({
                    OBJECTID: object_id ? object_id : null,
                    state: state,
                });
        } catch (error) {
            console.error(error);
        }
    }

    public async add_demographics_object_id(
        farmer_uuid: string,
        state: FeatureState,
        object_id?: number,
    ): Promise<void> {
        try {
            await admin.database()
                .ref("demographics-feature-layers/demographics-layers-list")
                .child(farmer_uuid)
                .update({
                    OBJECTID: object_id ? object_id : null,
                    state: state,
                });
        } catch (error) {
            console.error(error);
        }
    }
}
