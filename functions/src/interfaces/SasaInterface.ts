export interface Location {
    longitude: number;
    latitude: number;
}

export interface AssessmentsPayloadFieldCorridorAwarenessFormFields {
    fieldRegistrationDate?: string;
    evidenceFieldExpansionOntoElephantCorridor?: string;
    areCorridorsHelping?: string;
}

export interface AssessmentPayloadCorridorsQuestion {
    label?: string;
    answer?: boolean | string;
}

export interface AssessmentPayloadAwarenessFields {
    label?: string;
    explained?: boolean;
}

export interface AssessmentsPayloadAwarenessQuestions {
    areCorridorsHelping?: {
        questionOne?: AssessmentPayloadCorridorsQuestion;
        questionTwo?: AssessmentPayloadCorridorsQuestion;
        questionThree?: AssessmentPayloadCorridorsQuestion;
        questionFour?: AssessmentPayloadCorridorsQuestion;
        questionFive?: AssessmentPayloadCorridorsQuestion;
    },
    awarenessFields?: {
        elephantCorridorsArePathways?: AssessmentPayloadAwarenessFields;
        corridorLocationForLeastDisturbance?: AssessmentPayloadAwarenessFields;
        avoidBlockingElephantCorridors?: AssessmentPayloadAwarenessFields;
        allocatingFieldsOnElephantCorridors?: AssessmentPayloadAwarenessFields;
        // eslint-disable-next-line max-len
        tawanaLandBoardHaveAgreedToAvoidFieldAllocationOnTheseCorridors?: AssessmentPayloadAwarenessFields;
        // eslint-disable-next-line max-len
        elephantCorridorsAreNotProtectedAreasButSharedWithWildlife?: AssessmentPayloadAwarenessFields;
        corridorsInTheEasternPanhandle?: AssessmentPayloadAwarenessFields;
        elephantCorridorsOfferOpportunitiesForEcotourism?: AssessmentPayloadAwarenessFields;
    }
}

export interface ConservationAgricultureFormFields {
    fieldType?: string;
    lowTill?: AssessmentPayloadCorridorsQuestion;
    mulching?: AssessmentPayloadCorridorsQuestion;
    coverCrop: AssessmentPayloadCorridorsQuestion;
    peopleSupportedByField: {
        label?: string;
        answer?: number;
    };
    ownership: AssessmentPayloadCorridorsQuestion;
    distanceToHomestead: {
        label?: string;
        answer?: number;
    };
}

export interface AssessmentsPayload {
    uuid?: string;
    customerUuid?: string;
    assessmentType?: string;
    fieldUuid?: string;
    fieldCorridorAwarenessFormFields?: AssessmentsPayloadFieldCorridorAwarenessFormFields;
    awarenessQuestions?: AssessmentsPayloadAwarenessQuestions;
    conservationAgricultureFormFields?: ConservationAgricultureFormFields;
}
export interface AssessmentsData {
    uuid?: string;
    score?: string;
    assessment_name?: string;
    description?: string;
    status?: string;
    payload?: AssessmentsPayload;
    created_at?: string;
    updated_at?: string;
    longitude?: number;
    latitude?: number;
}

export interface EconomicData {
    dependants?: string;
    transport?: string;
    income_period?: string;
    income?: number;
    adjusted_nett_pay?: number;
    nett_pay?: number;
}

export interface DemographicData {
    gender?: string;
    birthdate?: string;
    level_of_education?: string;
    work_type?: string;
    employment_status: string;
    notes?: string;
    marital_status?: string;
    identity_type?: string;
    identity_number?: string;
    relations?: [],
    geographic_0?: string;
    geographic_1?: string;
    geographic_2?: string;
    geographic_3?: string;
    disability?: string;
    disability_detail?: string;
    primary_language?: string;
    age?: number;
    income?: number;
    income_period?: string;
    location?: Location;
    home_location?: Location;
    work_location?: Location;
    created_at?: string;
    updated_at?: string;
}

export interface MapFieldData {
    accuracy: number;
    longitude: number;
    latitude: number;
}

export interface FieldData {
    uuid?: string;
    location?: Location;
    area?: number;
    area_unit?: string;
    primary_crop?: string;
    area_under_cultivation?: string;
    depot?: string;
    ownership?: string;
    number_of_plants?: number;
    measured_m2?: number;
    name?: string;
    status?: string;
    partner_identifier?: string;
    planted_at?: string;
    score?: number;
    perimeter?: number;
    expected_production?: string;
    expected_production_unit?: string;
    scored_at?: string;
    field_type?: string;
    created_at?: string;
    updated_at?: string;
    map: [MapFieldData]
}

export interface SasaPayload {
    uuid: string;
    msisdn?: string;
    partner_identifier?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
    farm?: any;
    is_ca_aware?: string;
    assessments?: [AssessmentsData];
    economic?: EconomicData;
    demographic?: DemographicData;
    fields?: [FieldData];
}
