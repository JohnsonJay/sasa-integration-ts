import { EsriService } from "../services/EsriService";

jest.mock("axios");
fdescribe("testing the esri service class", () => {
    test("class is instantiated", () => {
        const esri_service_class = new EsriService("test_feature_layer_url");
        expect(esri_service_class).toBeDefined();
    });
});
