import {
    EsriAssessmentFeatureLayer,
    EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer
} from "../interfaces/EsriInterface";

/**
 * Controller class for Esri Data
 */
export class EsriController {
    /**
     * @param feature_service_url
     */
    constructor(feature_service_url: string) {}

    /**
     * Function used to build out and return an EsriDemographicsFeatureLayer model
     * @param farmer
     * @return EsriDemographicsFeatureLayer
     */
    public build_demographics_feature_layer(): EsriDemographicsFeatureLayer {}

    /**
     * Function used to build out and return an EsriAssessmentFeatureLayer model
     * @return EsriAssessmentFeatureLayer
     */
    public build_assessments_feature_layer(): EsriAssessmentFeatureLayer {}

    /**
     * Function used to build out and return an EsriFieldFeatureLayer model
     * @return EsriFieldFeatureLayer
     */
    public build_fields_feature_layer(): EsriFieldFeatureLayer {}

    public create_demographics_feature_layer(): void {}

    public create_assessments_feature_layer(): void {}

    public create_fields_feature_layer(): void {}
}
