import * as admin from "firebase-admin";
import { get_last_synced_date } from "../utils/date_utils";

import { SasaService } from "../services/SasaService";
import { SasaPayload } from "../interfaces/SasaInterface";
import { EsriController } from "./EsriController";
import { FeatureState } from "../interfaces/FirebaseInterface";
import { database } from "firebase-admin";
import DataSnapshot = database.DataSnapshot;

type EventType =
    | "value"
    | "child_added"
    | "child_changed"
    | "child_moved"
    | "child_removed";

class FirebaseController {
    constructor(
        private sasa_service: SasaService,
        private esri_controller: EsriController,
    ) {}

    private async _get_snapshot(
        ref: string,
        child: string,
        order_by_child: string,
        equal_to: string | number | boolean | null,
        limit_to_first: number,
        event_type: EventType
    ) : Promise<DataSnapshot> {
        const sasa_data_list_ref = admin.database().ref(ref);
        return sasa_data_list_ref.child(child)
            .orderByChild(order_by_child)
            .equalTo(equal_to)
            .limitToFirst(limit_to_first)
            .once(event_type);
    }
    public async add_sasa_data() {
        try {
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

    public async build_fields_feature_layers(): Promise<void> {
        try {
            const snapshot = await this._get_snapshot(
                "sasa-raw-data",
                "sasa-data-list",
                "field_feature_data_synced",
                false,
                30,
                "value"
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
                                    .ref(`polygon-feature-layers/polygon-layers-list/${feature.attributes.farmer_field_uuid}`)
                                    .set({
                                        ...feature,
                                        last_updated: get_last_synced_date(),
                                        feature_state: FeatureState.add_pending,
                                    });
                            }
                        } else {
                            await admin.database()
                                .ref(`polygon-feature-layers/polygon-layers-list/${farmer_data.uuid}`)
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

    public async build_demographics_feature_layers(): Promise<void> {
        const snapshot = await this._get_snapshot(
            "sasa-raw-data",
            "sasa-data-list",
            "demographic_feature_data_synced",
            false,
            30,
            "value"
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

    public async build_assessments_feature_layers(): Promise<void> {
        const snapshot = await this._get_snapshot(
            "sasa-raw-data",
            "sasa-data-list",
            "assessment_feature_data_synced",
            false,
            30,
            "value"
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
}
