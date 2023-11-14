import { fetch_sasa_data } from "../services/SasaService";

/**
 * Controller class for SasaData
 */
export class SasaController {
    public async getSasaData() {
        return await fetch_sasa_data();
    }
}
