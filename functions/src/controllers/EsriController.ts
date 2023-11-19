import {
    EsriAddResult,
    EsriAssessmentFeatureLayer,
    EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer,
} from "../interfaces/EsriInterface";
import { AssessmentsData, SasaPayload } from "../interfaces/SasaInterface";
import { EsriService } from "../services/EsriService";

/**
 * Controller class for Esri Data
 */
export class EsriController {
    constructor(
        private esri_service: EsriService
    ) {}

    public build_demographics_feature_layer( data: SasaPayload ): EsriDemographicsFeatureLayer {
        let location = null;
        if ( data.demographic?.location ) {
            location = data.demographic.location;
        }

        return {
            geometry: location ? {
                x: location.longitude,
                y: location.latitude,
                spatialReference: {
                    wkid: 4326,
                },
            } : undefined,
            attributes: {
                farmer_uuid: data.uuid,
                farmer_name: data.name,
                farmer_gender: data.demographic?.gender,
                identity_type: data.demographic?.identity_type,
                identity_number: data.demographic?.identity_number,
                farmer_age: data.demographic?.age,
                birthdate: data.demographic?.birthdate,
                level_of_education: data.demographic?.level_of_education,
                work_type: data.demographic?.work_type,
                employment_status: data.demographic?.employment_status,
                marital_status: data.demographic?.marital_status,
                disability: data.demographic?.disability,
                primary_language: data.demographic?.primary_language,
                income: data.demographic?.income,
                dependants: data.economic?.dependants,
                transport: data.economic?.transport,
            },
        };
    }

    // eslint-disable-next-line max-len
    public build_assessments_feature_layer( assessment: AssessmentsData ): EsriAssessmentFeatureLayer {
        const { longitude, latitude } = assessment;

        const {
            uuid,
            created_at,
            score,
            assessment_name,
            description,
            status,
        } = assessment || {};

        const {
            assessmentType,
            customerUuid,
            fieldUuid,
        } = assessment.payload || {};

        const {
            coverCrop,
            distanceToHomestead,
            fieldType,
            lowTill,
            mulching,
            ownership,
            peopleSupportedByField,
        } = assessment.payload?.conservationAgricultureFormFields || {};

        return {
            geometry: longitude && latitude ? {
                x: longitude,
                y: latitude,
                spatialReference: {
                    wkid: 4326,
                },
            } : undefined,
            attributes: {
                farmer_uuid: uuid,
                created_at: created_at,
                score: score ? parseFloat( score ) : undefined,
                assessment_name: assessment_name,
                description: description,
                status: status,
                assessment_type: assessmentType,
                customer_uuid: customerUuid,
                field_uuid: fieldUuid,
                cover_crop: coverCrop?.answer,
                // eslint-disable-next-line max-len
                distance_to_homestead: distanceToHomestead ? distanceToHomestead.answer : undefined,
                field_type: fieldType,
                low_till: lowTill?.answer,
                mulching: mulching?.answer,
                ownership: ownership?.answer,
                // eslint-disable-next-line max-len
                people_supported_by_field: peopleSupportedByField ? peopleSupportedByField.answer : undefined,
            },
        };
    }

    public build_fields_feature_layer(
        data: SasaPayload
    ): EsriFieldFeatureLayer | EsriFieldFeatureLayer[] | undefined {
        const coordinateData = [];
        const featureLayers = [];

        if (data.fields) {
            if (data.fields.length > 1) {
                console.log( `farmer ${ data.name } - ${ data.uuid } has more than one field` );

                for ( const field of data.fields ) {
                    const newFarmer = data;
                    const fieldCoordinateData = [];

                    newFarmer.fields = [field];

                    if (Array.isArray(data.fields)) {
                        const field = data.fields[0];
                        if ( field["map"] && field["map"].length > 0 ) {
                            for ( const coordinates of field["map"] ) {
                                fieldCoordinateData.push(
                                    [coordinates.longitude, coordinates.latitude]
                                );
                            }

                            if ( fieldCoordinateData && fieldCoordinateData.length > 0 ) {
                                if (
                                    // eslint-disable-next-line max-len
                                    fieldCoordinateData[0][0] !== fieldCoordinateData[fieldCoordinateData.length - 1][0] &&
                                    // eslint-disable-next-line max-len
                                    fieldCoordinateData[0][1] !== fieldCoordinateData[fieldCoordinateData.length - 1][1]
                                ) {
                                    // add to the end of the array to close the polygon
                                    fieldCoordinateData.push(
                                        [fieldCoordinateData[0][0], fieldCoordinateData[0][1]]
                                    );
                                }
                            }
                        }
                    }

                    const geometry = {
                        rings: [fieldCoordinateData],
                        spatialReference: {
                            wkid: 4326,
                        },
                    };

                    const {
                        uuid,
                        name,
                        created_at,
                        updated_at,
                        is_ca_aware,
                    } = data;

                    const {
                        gender,
                        identity_type,
                        identity_number,
                    } = data.demographic || {};

                    const attributes = {
                        farmer_uuid: uuid ? uuid : undefined,
                        farmer_name: name ? name : undefined,
                        farmer_created_at: created_at ? created_at : undefined,
                        farmer_updated_at: updated_at ? updated_at : undefined,
                        farmer_is_ca_aware: is_ca_aware ? is_ca_aware : undefined,
                        // eslint-disable-next-line max-len
                        farmer_field_uuid: data.fields && data.fields[0] ? data.fields[0].uuid : undefined,
                        farmer_gender: gender ? gender : undefined,
                        farmer_identity_type: identity_type ? identity_type : undefined,
                        farmer_identity_number: identity_number ? identity_number : undefined,
                        // eslint-disable-next-line max-len
                        primary_crop: data.fields && data.fields[0].primary_crop ? data.fields[0].primary_crop : undefined,
                        // eslint-disable-next-line max-len
                        area_under_cultivation: data.fields && data.fields[0].area_under_cultivation ? data.fields[0].area_under_cultivation : undefined,
                        // eslint-disable-next-line max-len
                        depot: data.fields && data.fields[0].depot ? data.fields[0].depot : undefined,
                        // eslint-disable-next-line max-len
                        ownership: data.fields && data.fields[0].ownership ? data.fields[0].ownership : undefined,
                        // eslint-disable-next-line max-len
                        number_of_plants: data.fields && data.fields[0].number_of_plants ? data.fields[0].number_of_plants : undefined,
                        // eslint-disable-next-line max-len
                        status: data.fields && data.fields[0].status ? data.fields[0].status : undefined,
                        // eslint-disable-next-line max-len
                        planted_at: data.fields && data.fields[0].planted_at ? data.fields[0].planted_at : undefined,
                        // eslint-disable-next-line max-len
                        score: data.fields && data.fields[0].score ? data.fields[0].score : undefined,
                        // eslint-disable-next-line max-len
                        perimeter: data.fields && data.fields[0].perimeter ? data.fields[0].perimeter : undefined,
                        // eslint-disable-next-line max-len
                        expected_production: data.fields && data.fields[0].expected_production ? data.fields[0].expected_production : undefined,
                        // eslint-disable-next-line max-len
                        expected_production_unit: data.fields && data.fields[0].expected_production_unit ? data.fields[0].expected_production_unit : undefined,
                        // eslint-disable-next-line max-len
                        scored_at: data.fields && data.fields[0].scored_at ? data.fields[0].scored_at : undefined,
                        // eslint-disable-next-line max-len
                        field_type: data.fields && data.fields[0].field_type ? data.fields[0].field_type : undefined,
                    };

                    const polygonLayer = {
                        geometry: fieldCoordinateData.length > 1 ? geometry : undefined,
                        attributes,
                    };

                    featureLayers.push( polygonLayer );
                }

                console.info( "featureLayers", featureLayers );

                return featureLayers;
            }

            if (data.fields) {
                if (Array.isArray(data.fields)) {
                    console.info("farmer.fields is an array: ", data.fields);
                    const field = data.fields[0];
                    if (field["map"] && field["map"].length > 0) {
                        for (const coordinates of field["map"]) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            coordinateData.push([coordinates.longitude, coordinates.latitude]);
                        }
                    }
                }
            }

            if (coordinateData && coordinateData.length > 0) {
                if (
                    coordinateData[0][0] !== coordinateData[coordinateData.length - 1][0] &&
                    coordinateData[0][1] !== coordinateData[coordinateData.length - 1][1]
                ) {
                    // add to the end of the array to close the polygon
                    coordinateData.push(
                        [
                            coordinateData[0][0],
                            coordinateData[0][1],
                        ]
                    );
                }
            }

            const geometry = {
                rings: [coordinateData] || null,
                spatialReference: {
                    wkid: 4326,
                },
            };

            const {
                uuid,
                name,
                created_at,
                updated_at,
                is_ca_aware,
            } = data;

            const {
                gender,
                identity_type,
                identity_number,
            } = data.demographic || {};

            const attributes = {
                farmer_uuid: uuid ? uuid : undefined,
                farmer_name: name ? name : undefined,
                farmer_created_at: created_at ? created_at : undefined,
                farmer_updated_at: updated_at ? updated_at : undefined,
                farmer_is_ca_aware: is_ca_aware ? is_ca_aware : undefined,
                farmer_field_uuid: data.fields && data.fields[0] ? data.fields[0].uuid : undefined,
                farmer_gender: gender ? gender : undefined,
                farmer_identity_type: identity_type ? identity_type : undefined,
                farmer_identity_number: identity_number ? identity_number : undefined,
                // eslint-disable-next-line max-len
                primary_crop: data.fields && data.fields[0].primary_crop ? data.fields [0].primary_crop : undefined,
                // eslint-disable-next-line max-len
                area_under_cultivation: data.fields && data.fields[0].area_under_cultivation ? data.fields[0].area_under_cultivation : undefined,
                depot: data.fields && data.fields[0].depot ? data.fields[0].depot : undefined,
                // eslint-disable-next-line max-len
                ownership: data.fields && data.fields[0].ownership ? data.fields[0].ownership : undefined,
                // eslint-disable-next-line max-len
                number_of_plants: data.fields && data.fields[0].number_of_plants ? data.fields[0].number_of_plants : undefined,
                status: data.fields && data.fields[0].status ? data.fields[0].status : undefined,
                // eslint-disable-next-line max-len
                planted_at: data.fields && data.fields[0].planted_at ? data.fields[0].planted_at : undefined,
                score: data.fields && data.fields[0].score ? data.fields[0].score : undefined,
                // eslint-disable-next-line max-len
                perimeter: data.fields && data.fields[0].perimeter ? data.fields[0].perimeter : undefined,
                // eslint-disable-next-line max-len
                expected_production: data.fields && data.fields[0].expected_production ? data.fields[0].expected_production : undefined,
                // eslint-disable-next-line max-len
                expected_production_unit: data.fields && data.fields[0].expected_production_unit ? data.fields[0].expected_production_unit : undefined,
                // eslint-disable-next-line max-len
                scored_at: data.fields && data.fields[0].scored_at ? data.fields[0].scored_at : undefined,
                // eslint-disable-next-line max-len
                field_type: data.fields && data.fields[0].field_type ? data.fields[0].field_type : undefined,
            };

            console.info("geometry", geometry);
            console.info("attributes", attributes);

            return {
                geometry: coordinateData.length > 1 ? geometry : undefined,
                attributes,
            };
        }

        return;
    }

    // eslint-disable-next-line max-len
    public async create_demographics_feature_layer(demographics_layer: EsriDemographicsFeatureLayer[]): Promise<EsriAddResult[]> {
        try {
            return this.esri_service.add_feature_layer(demographics_layer);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // eslint-disable-next-line max-len
    public async create_assessments_feature_layer(assessments_layer: EsriAssessmentFeatureLayer[]): Promise<EsriAddResult[]> {
        try {
            return this.esri_service.add_feature_layer(assessments_layer);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // eslint-disable-next-line max-len
    public create_fields_feature_layer(fields_layer: EsriFieldFeatureLayer[]): Promise<EsriAddResult[]> {
        try {
            return this.esri_service.add_feature_layer(fields_layer);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
