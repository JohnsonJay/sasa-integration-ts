import { SasaService } from "../services/SasaService";

/**
 * Controller class for SasaData
 */
export class SasaController {
    constructor(
        private sasa_service: SasaService
    ) {
    }
    public async getSasaData() {
        return await this.sasa_service.fetch_sasa_data();
    }
}
