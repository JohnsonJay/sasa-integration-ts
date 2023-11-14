import {
    EsriAssessmentFeatureLayer,
    EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer,
} from "../interfaces/EsriInterface";
import { AssessmentsData, SasaPayload } from "../interfaces/SasaInterface";
import { google } from "firebase-functions/protos/compiledFirestore";
import type = google.type;

/**
 * Controller class for Esri Data
 */
export class EsriController {
    constructor() {}

    public build_demographics_feature_layer(data: SasaPayload): EsriDemographicsFeatureLayer {
        let location = null;
        if (data.demographic?.location) {
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
    public build_assessments_feature_layer(assessment: AssessmentsData): EsriAssessmentFeatureLayer {
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
            geometry: longitude && latitude ?{
                x: longitude,
                y: latitude,
                spatialReference: {
                    wkid: 4326,
                },
            } : undefined,
            attributes: {
                uuid: uuid,
                created_at: created_at,
                score: score ? parseFloat(score) : undefined,
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

    public build_fields_feature_layer(): EsriFieldFeatureLayer {}

    public create_demographics_feature_layer(): void {}

    public create_assessments_feature_layer(): void {}

    public create_fields_feature_layer(): void {}
}
