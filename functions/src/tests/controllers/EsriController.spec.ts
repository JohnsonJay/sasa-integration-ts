import { EsriController } from "../../controllers/EsriController";
import {
    EsriAssessmentFeatureLayer,
    EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer,
} from "../../interfaces/EsriInterface";
import { EsriService } from "../../services/EsriService";
import { AssessmentsData, SasaPayload } from "../../interfaces/SasaInterface";

jest.mock("../../services/EsriService");

describe("Testing EsriController", () => {
    let esriController: EsriController;
    let mockSasaPayloadMultipleFields: SasaPayload;
    let mockEsriService: jest.Mocked<EsriService>;

    beforeEach(() => {
        // Initialize the controller with a mock EsriService
        mockEsriService = new EsriService() as jest.Mocked<EsriService>;
        esriController = new EsriController(mockEsriService);

        mockSasaPayloadMultipleFields = {
            uuid: "123",
            name: "John Doe",
            fields: [
                {
                    uuid: "field1",
                    map: [
                        {
                            latitude: 42.1234,
                            longitude: -71.5678,
                        },
                        {
                            latitude: 42.5678,
                            longitude: -71.1234,
                        },
                        {
                            latitude: 42.1234,
                            longitude: -71.5678,
                        },
                    ],
                },
            ],
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("build_demographics_feature_layer", () => {
        const mockSasaPayload: SasaPayload = {
            uuid: "123",
            name: "John Doe",
            demographic: {
                location: {
                    latitude: 42.1234,
                    longitude: -71.5678,
                },
                gender: "Male",
            },
        };

        test("should build demographics feature layer", () => {
            // eslint-disable-next-line max-len
            const result: EsriDemographicsFeatureLayer = esriController.build_demographics_feature_layer(mockSasaPayload);
            expect(result).toBeDefined();
        });

        test("geometry data should be defined based on schema", () => {
            // eslint-disable-next-line max-len
            const result: EsriDemographicsFeatureLayer = esriController.build_demographics_feature_layer(mockSasaPayload);

            expect(result.geometry).toBeDefined();
            expect(result.geometry).toEqual({
                x: -71.5678,
                y: 42.1234,
                spatialReference: {
                    wkid: 4326,
                },
            });
        });

        test("attributes values exist and are correct", () => {
            // eslint-disable-next-line max-len
            const result: EsriDemographicsFeatureLayer = esriController.build_demographics_feature_layer(mockSasaPayload);
            expect(result.attributes).toBeDefined();

            expect(result.attributes.farmer_uuid).toEqual("123");
            expect(result.attributes.farmer_name).toEqual("John Doe");
            expect(result.attributes.farmer_gender).toEqual("Male");
            expect(result.attributes.identity_type).toEqual(undefined);
            expect(result.attributes.identity_number).toEqual(undefined);
            expect(result.attributes.farmer_age).toEqual(undefined);
            expect(result.attributes.birthdate).toEqual(undefined);
            expect(result.attributes.level_of_education).toEqual(undefined);
            expect(result.attributes.work_type).toEqual(undefined);
            expect(result.attributes.employment_status).toEqual(undefined);
            expect(result.attributes.marital_status).toEqual(undefined);
            expect(result.attributes.disability).toEqual(undefined);
            expect(result.attributes.primary_language).toEqual(undefined);
            expect(result.attributes.income).toEqual(undefined);
            expect(result.attributes.dependants).toEqual(undefined);
            expect(result.attributes.transport).toEqual(undefined);
        });
    });

    describe("build_assessments_feature_layer", () => {
        const mockAssessmentData: AssessmentsData = {
            uuid: "456",
            created_at: "2022-01-05T12:34:56Z",
            score: "85.5",
            payload: {
                uuid: "456",
                assessmentType: "Type A",
                customerUuid: "789",
                fieldUuid: "101",
            },
            latitude: 42.1234,
            longitude: -71.5678,
        };

        test("should build assessments feature layer", () => {
            // eslint-disable-next-line max-len
            const result: EsriAssessmentFeatureLayer = esriController.build_assessments_feature_layer(mockAssessmentData);
            expect(result).toBeDefined();
        });

        test("geometry values exist and are correct", () => {
            // eslint-disable-next-line max-len
            const result: EsriAssessmentFeatureLayer = esriController.build_assessments_feature_layer(mockAssessmentData);

            expect(result.geometry).toBeDefined();
            expect(result.geometry).toEqual({
                x: -71.5678,
                y: 42.1234,
                spatialReference: {
                    wkid: 4326,
                },
            });
        });

        test("attributes values exist and are correct", () => {
            // eslint-disable-next-line max-len
            const result: EsriAssessmentFeatureLayer = esriController.build_assessments_feature_layer(mockAssessmentData);

            expect(result.attributes.farmer_uuid).toEqual("456");
            expect(result.attributes.created_at).toEqual("2022-01-05T12:34:56Z");
            expect(result.attributes.score).toEqual(85.5);
            expect(result.attributes.assessment_name).toEqual(undefined);
            expect(result.attributes.description).toEqual(undefined);
            expect(result.attributes.status).toEqual(undefined);
            expect(result.attributes.assessment_type).toEqual("Type A");
            expect(result.attributes.customer_uuid).toEqual("789");
            expect(result.attributes.field_uuid).toEqual("101");
            expect(result.attributes.cover_crop).toEqual(undefined);
            expect(result.attributes.distance_to_homestead).toEqual(undefined);
            expect(result.attributes.field_type).toEqual(undefined);
            expect(result.attributes.low_till).toEqual(undefined);
            expect(result.attributes.mulching).toEqual(undefined);
            expect(result.attributes.ownership).toEqual(undefined);
            expect(result.attributes.people_supported_by_field).toEqual(undefined);
        });
    });

    describe("build_fields_feature_layer", () => {
        test("data does not contain fields - should return undefined", () => {
            mockSasaPayloadMultipleFields.fields = undefined;
            // eslint-disable-next-line max-len
            const result: EsriFieldFeatureLayer | EsriFieldFeatureLayer[] | undefined = esriController.build_fields_feature_layer(mockSasaPayloadMultipleFields);

            expect(result).toEqual(undefined);
        });

        test("should build fields feature layer", () => {
            const result: EsriFieldFeatureLayer | EsriFieldFeatureLayer[] | undefined = esriController.build_fields_feature_layer(mockSasaPayloadMultipleFields);
            expect(result).toBeDefined();
        });

        test("attribute values exist and are correct", () => {
            const result: EsriFieldFeatureLayer | EsriFieldFeatureLayer[] | undefined = esriController.build_fields_feature_layer(mockSasaPayloadMultipleFields) as EsriFieldFeatureLayer;

            expect(result.attributes).toBeDefined();
            expect(result.attributes).toEqual( {
                "area_under_cultivation": undefined,
                "depot": undefined,
                "expected_production": undefined,
                "expected_production_unit": undefined,
                "farmer_created_at": undefined,
                "farmer_field_uuid": "field1",
                "farmer_gender": undefined,
                "farmer_identity_number": undefined,
                "farmer_identity_type": undefined,
                "farmer_is_ca_aware": undefined,
                "farmer_name": "John Doe",
                "farmer_updated_at": undefined,
                "farmer_uuid": "123",
                "field_type": undefined,
                "number_of_plants": undefined,
                "ownership": undefined,
                "perimeter": undefined,
                "planted_at": undefined,
                "primary_crop": undefined,
                "score": undefined,
                "scored_at": undefined,
                "status": undefined,
            });
        });

        test("geometry values exist and are correct", () => {
            const result: EsriFieldFeatureLayer | EsriFieldFeatureLayer[] | undefined = esriController.build_fields_feature_layer(mockSasaPayloadMultipleFields) as EsriFieldFeatureLayer;

            expect(result.geometry).toBeDefined();
            expect(result.geometry).toEqual( {
                "rings": [
                    [
                        [-71.5678, 42.1234],
                        [-71.1234, 42.5678],
                        [-71.5678, 42.1234],
                    ],
                ],
                "spatialReference": {
                    "wkid": 4326,
                },
            });
        });
    });

    describe("create_demographics_feature_layer", () => {
        const testDemographicsLayer: EsriDemographicsFeatureLayer[] = [
            {
                geometry: {
                    x: -71.5678,
                    y: 42.1234,
                    spatialReference: {
                        wkid: 4326,
                    },
                },
                attributes: {
                    farmer_uuid: "123",
                    farmer_name: "John Doe",
                    farmer_gender: "Male",
                    identity_type: undefined,
                    identity_number: undefined,
                    farmer_age: undefined,
                    birthdate: undefined,
                    level_of_education: undefined,
                    work_type: undefined,
                    employment_status: undefined,
                    marital_status: undefined,
                    disability: undefined,
                    primary_language: undefined,
                    income: undefined,
                    dependants: undefined,
                    transport: undefined,
                },
            },
        ];

        it("should call esri_service.add_feature_layer with the provided demographics_layer", async () => {
            mockEsriService.add_feature_layer.mockResolvedValueOnce([{ success: true, objectId: 1 }]);
            await esriController.create_demographics_feature_layer(testDemographicsLayer);

            expect(mockEsriService.add_feature_layer).toHaveBeenCalledWith(testDemographicsLayer);
            expect(mockEsriService.add_feature_layer).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if esri_service.add_feature_layer throws an error", async () => {
            const errorMessage = "Test error message";

            // Typecast the mock to any to avoid TypeScript error
            (mockEsriService.add_feature_layer as any).mockRejectedValue(new Error(errorMessage));

            try {
                await esriController.create_demographics_feature_layer(testDemographicsLayer);
            } catch (error) {
                const errorWithMessage = error as Error;
                expect(errorWithMessage.message).toBe(errorMessage);
            }
        });
    });
});
