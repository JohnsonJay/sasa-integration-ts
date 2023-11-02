import { fetch_sasa_data } from "../services/SasaService";

// interface DateRange {
//     startDate: Date;
//     endDate: Date;
// }

/**
 * Controller class for SasaData
 */
export class SasaController {
    /**
     * function for fetching sasa data
     */
    public async getSasaData() {
        return await fetch_sasa_data();
    }
}
