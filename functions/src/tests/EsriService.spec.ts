import { EsriService } from "../services/EsriService";
import { EsriAssessmentFeatureLayer } from "../interfaces/EsriInterface";

jest.mock("axios");
describe("testing the esri service class", () => {
    test("class is instantiated", () => {
        const esri_service_class = new EsriService("test_feature_layer_url");
        expect(esri_service_class.feature_layer_url).toBe("test_feature_layer_url");
    });

    test("add_feature_layer", () => {
        const esri_service_class = new EsriService("test_feature_layer");
        let testData: EsriAssessmentFeatureLayer;
        esri_service_class.add_feature_layer(testData);
    });

    test("update_feature_layer", () => {
    });

    test("delete_feature_layer", () => {

    });

    test("get_all_feature_layers", () => {

    });
});
