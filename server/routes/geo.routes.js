import { Router } from "express";

import {
  listCountries,
  listRegionsByCountry,
  listProvincesByRegion,
  listCommunesByProvince,
} from "../controllers/geo.controller.js";

const router = Router();

router.get("/countries", listCountries);
router.get("/countries/:isoCode/regions", listRegionsByCountry);
router.get("/regions/:regionId/provinces", listProvincesByRegion);
router.get("/provinces/:provinceId/communes", listCommunesByProvince);

export default router;