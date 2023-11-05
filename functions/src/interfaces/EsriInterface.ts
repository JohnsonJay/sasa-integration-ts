export interface EsriResponse {
    success: boolean;
    addResult: [];
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface EsriAssessmentFeatureLayer {
    geometry?: {
        x: number;
        y: number;
        spatialReference: {
            wkid: number;
        }
    };
    attributes: {
        farmer_uuid?: string;
        farmer_name?: string;
        farmer_gender?: string;
        identity_type?: string;
        identity_number?: string;
        farmer_age?: string;
        birthdate?: string;
        level_of_education?: string;
        work_type?: string;
        employment_status?: string;
        marital_status?: string;
        disability?: string;
        primary_language?: string;
        income?: string;
        dependants?: string;
        transport?: string;
    };
}

export interface EsriFieldFeatureLayer {
    geometry?: {
        rings: [
            [
                Location[]
            ]
        ]
        spatialReference: {
            wkid: number;
        }
    };
    attributes: {
        farmer_uuid?: string;
        farmer_name?: string;
        farmer_field_uuid?: string;
        farmer_gender?: string;
        farmer_identity_type?: string;
        farmer_identity_number?: string;
        farmer_created_at?: string;
    }
}

export interface EsriDemographicsFeatureLayer {
    geometry?: {
        x: number;
        y: number;
        spatialReference: {
            wkid: number;
        }
    };
    attributes: {
        farmer_uuid?: string;
        farmer_name?: string;
        farmer_gender?: string;
        identity_type?: string;
        identity_number?: string;
        farmer_age?: number
        birthdate?: string;
        level_of_education?: string;
        work_type?: string;
        employment_status?: string;
        marital_status?: string;
        disability?: string;
        primary_language?: string;
        income?: number;
        dependants?: string;
        transport?: string;
    };
}
