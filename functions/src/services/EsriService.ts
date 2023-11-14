import axios, { AxiosResponse } from "axios";
import {
    EsriAddResult,
    EsriAssessmentFeatureLayer, EsriDemographicsFeatureLayer,
    EsriFieldFeatureLayer,
    EsriResponse,
} from "../interfaces/EsriInterface";

export enum FeatureLayerAction {
    add = "ADD",
    remove = "DELETE",
    update = "UPDATE"
}

/**
 * EsriService class used for interacting with ArcGIS via REST
 */
export class EsriService {
    constructor(
        public feature_layer_url: string
    ) {}

    public async add_feature_layer(
        data: EsriAssessmentFeatureLayer |
            EsriFieldFeatureLayer |
            EsriDemographicsFeatureLayer
    ): Promise<EsriAddResult[] | null> {
        const url = `${this.feature_layer_url}/addFeatures?f=json`;
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };
        const form_data = {
            "features": JSON.stringify(data),
        };

        try {
            const result: AxiosResponse<EsriResponse> = await axios.post(url, form_data, config);
            if (result.data.addResults) {
                console.info(result.data.addResults);
                return result.data.addResults;
            }
            return null;
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }

    public async update_feature_layer(data: any):Promise<any> {
        const url = `${this.feature_layer_url}/applyEdits`;
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };
        const form_data = {
            "updates": JSON.stringify(data),
        };

        try {
            const result = await axios.post(url, form_data, config);
            console.info(result);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete_feature_layer(objectId: number) {
        const url = `${this.feature_layer_url}/deleteFeatures?f=json`;
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };
        const form_data = {
            "where": `OBJECTID=${objectId}`,
        };

        try {
            const result = await axios.post(url, form_data, config);
            console.info(result);

            return result;
        } catch (error) {
            console.error(error);
        }
    }

    public async get_all_feature_layers() {
        const url = `${this.feature_layer_url}/query?f=json`;
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };

        try {
            const result = await axios.post(url, {}, config);
            console.info(result);

            return result;
        } catch (error) {
            console.error(error);
        }
    }
}
