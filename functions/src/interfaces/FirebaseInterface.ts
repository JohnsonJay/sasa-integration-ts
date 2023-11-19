export enum FeatureState {
    add_pending = "ADD_PENDING",
    add_success = "ADD_SUCCESS",
    add_failure = "ADD_FAILURE",
    update_pending = "UPDATE_PENDING",
    update_success = "UPDATE_SUCCESS",
    update_failure = "UPDATE_FAILURE",
    delete_pending = "DELETE_PENDING",
    delete_success = "DELETE_SUCCESS",
    delete_failure = "DELETE_FAILURE"
}

export enum FeatureLayerType {
    assessments = "ASSESSMENTS",
    fields = "FIELDS",
    demographics = "DEMOGRAPHICS"
}

export enum FeatureLayerDBRef {
    sasa_raw_data = "sasa-raw-data",
    assessments = "assessments-feature-layers",
    demographics = "demographics-feature-layers",
    fields = "fields-feature-layers"
}
